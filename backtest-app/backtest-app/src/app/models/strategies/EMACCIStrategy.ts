/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Friday, 21st June 2019 12:35:15 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Thursday, 29th August 2019 12:49:07 am
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
import { CCI } from '../chart-descriptions/CCI';
import { EMA } from '../chart-descriptions/EMA';
import { RSI } from '../chart-descriptions/RSI';
import { Indicator } from '../Indicator';
import { StockData } from '../StockData';
import { StrategicDecision } from '../StrategicDecision';
import { Strategy } from '../Strategy';

export class EMACCIStrategy extends Strategy {
    public title = 'EMA + CCI';
    public indicators: {
        [key: string]: Indicator;
    } = {
        ema5: {
            name: 'ema',
            options: [5],
            metrics: ['open'],
            output: ['output'],
        },
        ema8: {
            name: 'ema',
            options: [8],
            metrics: ['open'],
            output: ['output'],
        },
        ema50: {
            name: 'ema',
            options: [50],
            metrics: ['open'],
            output: ['output'],
        },
        cci: {
            name: 'cci',
            options: [10],
            metrics: ['high', 'low', 'close'],
            output: ['output'],
        },
        rsi: {
            name: 'rsi',
            options: [20],
            metrics: ['open'],
            output: ['output'],
        },
        bollingerBands: {
            name: 'bbands',
            options: [5, 2],
            metrics: ['open'],
            output: ['lower', 'middle', 'upper'],
        },
    };

    constructor() {
        super();
        // Build indicator full names
        const indicatorKeys: string[] = Object.keys(this.indicators);
        for (let i = 0, size = indicatorKeys.length; i < size; i++) {
            const indicatorKey: string = indicatorKeys[i];
            const indicatorName: string = this.indicators[indicatorKey].name;
            const indicatorOptions: number[] = this.indicators[indicatorKey]
                .options;
            this.indicators[
                indicatorKey
            ].fullName = `${indicatorName}_${indicatorOptions.join('_')}`;
        }
    }

    public generateChartDescriptions(
        data: StockData
    ): EChartOption.SeriesLine[] {
        let descriptions: EChartOption.SeriesLine[] = [];
        descriptions = descriptions.concat(
            new EMA(
                ['EMA 8'],
                [data[this.indicators.ema8.fullName]['output']],
                ['#ff0099']
            ).generateDescription(),
            new EMA(
                ['EMA 5'],
                [data[this.indicators.ema5.fullName]['output']],
                ['#00aaff']
            ).generateDescription(),
            new EMA(
                ['EMA 50'],
                [data[this.indicators.ema50.fullName]['output']],
                ['#00ff00']
            ).generateDescription(),
            new CCI(
                ['CCI'],
                [data[this.indicators.cci.fullName]['output']],
                ['#00ffdd99', '#00ff00', '#00ff00', '#333333']
            ).generateDescription(),
            new RSI(
                ['RSI', null, null, null],
                [data[this.indicators.rsi.fullName]['output']],
                ['#00ff99', '#ff0099', '#ff0099', '#fff']
            ).generateDescription()
            // new BollingerBands(
            //     ['Bollinger Bands', null, null, null],
            //     [
            //         data[this.indicators.bollingerBands.fullName]['lower'],
            //         data[this.indicators.bollingerBands.fullName]['middle'],
            //         data[this.indicators.bollingerBands.fullName]['upper']
            //     ],
            //     ['#0099FF88', '#999', '#0099FF88']
            // ).generateDescription()
        );
        return descriptions;
    }

    /**
     * Provided market data, should we buy or not.
     * If rsi <= 31 and mac < -0.3 -> BUY
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldBuy(data: StockData): StrategicDecision {
        const dates: Date[] = data.dates as Date[];
        const currentDate: Date = new Date(dates[dates.length - 1]);
        const closingDate: Date = new Date(dates[dates.length - 1]);
        closingDate.setHours(22, 0, 0);
        const timeDiffMinutes: number =
            (closingDate.getTime() - currentDate.getTime()) / (1000 * 60);
        const ema5Name = this.indicators.ema5.fullName;
        const ema8Name = this.indicators.ema8.fullName;
        const ema50Name = this.indicators.ema50.fullName;
        const cciName = this.indicators.cci.fullName;
        const ema5: number =
            data[ema5Name]['output'][data[ema5Name]['output'].length - 1];
        const ema8: number =
            data[ema8Name]['output'][data[ema8Name]['output'].length - 1];
        const ema50: number =
            data[ema50Name]['output'][data[ema50Name]['output'].length - 1];
        const currentCCI: number =
            data[cciName]['output'][data[cciName]['output'].length - 1];
        const previousCCI: number =
            data[cciName]['output'][data[cciName]['output'].length - 2];
        if (
            // Math.ceil( ema5 ) === Math.ceil( ema8 ) &&
            // ( ema5 > ema8 ) &&
            ema50 > ema5 &&
            ema50 > ema8 &&
            (ema50 - ema5 > 0.2 || Math.abs(currentCCI - previousCCI) > 110) &&
            currentCCI > 0 &&
            previousCCI < 0 &&
            Math.abs(currentCCI - previousCCI) > 70 &&
            timeDiffMinutes > 15
        ) {
            return {
                amount: -1,
                decision: true,
            };
        } else {
            return {
                amount: 0,
                decision: false,
            };
        }
    }

    /**
     * Provided market data, should we sell or not.
     * If ( macd < 0 and rsi >= 60 ) or rsi >= 80 -> SELL
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell(data: StockData): StrategicDecision {
        const dates: Date[] = data.dates as Date[];
        const currentDate: Date = new Date(dates[dates.length - 1]);
        const closingDate: Date = new Date(dates[dates.length - 1]);
        closingDate.setHours(22, 0, 0);
        const timeDiffMinutes: number =
            (closingDate.getTime() - currentDate.getTime()) / (1000 * 60);
        const ema5Name = this.indicators.ema5.fullName;
        const ema8Name = this.indicators.ema8.fullName;
        const ema50Name = this.indicators.ema50.fullName;
        const rsiName = this.indicators.rsi.fullName;
        const cciName = this.indicators.cci.fullName;
        const ema5: number =
            data[ema5Name]['output'][data[ema5Name]['output'].length - 1];
        const ema8: number =
            data[ema8Name]['output'][data[ema8Name]['output'].length - 1];
        const ema50: number =
            data[ema50Name]['output'][data[ema50Name]['output'].length - 1];
        const rsi: number =
            data[rsiName]['output'][data[rsiName]['output'].length - 1];
        const currentCCI: number =
            data[cciName]['output'][data[cciName]['output'].length - 1];
        const previousCCI: number =
            data[cciName]['output'][data[cciName]['output'].length - 2];
        if (
            // Math.ceil( ema5 ) === Math.ceil( ema8 ) &&
            // ( ema5 < ema8 ) &&
            timeDiffMinutes < 15 ||
            (ema50 < ema5 &&
                ema50 < ema8 &&
                (rsi >= 70 ||
                    (currentCCI < 0 &&
                        previousCCI > 0 &&
                        Math.abs(previousCCI - currentCCI) > 70)))
        ) {
            return {
                amount: -1,
                decision: true,
            };
        } else {
            return {
                amount: 0,
                decision: false,
            };
        }
    }
}
