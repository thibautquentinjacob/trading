/*
 * File: rsi.ts
 * Project: backtest-app
 * File Created: Wednesday, 12th June 2019 8:41:28 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Monday, 17th June 2019 11:12:51 pm
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

import { EChartOption } from 'echarts';
import { ChartDescription } from '../ChartDescription';

export class RSI extends ChartDescription {
    constructor(names: string[], data: number[][], colors: string[]) {
        super(names, data, colors);
    }

    public generateDescription(): EChartOption.SeriesLine[] {
        return [
            {
                name: this.names[0],
                data: this.data[0],
                type: 'line',
                xAxisIndex: 2,
                yAxisIndex: 2,
                symbol: 'circle',
                symbolSize: 0,
                lineStyle: {
                    color: this.colors[0],
                    width: 1,
                },
                markLine: {
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            symbol: 'none',
                            yAxis: 70,
                            lineStyle: {
                                width: 1,
                                color: this.colors[1],
                                opacity: 0.5,
                            },
                        },
                        {
                            symbol: 'none',
                            yAxis: 30,
                            lineStyle: {
                                width: 1,
                                color: this.colors[2],
                                opacity: 0.5,
                            },
                        },
                        {
                            symbol: 'none',
                            yAxis: 50,
                            lineStyle: {
                                width: 1,
                                color: this.colors[3],
                                opacity: 0.3,
                            },
                        },
                    ],
                },
            },
        ];
    }
}
