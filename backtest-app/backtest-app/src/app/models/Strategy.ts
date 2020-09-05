import { EChartOption } from 'echarts';
import { Indicator } from './Indicator';
import { StockData } from './StockData';
import { StrategicDecision } from './StrategicDecision';

export abstract class Strategy {
    public readonly title: string;
    // Associated indicators
    public readonly indicators: {
        [key: string]: Indicator;
    };

    constructor({
        title,
        indicators,
    }: {
        title: string;
        indicators: { [key: string]: Indicator };
    }) {
        this.title = title;
        this.indicators = indicators;
    }

    /**
     *
     * @param data
     */
    public generateChartDescriptions(
        data: StockData
    ): EChartOption.SeriesLine[] {
        return null;
    }

    /**
     * Provided market data, should we buy or not
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldBuy(data: StockData): StrategicDecision {
        return {
            amount: 0,
            decision: false,
        };
    }

    /**
     * Provided market data, should we sell or not
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell(data: StockData): StrategicDecision {
        return {
            amount: 0,
            decision: false,
        };
    }
}
