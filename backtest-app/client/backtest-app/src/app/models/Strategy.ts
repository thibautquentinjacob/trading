import { StrategicDecision } from './StragegicDecision';
import { Indicator } from './Indicator';
import { EChartOption } from 'echarts';

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
    public shouldBuy( data: {[key: string]: number | Date }): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

    // Provided market data, should we sell or not
    public shouldSell( data: {[key: string]: number | Date }): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

}
