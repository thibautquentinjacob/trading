/*
 * File: server.js
 * Project: server
 * File Created: Tuesday, 19th March 2019 12:21:16 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Friday, 6th September 2019 11:35:36 pm
 * Modified By: Thibaut Jacob (thibautquentinjacob@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2019 Thibaut Jacob
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import { AccountController } from './controllers/AccountController';
import { Account } from './models/Account';
import { yellow } from 'colors';
import { ClockController } from "./controllers/ClockController";
import { Clock } from "./models/Clock";
import { QuoteController } from './controllers/QuoteController';
import { Quote } from './models/Quote';
import { Constants } from './constants';
import { StrategicDecision } from './models/StragegicDecision';
import { OrderController } from './controllers/OrderController';
import { Side } from './models/Side';
import { OrderType } from './models/OrderType';
import { TimeInForce } from './models/TimeInForce';
import { PositionController } from './controllers/PositionController';
import { Position } from './models/Position';
import { Logger } from './models/Logger';
import { strategies } from './models/strategies/index';
import { Strategy } from './models/Strategy';
import { StockData } from './models/StockData';
import { Helper } from './Helper';
import { OperationState } from './models/OperationState';

console.log( yellow( `
.▄▄ · ▄▄▄▄▄      ▐▄• ▄ 
▐█ ▀. •██  ▪      █▌█▌▪
▄▀▀▀█▄ ▐█.▪ ▄█▀▄  ·██· 
▐█▄▪▐█ ▐█▌·▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀▀▀  ▀█▄▀▪•▀▀ ▀▀
`));

const logger:            Logger   = new Logger( 'log.txt' );
let   marketOpened:      boolean  = false;
const quotes:            Quote[]  = [];
const strategy:          Strategy = strategies[Constants.DEFAULT_STRATEGY];
if ( !strategy ) {
    console.log( Helper.formatLog(
        'init',
        `Unknown strategy ${Constants.DEFAULT_STRATEGY}. Available strategies are ${Object.keys( strategies )}`, 'Check',
        OperationState.FAILURE )
    );
    process.exit( -1 );
} else {
    console.log( Helper.formatLog(
        'init',
        `Using strategy ${Constants.DEFAULT_STRATEGY}`, 'Check',
        OperationState.SUCCESS )
    );
}

console.log( Helper.formatLog(
    'init',
    `Starting new trading session`, 'Bootstrap',
    OperationState.SUCCESS )
);
logger.log( 'Starting new trading session' );

/**
 * Display account state (cash and equities)
 * 
 * @param {Account} account - Account object
 */
function displayAccount ( account: Account ): void {
    console.log( Helper.formatLog(
        'global',
        `Portfolio status\n
    Total:  $${account.portfolioValue}
    Cash:   $${account.cash}
    Stocks: $${account.portfolioValue - account.cash}
    \n`, 'Check',
        OperationState.SUCCESS )
    );
}

/**
 * Check if we should buy stocks according to the current
 * strategy.
 * 
 * @param {StockData} data - Information needed to make a decision
 * @returns {StrategicDecision} A decision
 */
function shouldBuy ( data: StockData ): StrategicDecision {
    return strategy.shouldBuy( data, logger );
}

/**
 * Check if we should sell stocks according to the current
 * strategy.
 * 
 * @param {StockData} data - Information needed to make a decision
 * @returns {StrategicDecision} A decision
 */
function shouldSell ( data: StockData ): StrategicDecision {
    return strategy.shouldSell( data, logger );
}

/**
 * Implement the buy logic
 * 
 * @param {data} StockData - Technical indicator data
 */
function buyLogic ( data: StockData ): void {
    // Get buy decision
    const buyDecision: StrategicDecision = shouldBuy( data );
    if ( buyDecision.decision && ( buyDecision.amount > 0 || buyDecision.amount === -1 )) {
        // Get current cash amount
        AccountController.get().then(( account: Account ) => {
            const cash:   number = account.cash - Constants.MIN_DAY_TRADE_CASH_AMOUNT;
            // Compute the volume we can buy
            const amount: number = Math.floor( cash / buyDecision.price );
            if ( buyDecision.amount === -1 && amount > 0 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.IOC
                );
                console.log( `Buying ${amount} x ${Constants.TRADED_SYMBOL} for ${buyDecision.price * amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${amount} x ${buyDecision.price}\t${buyDecision.price * amount}` );
            } else if ( buyDecision.amount !== -1 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    buyDecision.amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.IOC,
                );
                console.log( `Buying ${buyDecision.amount} x ${Constants.TRADED_SYMBOL} for ${buyDecision.price * buyDecision.amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${buyDecision.amount} x ${buyDecision.price}\t${buyDecision.price * buyDecision.amount}` );
            }
        });
    }
}

/**
 * Implement the sell logic
 * 
 * @param {StockData} data - Technical indicator data
 */
