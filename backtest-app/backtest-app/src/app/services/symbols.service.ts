import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ServerCommand } from '../models/ServerCommand';
import { StockSymbol } from '../models/Symbol';

@Injectable({
    providedIn: 'root',
})
export class SymbolsService {
    private _subject: WebSocketSubject<{}> = webSocket('ws://localhost:8080');
    private _currentSymbol$: BehaviorSubject<StockSymbol> = new BehaviorSubject(
        {
            name: 'Apple Inc.',
            symbol: 'AAPL',
        }
    );
    private _symbols$: BehaviorSubject<StockSymbol[]> = new BehaviorSubject([]);

    public readonly currentSymbol$: Observable<
        StockSymbol
    > = this._currentSymbol$.asObservable();
    public readonly symbols$: Observable<
        StockSymbol[]
    > = this._symbols$.asObservable();

    constructor() {
        console.log('Fetching all available symbols');
        this._subject.subscribe((msg: any) => {
            console.log(msg);
            this._symbols$.next([...msg]);
        });

        this._subject.next({
            command: ServerCommand.GET_SYMBOLS,
        });
    }

    public setCurrentSymbol(symbol: StockSymbol) {
        console.log(`Setting current symbol to ${symbol}`, symbol);
        this._currentSymbol$.next(symbol);
    }
}
