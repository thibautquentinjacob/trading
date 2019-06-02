/*
 * File: symbols.service.1.ts
 * Project: backtest-app
 * File Created: Sunday, 5th May 2019 9:56:02 pm
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Sunday, 5th May 2019 10:08:28 pm
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



import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StrategiesService {

    public  currentStrategy: BehaviorSubject<string>   = new BehaviorSubject( 'RSI' );
    public  strategies:      BehaviorSubject<string[]> = new BehaviorSubject([]);

    constructor() {
        this.strategies.next([
            'RSI',
            'RSI 33/66',
            'RSI + SMA'
        ]);
    }

    public setCurrentStrategy( strategyName: string ) {
        console.log( `Setting current strategy to ${strategyName}` );
        this.currentStrategy.next( strategyName );
    }
}
