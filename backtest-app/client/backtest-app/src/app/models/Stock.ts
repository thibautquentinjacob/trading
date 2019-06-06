export class Stock {

    private _symbol:       string;
    private _amount:       number;

    get symbol (): string {
        return this._symbol;
    }

    set symbol ( symbol: string ) {
        this._symbol = symbol;
    }

    get amount (): number {
        return this._amount;
    }

    set amount ( amount: number ) {
        if ( amount < 0 ) {
            throw new Error( `Amount can't be inferior to 0: ${amount}` );
        }
        this._amount = amount;
    }

    constructor ( symbol: string, amount: number ) {
        this.symbol       = symbol;
        this.amount       = amount;
    }

}
