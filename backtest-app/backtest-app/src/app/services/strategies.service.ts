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
import { BehaviorSubject, Observable } from 'rxjs';
import * as Strategies from '../models/strategies';
import { Strategy } from '../models/Strategy';

@Injectable({
    providedIn: 'root',
})
export class StrategiesService {
    private _currentStrategy: Strategy = new Strategies.CCIStrategy();
    private _currentStrategy$: BehaviorSubject<Strategy> = new BehaviorSubject(
        this._currentStrategy
    );
    private _currentStrategyName$: BehaviorSubject<
        string
    > = new BehaviorSubject(this._currentStrategy.title);
    private _strategies$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    private _loadedStrategies: { [key: string]: Strategy };

    public readonly currentStrategy$: Observable<
        Strategy
    > = this._currentStrategy$.asObservable();
    public readonly currentStrategyName$: Observable<
        string
    > = this._currentStrategyName$.asObservable();
    public readonly strategies$: Observable<
        string[]
    > = this._strategies$.asObservable();

    constructor() {
        // Load strategies dynamically
        this._loadedStrategies = {};
        Object.keys(Strategies).forEach((strategy: string) => {
            const strategyInstance: Strategy = new Strategies[strategy]();
            this._loadedStrategies[strategyInstance.title] = strategyInstance;
        });

        const strategyNames: string[] = [];
        const keys: string[] = Object.keys(this._loadedStrategies);
        for (let i = 0, size = keys.length; i < size; i++) {
            strategyNames.push(this._loadedStrategies[keys[i]].title);
        }
        this._strategies$.next(strategyNames);
    }

    public setCurrentStrategy(strategyName: string) {
        this._currentStrategyName$.next(strategyName);
        this._currentStrategy$.next(this._loadedStrategies[strategyName]);
    }
}
