/*
 * File: symbols.service.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 9:56:02 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Friday, 21st June 2019 8:16:04 pm
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



import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RSIStrategy } from '../models/strategies/RSIStrategy';
// import { RSIStrategy_33_66 } from '../models/strategies/RSIStrategy_33_66';
// import { RSIWithSMAStrategy } from '../models/strategies/RSIWithSMAStrategy';
import { Strategy } from '../models/Strategy';
import { SMAStrategy } from '../models/strategies/SMAStrategy';
import { EMAStrategy } from '../models/strategies/EMAStrategy';

@Injectable({
    providedIn: 'root'
})
export class StrategiesService {

    public  currentStrategy:     BehaviorSubject<Strategy> = new BehaviorSubject( new EMAStrategy());
    public  currentStrategyName: BehaviorSubject<string>   = new BehaviorSubject( this.currentStrategy.value.title );
    public  strategies:          BehaviorSubject<string[]> = new BehaviorSubject([]);
    private _loadedStrategies: {[key: string]: Strategy }  = {
        'RSI': new RSIStrategy(),
        'EMA': new EMAStrategy(),
        'SMA': new SMAStrategy()
    };

    constructor() {
        this.strategies.next([
            'RSI',
            'SMA',
            'EMA'
        ]);
    }

    public setCurrentStrategy( strategyName: string ) {
        console.log( this._loadedStrategies );
        console.log( `Setting current strategy to ${strategyName}` );
        this.currentStrategyName.next( strategyName );
        this.currentStrategy.next( this._loadedStrategies[strategyName]);
    }
}
