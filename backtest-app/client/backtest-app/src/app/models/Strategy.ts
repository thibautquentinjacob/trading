import { StrategicDecision } from './StragegicDecision';

export class Strategy {

    private _name: string;

    constructor ( name: string ) {
        this._name = name;
    }

    // Provided market data, should we buy or not
    public static shouldBuy( data: {[key: string]: number }): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

    // Provided market data, should we sell or not
    public static shouldSell( data: {[key: string]: number }): StrategicDecision {
        return {
            amount: 0,
            decision: false
        };
    }

}
