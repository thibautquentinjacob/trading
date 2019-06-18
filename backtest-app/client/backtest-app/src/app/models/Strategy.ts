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
    // Associated plot descriptions
    public chartDescriptions: EChartOption.SeriesLine[];

    constructor() {}

    // Provided market data, should we buy or not
    public shouldBuy( data: StockData ): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

    // Provided market data, should we sell or not
    public shouldSell( data: StockData ): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

}
