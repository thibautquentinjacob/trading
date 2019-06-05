/*
 * File: server.js
 * Project: server
 * File Created: Tuesday, 19th March 2019 12:21:16 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th June 2019 10:25:17 pm
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
import { indicators } from 'tulind';
import { StrategicDecision } from './models/StragegicDecision';
import { RSIWithMacDStrategy } from './models/strategies/RSIWithMacDStrategy';
import { OrderController } from './controllers/OrderController';
import { Side } from './models/Side';
import { OrderType } from './models/OrderType';
import { TimeInForce } from './models/TimeInForce';
import { PositionController } from './controllers/PositionController';
import { Position } from './models/Position';
import { Logger } from './models/Logger';

console.log( yellow( `
.▄▄ · ▄▄▄▄▄      ▐▄• ▄ 
▐█ ▀. •██  ▪      █▌█▌▪
▄▀▀▀█▄ ▐█.▪ ▄█▀▄  ·██· 
▐█▄▪▐█ ▐█▌·▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀▀▀  ▀█▄▀▪•▀▀ ▀▀
`));

const logger:            Logger                                    = new Logger( 'log.txt' );
let   marketOpened:      boolean                                   = false;
const quotes:            Quote[]                                   = [];
const indicatorsOptions: {[key: string]: {[key: string]: number }} = {
    rsi: {
        period: 14
    },
    macd: {
        short_period:  2,
        long_period:   5,
        signal_period: 9
    }
};

logger.log( 'Starting new trading session' );

function displayAccount ( account: Account ): void {
    console.log(`
    Cash:   $${account.cash}
    Stocks: $${account.portfolioValue}
    `);
}

function shouldBuy ( data: {[key: string]: number | Date }): StrategicDecision {
    return RSIWithMacDStrategy.shouldBuy( data );
}

function shouldSell ( data: {[key: string]: number | Date }): StrategicDecision {
    return RSIWithMacDStrategy.shouldSell( data );
}

function buyLogic ( price: number, data: {[key: string]: number | Date }): void {
    const buyDecision: StrategicDecision = shouldBuy( data );
    if ( buyDecision.decision && ( buyDecision.amount > 0 || buyDecision.amount === -1 )) {
        // Get current cash amount
        AccountController.get().then(( account: Account ) => {
            const cash:   number = account.cash;
            const amount: number = Math.floor( cash / price );
            if ( buyDecision.amount === -1 && amount > 0 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                );
                console.log( `Buying ${amount} x ${Constants.TRADED_SYMBOL} for ${price * amount}` );
                logger.log( `Buying ${amount} x ${Constants.TRADED_SYMBOL} for ${price * amount}` );
            } else if ( buyDecision.amount !== -1 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    buyDecision.amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                );
                console.log( `Buying ${buyDecision.amount} x ${Constants.TRADED_SYMBOL} for ${price * buyDecision.amount}` );
                logger.log( `Buying ${buyDecision.amount} x ${Constants.TRADED_SYMBOL} for ${price * buyDecision.amount}` );
            }
        });
    }
}

function sellLogic ( price: number, data: {[key: string]: number | Date }): void {
    const sellDecision: StrategicDecision = shouldSell( data );
    if ( sellDecision.decision && ( sellDecision.amount > 0 || sellDecision.amount === -1 )) {
        PositionController.getBySymbol( Constants.TRADED_SYMBOL ).then(( position: Position ) => {
            const amount: number = position.qty;
            if ( sellDecision.amount === -1 && amount > 0 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                );
                console.log( `Selling ${amount} x ${Constants.TRADED_SYMBOL} for ${price * amount}` );
                logger.log( `Selling ${amount} x ${Constants.TRADED_SYMBOL} for ${price * amount}` );
            } else if ( sellDecision.amount !== -1 ) {
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    sellDecision.amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                );
                console.log( `Selling ${sellDecision.amount} x ${Constants.TRADED_SYMBOL} for ${price * sellDecision.amount}` );
                logger.log( `Selling ${sellDecision.amount} x ${Constants.TRADED_SYMBOL} for ${price * sellDecision.amount}` );
            }
        })
    }
}

function computeIndicators ( data: Quote[], options: {[key: string]: {[key: string]: number }}): {[key: string]: number[][] } {
    const open:      number[]   = [];
    let rsiMetrics:  number[][] = [];
    let macdMetrics: number[][] = [];
    for ( let i = 0, size = data.length ; i < size ; i++ ) {
        open.push( data[i].open );
    }
    indicators.rsi.indicator( [open], [options['rsi']['period']], ( err: string, results: number[][] ) => {
        rsiMetrics = results;
        console.log( err );
    });

    indicators.macd.indicator(
        [open],
        [
            options['macd']['short_period'],
            options['macd']['long_period'],
            options['macd']['signal_period']
        ], ( err: string, results: number[][] ) => {
            console.log( results );
            macdMetrics = results;
        console.log( err );
    });

    return {
        rsi:  rsiMetrics,
        macd: macdMetrics
    };
}

// Use the clock controller to check for opening time
// Check if the market is open or closed
ClockController.get().then(( clock: Clock ) => {
    marketOpened               = clock.isOpen
    const marketStatus: string = marketOpened ? 'opened': 'closed';
    console.log( `Market is ${marketStatus}` );
}).catch(( err: any ) => {
    console.log( err );
});

// If no quotes have been fetched yet, get all quotes
if ( marketOpened ) {
    if ( quotes.length === 0 ) {
        QuoteController.getQuotes( Constants.TRADED_SYMBOL ).then(( allQuotes: Quote[] ) => {
            for ( let i = 0, size = allQuotes.length ; i < size ; i++ ) {
                quotes.push( allQuotes[i] );
            }
            // Compute indicators
            const metrics: {[key: string]: number[][]}     = computeIndicators( quotes, indicatorsOptions );
            const data:    {[key: string]: number | Date } = {
                rsi:   metrics['rsi'][0][metrics['rsi'][0].length - 1],
                macd:  metrics['macd'][1][metrics['macd'][1].length - 1],
                time:  new Date()
            };
            // Buy and Sell logic here
            buyLogic( quotes[quotes.length - 1].open, data );
            sellLogic( quotes[quotes.length - 1].open, data );
        }).catch(( err: any ) => {
            console.log( err );
        });
    }
}

// Fetch latest symbol quote every minutes
setInterval(() => {
    // If market is opened, fetch latest quotes
    if ( marketOpened ) {
        // If no quotes have been fetched yet, get all quotes
        if ( quotes.length === 0 ) {
            QuoteController.getQuotes( Constants.TRADED_SYMBOL ).then(( allQuotes: Quote[] ) => {
                for ( let i = 0, size = allQuotes.length ; i < size ; i++ ) {
                    quotes.push( allQuotes[i] );
                }
                // Compute indicators
                const metrics: {[key: string]: number[][]}     = computeIndicators( quotes, indicatorsOptions );
                const data:    {[key: string]: number | Date } = {
                    rsi:  metrics['rsi'][0][metrics['rsi'][0].length - 1],
                    macd: metrics['macd'][1][metrics['macd'][1].length - 1],
                    time: new Date()
                };
                // Buy and Sell logic here
                buyLogic( quotes[quotes.length - 1].open, data );
                sellLogic( quotes[quotes.length - 1].open, data );
            }).catch(( err: any ) => {
                console.log( err );
            });
        } else {
            QuoteController.getLastQuote( Constants.TRADED_SYMBOL ).then(( quote: Quote ) => {
                quotes.push( quote );
                // Compute indicators
                const metrics: {[key: string]: number[][]} = computeIndicators( quotes, indicatorsOptions );
                const data:    {[key: string]: number}     = {
                    rsi:  metrics['rsi'][0][metrics['rsi'][0].length - 1],
                    macd: metrics['macd'][1][metrics['macd'][1].length - 1],
                };
                // Buy and Sell logic here
                buyLogic( quotes[quotes.length - 1].open, data );
                sellLogic( quotes[quotes.length - 1].open, data );
            }).catch(( err: any ) => {
                console.log( err );
            });
        }
    }
}, 60 * 1000 );

// Refresh market status every minute
setInterval(() => {
    ClockController.get().then(( clock: Clock ) => {
        marketOpened = clock.isOpen
        const marketStatus: string = marketOpened ? 'opened': 'closed';
        console.log( `Market is ${marketStatus}` );
    }).catch(( err: any ) => {
        console.log( err );
    });
}, 60 * 1000 );

// Refresh account state every minute
AccountController.get().then(( account: Account ) => {
    displayAccount( account );
}).catch(( err: any ) => {
    console.log( err );
});
setInterval(() => {
    AccountController.get().then(( account: Account ) => {
        displayAccount( account );
    }).catch(( err: any ) => {
        console.log( err );
    });
}, 60 * 1000 );