import { Stock } from './Stock';

export class Portfolio {

    private _totalValue:        number;
    private _cash:              number;
    private _stockValue:        number;
    private _initialTotalValue: number;
    private _initialCash:       number;
    private _initialStockValue: number;
    private _stocks:     {[key: string]: Stock };

    public get totalValue (): number {
        return this._totalValue;
    }

    public set totalValue ( totalValue: number ) {
        this._totalValue = totalValue;
    }

    public get cash (): number {
        return this._cash;
    }

    public set cash ( cash: number ) {
        this._cash = cash;
    }

    public get stockValue (): number {
        return this._stockValue;
    }

    public set stockValue ( stockValue: number ) {
        this._stockValue = stockValue;
    }

    public get initialTotalValue (): number {
        return this._initialTotalValue;
    }

    public set initialTotalValue ( initialTotalValue: number ) {
        this._initialTotalValue = initialTotalValue;
    }

    public get initialCash (): number {
        return this._initialCash;
    }

    public set initialCash ( initialCash: number ) {
        this._initialCash = initialCash;
    }

    public get initialStockValue (): number {
        return this._initialStockValue;
    }

    public set initialStockValue ( initialStockValue: number ) {
        this._initialStockValue = initialStockValue;
    }

    public get stocks (): {[key: string]: Stock } {
        return this._stocks;
    }

    public buy ( stock: Stock, stockPrice: number ): boolean {
        const totalPrice: number = stockPrice * stock.amount;
        // If we have enough cash
        if ( this.cash > totalPrice ) {
            this.cash       -= totalPrice;
            console.log( `Buying ${stock.amount} x ${stock.symbol} for ${stockPrice * stock.amount}` );
            // If we already have some of these stocks, update amount
            if ( this._stocks[stock.symbol]) {
                this._stocks[stock.symbol].amount += stock.amount;
            // Otherwise create new entry
            } else {
                this._stocks[stock.symbol] = new Stock(
                    stock.symbol,
                    stock.amount
                );
            }
            this.stockValue  = this._stocks[stock.symbol].amount * stockPrice;
            this.totalValue  = this.cash + this.stockValue;
            return true;
        }
        return false;
    }

    public sell ( stock: Stock, stockPrice: number ): boolean {
        const totalPrice: number = stockPrice * stock.amount;
        // If we have enough stocks
        if ( this._stocks[stock.symbol] && this._stocks[stock.symbol].amount >= stock.amount ) {
            console.log( `Selling ${stock.amount} x ${stock.symbol} for ${stockPrice * stock.amount}` );
            // Update stock amount
            if ( this._stocks[stock.symbol]) {
                this._stocks[stock.symbol].amount -= stock.amount;
                this.cash       += totalPrice;
                this.stockValue  = this._stocks[stock.symbol].amount * stockPrice;
                this.totalValue  = this.cash + this.stockValue;
                // Remove key if amount reaches 0
                if ( this.stocks[stock.symbol].amount === 0 ) {
                    delete this.stocks[stock.symbol];
                }
            }
            return true;
        }
        return false;
    }

    constructor( cash: number ) {
        this._stocks           = {};
        this.totalValue        = cash;
        this.cash              = cash;
        this.stockValue        = 0;
        this.initialTotalValue = cash;
        this.initialCash       = cash;
        this.initialStockValue = 0;
    }

}
