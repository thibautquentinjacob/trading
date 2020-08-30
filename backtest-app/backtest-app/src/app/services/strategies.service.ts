/*
 * File: symbols.service.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 9:56:02 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Sunday, 1st September 2019 3:46:13 pm
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
import { CCIStrategy } from '../models/strategies/CCIStrategy';
import { EMACCIStrategy } from '../models/strategies/EMACCIStrategy';
import { RSIStrategy } from '../models/strategies/RSIStrategy';
import { SMAStrategy } from '../models/strategies/SMAStrategy';
import { Strategy } from '../models/Strategy';

@Injectable({
    providedIn: 'root',
})
export class StrategiesService {
    public currentStrategy: BehaviorSubject<Strategy> = new BehaviorSubject(
        new CCIStrategy()
    );
    public currentStrategyName: BehaviorSubject<string> = new BehaviorSubject(
        this.currentStrategy.value.title
    );
    public strategies: BehaviorSubject<string[]> = new BehaviorSubject([]);
    private _loadedStrategies: { [key: string]: Strategy } = {
        RSI: new RSIStrategy(),
        CCI: new CCIStrategy(),
        SMA: new SMAStrategy(),
        'EMA + CCI': new EMACCIStrategy(),
    };

    constructor() {
        const strategyNames: string[] = [];
        const keys: string[] = Object.keys(this._loadedStrategies);
        for (let i = 0, size = keys.length; i < size; i++) {
            strategyNames.push(this._loadedStrategies[keys[i]].title);
        }
        this.strategies.next(strategyNames);
    }

    public setCurrentStrategy(strategyName: string) {
        console.log(this._loadedStrategies);
        console.log(`Setting current strategy to ${strategyName}`);
        this.currentStrategyName.next(strategyName);
        this.currentStrategy.next(this._loadedStrategies[strategyName]);
    }
}
