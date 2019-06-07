import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';

export class RSIStrategy extends Strategy {

    constructor ( name: string ) {
        super( name );
        this.name = 'RSI';
    }

    /**
     * Buy if RSI is superior to 50
     *
     * @override
     * @param {[key: string]: number } data - Market data
     * @returns {StrategicDecision}
     */
    public static shouldBuy( data: {[key: string]: number | Date }): StrategicDecision {
        // if ( data.rsi <= 30 ) {
        if ( data.macd < 0 && data.rsi <= 50 ) {
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
    public static shouldSell( data: {[key: string]: number | Date }): StrategicDecision {
        // if ( data.rsi > 70 ) {
        if ( data.macd > 0.01 ) {
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