function sellLogic ( data: StockData ): void {
    // Get sell decision
    const sellDecision: StrategicDecision = shouldSell( data );
    if ( sellDecision.decision && ( sellDecision.amount > 0 || sellDecision.amount === -1 )) {
        // Fetch the volume we own for traded symbol
        PositionController.getBySymbol( Constants.TRADED_SYMBOL ).then(( position: Position ) => {
            const amount: number = position.qty;
            if ( sellDecision.amount === -1 && amount > 0 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.IOC,
                );
                console.log( `Selling ${amount} x ${Constants.TRADED_SYMBOL} for ${sellDecision.price * amount}` );
                logger.log( `SELL\t${Constants.TRADED_SYMBOL}\t${amount} x ${sellDecision.price}\t${sellDecision.price * amount}` );
            } else if ( sellDecision.amount !== -1 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    sellDecision.amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.IOC,
                );
                console.log( `Selling ${sellDecision.amount} x ${Constants.TRADED_SYMBOL} for ${sellDecision.price * sellDecision.amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${sellDecision.amount} x ${sellDecision.price}\t${sellDecision.price * sellDecision.amount}` );
            }
        }).catch(() => {});
    }
}


// Use the clock controller to check for opening time
// Check if the market is open or closed
ClockController.get().then(( clock: Clock ) => {
    marketOpened               = clock.isOpen
    const marketStatus: string = marketOpened ? 'opened': 'closed';
    console.log( Helper.formatLog(
        'global',
        `Market is ${marketStatus}`, 'Check',
        OperationState.SUCCESS )
    );
}).catch(( err: any ) => {
    console.log( `Error raised: ${err}` );
});

// Fetch latest symbol quote every minutes
setInterval(() => {
    // If market is opened, fetch latest quotes
    if ( marketOpened ) {

        // Bootstrap data structures
        const initResult: {
            data:             StockData,
            indicators:       {[key: string]: string },
            indicatorOptions: {[key: string]: number[]},
            dataColumns:      {[key: string]: string[]}
        } = Helper.initializeData( strategy );

        let   data:             StockData                 = initResult.data;
        const indicators:       {[key: string]: string }  = initResult.indicators;
        const indicatorOptions: {[key: string]: number[]} = initResult.indicatorOptions;
        const dataColumns:      {[key: string]: string[]} = initResult.dataColumns;

        // If no quotes have been fetched yet, get all quotes
        if ( quotes.length === 0 ) {
            QuoteController.getQuotes( Constants.TRADED_SYMBOL ).then(( quotes: Quote[] ) => {

                quotes = quotes;

                // Build a QuoteCollection to compute indicator values
                // for our data.
                data = Helper.computeIndicators(
                    quotes,
                    indicators,
                    indicatorOptions,
                    dataColumns,
                    strategy,
                    data
                );

                // Buy and Sell logic here
                buyLogic( data );
                sellLogic( data );
            }).catch(( err: any ) => {
                console.log( err );
            });
        } else {
            QuoteController.getLastQuote( Constants.TRADED_SYMBOL ).then(( quote: Quote ) => {
                // If current quote is null, use last one
                const quotesAmount: number = quotes.length;
                if ( !quote.open && quotesAmount > 0 && quotes[quotesAmount - 1].open ) {
                    quote.open  = quotes[quotesAmount - 1].open;
                    quote.high  = quotes[quotesAmount - 1].high;
                    quote.low   = quotes[quotesAmount - 1].low;
                    quote.close = quotes[quotesAmount - 1].close;
                }
                quotes.push( quote );
                
                // Build a QuoteCollection to compute indicator values
                // for our data.
                data = Helper.computeIndicators(
                    quotes,
                    indicators,
                    indicatorOptions,
                    dataColumns,
                    strategy,
                    data
                );

                // Buy and Sell logic here
                buyLogic( data );
                sellLogic( data );

            }).catch(( err: any ) => {
                console.log( `Error raised: ${err}` );
            });
        }
    }
}, Constants.STRATEGY_UPDATE_FREQ );

// Refresh market status every minute
setInterval(() => {
    ClockController.get().then(( clock: Clock ) => {
        marketOpened = clock.isOpen
        const marketStatus: string = marketOpened ? 'opened': 'closed';
        console.log( Helper.formatLog(
            'global',
            `Market is ${marketStatus}`, 'Check',
            OperationState.SUCCESS )
        );
    }).catch(( err: any ) => {
        console.log( `Error raised: ${err}` );
    });
}, Constants.METRICS_UPDATE_FREQ );

// Refresh account state every minute
AccountController.get().then(( account: Account ) => {
    displayAccount( account );
}).catch(( err: any ) => {
    console.log( `Error raised: ${err}` );
});
setInterval(() => {
    AccountController.get().then(( account: Account ) => {
        displayAccount( account );
    }).catch(( err: any ) => {
        console.log( `Error raised: ${err}` );
    });
}, Constants.METRICS_UPDATE_FREQ );