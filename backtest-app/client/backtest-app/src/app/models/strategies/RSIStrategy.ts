import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';
import { Indicator } from '../Indicator';
import { EChartOption } from 'echarts';
import { RSI } from '../chart-descriptions/RSI';
import { StockData } from '../StockData';

export class RSIStrategy extends Strategy {

    public title: string    = 'RSI';
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

    // FIXME: Should use internal data
    // public chartDescriptions: EChartOption.SeriesLine[] =
    //     new RSI(
    //         ['RSI', null, null, null],
    //         [rsi],
    //         ['#00ff99', '#ff0099', '#ff0099', '#fff']
    //     ).generateDescription();

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

    /**
     * Buy if RSI is superior to 50
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const rsiName                 = this.indicators.rsi.fullName;
        const macdName                = this.indicators.macd.fullName;
        const rsi:             number = data[rsiName]['output'][data[rsiName]['output'].length - 1];
        const macd:            number = data[macdName]['long'][data[macdName]['long'].length - 1];
        if (( rsi <= 31 && macd < -0.3 ) && timeDiffMinutes > 15 ) {
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
    public shouldSell( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const rsiName                 = this.indicators.rsi.fullName;
        const macdName                = this.indicators.macd.fullName;
        const rsi:             number = data[rsiName]['output'][data[rsiName]['output'].length - 1];
        const macd:            number = data[macdName]['long'][data[macdName]['long'].length - 1];
        // if ( data.rsi > 70 ) {
        // if ( data.macd > 0.01 || timeDiffMinutes < 15 ) {
        if (( macd < 0 && rsi >= 60 ) || rsi >= 80 ) {
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
