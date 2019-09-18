import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Portfolio } from '../models/Portfolio';
import { Stock } from '../models/Stock';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {

    private _tradeAmount:      number;
    private _successfulTrade:  number;
    private _portfolio:        Portfolio;
    public  totalValue:        BehaviorSubject<number>;
    public  cash:              BehaviorSubject<number>;
    public  stockValue:        BehaviorSubject<number>;
    public  initialTotalValue: BehaviorSubject<number>;
    public  initialCash:       BehaviorSubject<number>;
    public  initialStockValue: BehaviorSubject<number>;
    public  stocks:            BehaviorSubject<{[key: string]: Stock }>;
    public  successRate:       BehaviorSubject<number>;

    constructor() {
        this._portfolio        = new Portfolio( environment.INITIAL_FUNDS );
        this.totalValue        = new BehaviorSubject( this._portfolio.totalValue );
        this.cash              = new BehaviorSubject( this._portfolio.cash );
        this.stockValue        = new BehaviorSubject( this._portfolio.stockValue );
        this.initialTotalValue = new BehaviorSubject( this._portfolio.initialTotalValue );
        this.initialCash       = new BehaviorSubject( this._portfolio.initialCash );
        this.initialStockValue = new BehaviorSubject( this._portfolio.initialStockValue );
        this.stocks            = new BehaviorSubject( this._portfolio.stocks );
        this.successRate       = new BehaviorSubject( 0 );
        this._successfulTrade  = 0;
        this._tradeAmount      = 0;
    }

    private _updateObservables (): void {
        this.totalValue.next( this._portfolio.totalValue );
        this.cash.next( this._portfolio.cash );
        this.stockValue.next( this._portfolio.stockValue );
        this.initialTotalValue.next( this._portfolio.initialTotalValue );
        this.initialCash.next( this._portfolio.initialCash );
        this.initialStockValue.next( this._portfolio.initialStockValue );
        this.stocks.next( this._portfolio.stocks );
        this.successRate.next( this._successfulTrade / this._tradeAmount );
    }

    public resetPortfolio(): void {
        this._portfolio        = new Portfolio( environment.INITIAL_FUNDS );
        this._successfulTrade  = 0;
        this._tradeAmount      = 0;
        this._updateObservables();
    }

    public buy ( stock: Stock, price: number ) {
        this._portfolio.buy( stock, price );
        this._updateObservables();
    }

    public sell ( stock: Stock, price: number ) {
        const currentTotal: number = this._portfolio.totalValue;
        this._portfolio.sell( stock, price );
        // If buy -> sell was profitable, record a successful trade
        this._tradeAmount++;
        if ( this._portfolio.totalValue > currentTotal ) {
            this._successfulTrade++;
        }
        this._updateObservables();
    }
}
