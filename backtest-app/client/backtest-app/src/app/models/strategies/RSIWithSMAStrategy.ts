/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 8:54:48 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 18th June 2019 12:37:59 am
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
import { Indicator } from '../Indicator';
import { StockData } from '../StockData';

export class RSIWithSMAStrategy extends Strategy {

    public static title: string = 'RSI + Mac-D';
    public static indicators: {
        [key: string]: Indicator
    } = {
        rsi: {
            name:    'rsi',
            options: [7],
            metric:  'open',
            output:  ['output']
        },
        macd: {
            name:    'macd',
            options: [1, 8, 6],
            metric:  'open',
            output:  ['short', 'long', 'signal']
        },
        sma12: {
            name:    'sma',
            options: [12],
            metric:  'open',
            output:  ['output']
        },
        sma26: {
            name:    'sma',
            options: [26],
            metric:  'open',
            output:  ['output']
        }
    };

    /**
     * Buy if RSI is superior to 50 and macd >= 0.01 and if we have at least
     * 15 minutes before market close.
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 16, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        if ( data.rsi > 50 && data.macd >= 0.01 && timeDiffMinutes > 15 ) {
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
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 16, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        if (( data.rsi <= 50 && data.macd <= -0.01 ) || timeDiffMinutes < 15 ) {
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
