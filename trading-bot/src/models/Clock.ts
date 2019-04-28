/*
 * File: Clock.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:40 am
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Thursday, 4th April 2019 12:18:27 am
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



import { Adapter } from './Adapter';

export interface Clock {

    timestamp: number;
    isOpen:    boolean;
    nextOpen:  Date;
    nextClose: Date;

}

// Build Clock object out of API data
export class ClockAdapter implements Adapter<Clock> {

    public adapt( clockData: any ): Clock {
        return {
            timestamp:  clockData.timestamp,
            isOpen:     clockData.is_open,
            nextOpen:   new Date( clockData.next_open ),
            nextClose:  new Date( clockData.next_close )
        }
    }

}