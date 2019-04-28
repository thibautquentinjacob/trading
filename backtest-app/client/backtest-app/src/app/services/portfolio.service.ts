import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Portfolio } from '../models/Portfolio';
import { Stock } from '../models/Stock';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {

    private _portfolio:        Portfolio;
    public  totalValue:        BehaviorSubject<number>;
    public  cash:              BehaviorSubject<number>;
    public  stockValue:        BehaviorSubject<number>;
    public  initialTotalValue: BehaviorSubject<number>;
    public  initialCash:       BehaviorSubject<number>;
    public  initialStockValue: BehaviorSubject<number>;
    public  stocks:            BehaviorSubject<{[key: string]: Stock }>;

    constructor() {
        this._portfolio        = new Portfolio( 5000 );
        this.totalValue        = new BehaviorSubject( this._portfolio.totalValue );
        this.cash              = new BehaviorSubject( this._portfolio.cash );
        this.stockValue        = new BehaviorSubject( this._portfolio.stockValue );
        this.initialTotalValue = new BehaviorSubject( this._portfolio.initialTotalValue );
        this.initialCash       = new BehaviorSubject( this._portfolio.initialCash );
        this.initialStockValue = new BehaviorSubject( this._portfolio.initialStockValue );
        this.stocks            = new BehaviorSubject( this._portfolio.stocks );
    }

    private _updateObservables (): void {
        this.totalValue.next( this._portfolio.totalValue );
        this.cash.next( this._portfolio.cash );
        this.stockValue.next( this._portfolio.stockValue );
        this.initialTotalValue.next( this._portfolio.initialTotalValue );
        this.initialCash.next( this._portfolio.initialCash );
        this.initialStockValue.next( this._portfolio.initialStockValue );
        this.stocks.next( this._portfolio.stocks );
    }

    public resetPortfolio(): void {
        this._portfolio = new Portfolio( 5000 );
        this._updateObservables();
    }

    public buy ( stock: Stock, price: number ) {
        this._portfolio.buy( stock, price );
        this._updateObservables();
    }

    public sell ( stock: Stock, price: number ) {
        this._portfolio.sell( stock, price );
        this._updateObservables();
    }
}
