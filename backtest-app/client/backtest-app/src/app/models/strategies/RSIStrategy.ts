import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';

export class RSIStrategy extends Strategy {

    constructor ( name: string ) {
        super( name );
    }

    /**
     *
     *
     * @param {[key: string]: number } data - Market data
     * @override
     */
    public static shouldBuy( data: {[key: string]: number }): StrategicDecision {
        if ( data.rsi > 50 ) {
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

    public static shouldSell( data: {[key: string]: number }): StrategicDecision {
        if ( data.rsi <= 50 ) {
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
