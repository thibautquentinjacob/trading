/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 8:54:48 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th June 2019 12:23:38 am
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



import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';
import { Logger } from '../Logger';

export class RSIWithMacDStrategy extends Strategy {

    constructor ( name: string ) {
        super( name );
        this.name = 'RSI + Mac-D';
    }

    /**
     * Buy if RSI is superior to 50 and macd >= 0.01 and if we have at least
     * 15 minutes before market close.
     *
     * @override
     * @param {[key: string]: number | Date } data - Market data
     * @param {Logger} logger - Logger to use
     * @returns {StrategicDecision}
     */
    public static shouldBuy(
        data: {[key: string]: number | Date },
        logger: Logger
    ): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        if ( data.rsi > 50 && data.macd >= 0.01 && timeDiffMinutes > 15 ) {
            logger.log( `Conditions met to send buy order : ${data.rsi} > 50 = ${data.rsi > 50}, ${data.macd} >= 0.01 = ${data.macd >= 0.01}, ${timeDiffMinutes} > 15 = ${timeDiffMinutes > 15}` );
            return {
                amount:   -1,
                decision: true
            };
        } else {
            return {
                amount:   0,
                decision: false
            };
        }
    }

    /**
     * Sell if (RSI is below 50 and macd below or equal to 0.01) or if market
     * closes in less than 15 minutes.
     *
     * @override
     * @param {[key: string]: number | Date } data - Market data
     * @param {Logger} logger - Logger to use
     * @returns {StrategicDecision}
     */
    public static shouldSell(
        data:   {[key: string]: number | Date },
        logger: Logger
    ): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        if (( data.rsi <= 50 && data.macd <= -0.01 ) || timeDiffMinutes < 15 ) {
            logger.log( `Conditions met to send sell order : ${data.rsi} <= 50 = ${data.rsi <= 50}, ${data.macd} <= -0.01 = ${data.macd <= -0.01}, ${timeDiffMinutes} < 15 = ${timeDiffMinutes < 15}` );
            return {
                amount:   -1,
                decision: true
            };
        } else {
            return {
                amount:   0,
                decision: false
            };
        }
    }

}
