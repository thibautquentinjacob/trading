export class Stock {
    private _symbol!: string;
    private _amount!: number;

    public constructor({ symbol, amount }: { symbol: string; amount: number }) {
        this.symbol = symbol;
        this.amount = amount;
    }

    public get symbol(): string {
        return this._symbol;
    }

    public set symbol(symbol: string) {
        this._symbol = symbol;
    }

    public get amount(): number {
        return this._amount;
    }

    public set amount(amount: number) {
        if (amount < 0) {
            throw new Error(`Amount can't be inferior to 0: ${amount}`);
        }
        this._amount = amount;
    }
}
