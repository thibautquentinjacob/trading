import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';
import { Indicator } from '../Indicator';
import { EChartOption } from 'echarts';
import { RSI } from '../chart-descriptions/RSI';

export class RSIStrategy extends Strategy {

    public title: string = 'RSI';

    public indicators: {
        [key: string]: Indicator
    } = {
        rsi: {
            name:    'rsi',
            options: [7],
            metric:  'open',
            output:  ['output']
        },
        macd: {
            name:    'macd',
            options: [1, 8, 6],
            metric:  'open',
            output:  ['short', 'long', 'signal']
        },
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
    // public chartDescriptions: EChartOption.SeriesLine[] =
    //     new RSI(
    //         ['RSI', null, null, null],
    //         [rsi, rsiTop, rsiLow, rsiMiddle],
    //         ['#00ff99', '#ff0099', '#ff0099', '#fff']
    //     ).generateDescription();

    /**
     * Buy if RSI is superior to 50
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: {[key: string]: number | Date }): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        // if ( data.rsi <= 30 ) {
        if (( data.rsi <= 31 && data.macd < -0.3 ) && timeDiffMinutes > 15 ) {
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
    public shouldSell( data: {[key: string]: number | Date }): StrategicDecision {
        const currentDate:     Date   = data.time as Date;
        const closingDate:     Date   = new Date( data.time );
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        // if ( data.rsi > 70 ) {
        // if ( data.macd > 0.01 || timeDiffMinutes < 15 ) {
        if (( data.macd < 0 && data.rsi >= 60 ) || data.rsi >= 80 ) {
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
