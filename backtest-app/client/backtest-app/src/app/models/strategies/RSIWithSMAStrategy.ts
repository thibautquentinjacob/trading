/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 8:54:48 pm
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Sunday, 5th May 2019 11:39:43 pm
 * Modified By: Licoffe (p1lgr11m@gmail.com>)
 * -----
 * License:
 * MIT License
 *
 * Copyright (c) 2019 Licoffe
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

export class RSIWithSMAStrategy extends Strategy {

    constructor ( name: string ) {
        super( name );
        this.name = 'RSI + SMA';
    }

    /**
     * Buy if RSI is superior to 50
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public static shouldBuy( data: {[key: string]: number }): StrategicDecision {
        if ( data.rsi > 50 && data.macd >= 0.01 ) {
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
     * Sell if RSI is below 50
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public static shouldSell( data: {[key: string]: number }): StrategicDecision {
        if ( data.rsi <= 50 && data.macd <= -0.01  ) {
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
