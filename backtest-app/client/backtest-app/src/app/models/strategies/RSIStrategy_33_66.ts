/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Tuesday, 30th April 2019 11:54:31 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 19th June 2019 12:19:22 am
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

export class RSIStrategy_33_66 extends Strategy {

    public static title: string = 'RSI 33/66';
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
        }
    };

    /**
     * Buy if RSI is superior to 66
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        if ( data.rsi > 66 ) {
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
     * Sell if RSI is below 33
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        if ( data[data.length].rsi <= 33 ) {
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
