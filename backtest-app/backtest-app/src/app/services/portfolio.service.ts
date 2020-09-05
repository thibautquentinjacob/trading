import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Portfolio } from '../models/Portfolio';
import { Stock } from '../models/Stock';

@Injectable({
    providedIn: 'root',
})
export class PortfolioService {
    private _tradeAmount: number;
    private _successfulTrade: number;
    private _portfolio: Portfolio;
    private _totalValue: BehaviorSubject<number>;
    private _cash: BehaviorSubject<number>;
    private _stockValue: BehaviorSubject<number>;
    private _initialTotalValue: BehaviorSubject<number>;
    private _initialCash: BehaviorSubject<number>;
    private _initialStockValue: BehaviorSubject<number>;
    private _stocks: BehaviorSubject<{ [key: string]: Stock }>;
    private _successRate: BehaviorSubject<number>;

    public readonly totalValue: Observable<number>;
    public readonly cash: Observable<number>;
    public readonly stockValue: Observable<number>;
    public readonly initialTotalValue: Observable<number>;
    public readonly initialCash: Observable<number>;
    public readonly initialStockValue: Observable<number>;
    public readonly stocks: Observable<{
        [key: string]: Stock;
    }>;
    public readonly successRate: Observable<number>;

    constructor() {
        this._portfolio = new Portfolio(environment.INITIAL_FUNDS);
        this._totalValue = new BehaviorSubject(this._portfolio.totalValue);
        this._cash = new BehaviorSubject(this._portfolio.cash);
        this._stockValue = new BehaviorSubject(this._portfolio.stockValue);
        this._initialTotalValue = new BehaviorSubject(
            this._portfolio.initialTotalValue
        );
        this._initialCash = new BehaviorSubject(this._portfolio.initialCash);
        this._initialStockValue = new BehaviorSubject(
            this._portfolio.initialStockValue
        );
        this._stocks = new BehaviorSubject(this._portfolio.stocks);
        this._successRate = new BehaviorSubject(0);
        this.totalValue = this._totalValue.asObservable();
        this.cash = this._cash.asObservable();
        this.stockValue = this._stockValue.asObservable();
        this.initialTotalValue = this._initialTotalValue.asObservable();
        this.initialCash = this._initialCash.asObservable();
        this.initialStockValue = this._initialStockValue.asObservable();
        this.stocks = this._stocks.asObservable();
        this.successRate = this._successRate.asObservable();
        this._successfulTrade = 0;
        this._tradeAmount = 0;
    }

    private _updateObservables(): void {
        this._totalValue.next(this._portfolio.totalValue);
        this._cash.next(this._portfolio.cash);
        this._stockValue.next(this._portfolio.stockValue);
        this._initialTotalValue.next(this._portfolio.initialTotalValue);
        this._initialCash.next(this._portfolio.initialCash);
        this._initialStockValue.next(this._portfolio.initialStockValue);
        this._stocks.next(this._portfolio.stocks);
        this._successRate.next(this._successfulTrade / this._tradeAmount);
    }

    public resetPortfolio(): void {
        this._portfolio = new Portfolio(environment.INITIAL_FUNDS);
        this._successfulTrade = 0;
        this._tradeAmount = 0;
        this._updateObservables();
    }

    public buy(stock: Stock, price: number) {
        this._portfolio.buy(stock, price);
        this._updateObservables();
    }

    public sell(stock: Stock, price: number) {
        const currentTotal: number = this._portfolio.totalValue;
        this._portfolio.sell(stock, price);
        // If buy -> sell was profitable, record a successful trade
        this._tradeAmount++;
        if (this._portfolio.totalValue > currentTotal) {
            this._successfulTrade++;
        }
        this._updateObservables();
    }
}
