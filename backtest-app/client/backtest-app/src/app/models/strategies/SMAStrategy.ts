/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Friday, 21st June 2019 12:35:15 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Friday, 21st June 2019 1:17:32 am
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
import { EChartOption } from 'echarts';
import { StockData } from '../StockData';
import { SMA } from '../chart-descriptions/SMA';

export class SMAStrategy extends Strategy {

    public title: string    = 'SMA';
    public indicators: {
        [key: string]: Indicator
    } = {
        sma12: {
            name:    'sma',
            options: [12],
            metric:  'open',
            output:  ['output']
        },
        sma26: {
            name:    'sma',
            options: [26],
            metric:  'open',
            output:  ['output']
        }
    };


    constructor () {
        super();
        // Build indicator full names
        const indicatorKeys: string[] = Object.keys( this.indicators );
        for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
            const indicatorKey:     string   = indicatorKeys[i];
            const indicatorName:    string   = this.indicators[indicatorKey].name;
            const indicatorOptions: number[] = this.indicators[indicatorKey].options;
            this.indicators[indicatorKey].fullName = `${indicatorName}_${indicatorOptions.join( '_' )}`;
        }
        console.log( this.indicators );
    }


    public generateChartDescriptions( data: StockData ): EChartOption.SeriesLine[] {
        let descriptions: EChartOption.SeriesLine[] = [];
        descriptions = descriptions.concat(
            new SMA(
                ['SMA 26'],
                [data[this.indicators.sma26.fullName]['output']],
                ['#ff0099']
            ).generateDescription(),
            new SMA(
                ['SMA 12'],
                [data[this.indicators.sma12.fullName]['output']],
                ['#00aaff']
            ).generateDescription()
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
    public shouldBuy( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const sma12Name                  = this.indicators.sma12.fullName;
        const sma26Name                  = this.indicators.sma26.fullName;
        const sma12:              number = data[sma12Name]['output'][data[sma12Name]['output'].length - 1];
        const sma26:              number = data[sma26Name]['output'][data[sma26Name]['output'].length - 1];
        if ( Math.ceil( sma12 ) === Math.ceil( sma26 ) && ( sma12 > sma26 ) && timeDiffMinutes > 15 ) {
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
     * Provided market data, should we sell or not.
     * If ( macd < 0 and rsi >= 60 ) or rsi >= 80 -> SELL
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const sma12Name                  = this.indicators.sma12.fullName;
        const sma26Name                  = this.indicators.sma26.fullName;
        const sma12:              number = data[sma12Name]['output'][data[sma12Name]['output'].length - 1];
        const sma26:              number = data[sma26Name]['output'][data[sma26Name]['output'].length - 1];
        if ( Math.ceil( sma12 ) === Math.ceil( sma26 ) && sma12 < sma26 ) {
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
