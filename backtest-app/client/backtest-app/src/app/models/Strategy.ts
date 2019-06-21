import { StrategicDecision } from './StragegicDecision';
import { Indicator } from './Indicator';
import { EChartOption } from 'echarts';
import { StockData } from './StockData';

export class Strategy {

    public title:       string;
    // Associated indicators
    public indicators: {
        [key: string]: Indicator
    };

    constructor() {}

    /**
     *
     * @param data
     */
    public generateChartDescriptions( data: StockData ): EChartOption.SeriesLine[] {
        return null;
    }

    /**
     * Provided market data, should we buy or not
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

    /**
     * Provided market data, should we sell or not
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

}
