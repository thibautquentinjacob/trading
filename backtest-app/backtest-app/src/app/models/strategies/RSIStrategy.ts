import { EChartOption } from 'echarts';
import { MACD } from '../chart-descriptions/MACD';
import { RSI } from '../chart-descriptions/RSI';
import { SMA } from '../chart-descriptions/SMA';
import { StockData } from '../StockData';
import { StrategicDecision } from '../StrategicDecision';
import { Strategy } from '../Strategy';

export class RSIStrategy extends Strategy {
    constructor() {
        super({
            title: 'RSI',
            indicators: {
                rsi: {
                    name: 'rsi',
                    options: [7],
                    metrics: ['open'],
                    output: ['output'],
                },
                macd: {
                    name: 'macd',
                    options: [1, 8, 6],
                    metrics: ['open'],
                    output: ['short', 'long', 'signal'],
                },
                sma12: {
                    name: 'sma',
                    options: [12],
                    metrics: ['open'],
                    output: ['output'],
                },
                sma26: {
                    name: 'sma',
                    options: [26],
                    metrics: ['open'],
                    output: ['output'],
                },
            },
        });
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
        console.log(this.indicators);
    }

    public generateChartDescriptions(
        data: StockData
    ): EChartOption.SeriesLine[] {
        let descriptions: EChartOption.SeriesLine[] = [];
        descriptions = descriptions.concat(
            new RSI(
                ['RSI', null, null, null],
                [data[this.indicators.rsi.fullName]['output']],
                ['#00ff99', '#ff0099', '#ff0099', '#fff']
            ).generateDescription(),
            new MACD(
                ['MACD Short', 'MACD Long', 'MACD Signal'],
                [
                    data[this.indicators.macd.fullName]['short'],
                    data[this.indicators.macd.fullName]['long'],
                    data[this.indicators.macd.fullName]['signal'],
                ],
                [
                    '#0CFF9B',
                    '#FF105033',
                    '#FF1050',
                    '#0CF49B',
                    '#0CF49B33',
                    '#FF1050',
                ]
            ).generateDescription(),
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
    public shouldBuy(data: StockData): StrategicDecision {
        const dates: Date[] = data.dates as Date[];
        const currentDate: Date = new Date(dates[dates.length - 1]);
        const closingDate: Date = new Date(dates[dates.length - 1]);
        closingDate.setHours(22, 0, 0);
        const timeDiffMinutes: number =
            (closingDate.getTime() - currentDate.getTime()) / (1000 * 60);
        const rsiName = this.indicators.rsi.fullName;
        const macdName = this.indicators.macd.fullName;
        const rsi: number =
            data[rsiName]['output'][data[rsiName]['output'].length - 1];
        const macd: number =
            data[macdName]['long'][data[macdName]['long'].length - 1];
        if (rsi <= 31 && macd < -0.3 && timeDiffMinutes > 15) {
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
        const rsiName = this.indicators.rsi.fullName;
        const macdName = this.indicators.macd.fullName;
        const rsi: number =
            data[rsiName]['output'][data[rsiName]['output'].length - 1];
        const macd: number =
            data[macdName]['long'][data[macdName]['long'].length - 1];
        // if ( data.rsi > 70 ) {
        // if ( data.macd > 0.01 || timeDiffMinutes < 15 ) {
        if ((macd < 0 && rsi >= 60) || rsi >= 80) {
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
