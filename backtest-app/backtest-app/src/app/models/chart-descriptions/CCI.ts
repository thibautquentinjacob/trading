/*
 * File: macd.ts
 * Project: backtest-app
 * File Created: Wednesday, 12th June 2019 8:42:12 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Thursday, 8th August 2019 9:06:03 pm
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

import { EChartOption, graphic } from 'echarts';
import { ChartDescription } from '../ChartDescription';

export class CCI extends ChartDescription {
    constructor(names: string[], data: number[][], colors: string[]) {
        super(names, data, colors);
    }

    public generateDescription(): EChartOption.SeriesLine[] {
        return [
            {
                name: this._names[0],
                data: this._data[0],
                type: 'line',
                xAxisIndex: 3,
                yAxisIndex: 3,
                symbol: 'circle',
                symbolSize: 0,
                lineStyle: {
                    width: 1,
                    color: this._colors[0],
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(0, 158, 68, 0.2)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(0, 158, 68, 0.5)',
                        },
                    ]),
                },
                markLine: {
                    label: {
                        show: false,
                    },
                    data: [
                        {
                            symbol: 'none',
                            yAxis: 100,
                            lineStyle: {
                                width: 1,
                                color: this._colors[1],
                                opacity: 0.5,
                            },
                        },
                        {
                            symbol: 'none',
                            yAxis: -100,
                            lineStyle: {
                                width: 1,
                                color: this._colors[2],
                                opacity: 0.5,
                            },
                        },
                        {
                            symbol: 'none',
                            yAxis: 0,
                            lineStyle: {
                                width: 1,
                                color: this._colors[3],
                                opacity: 0.3,
                            },
                        },
                    ],
                },
            },
        ];
    }
}
