import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ServerCommand } from '../models/ServerCommand';
import { Symbol } from '../models/Symbol';

@Injectable({
    providedIn: 'root',
})
export class SymbolsService {
    private _subject: WebSocketSubject<{}> = webSocket('ws://localhost:8080');
    public currentSymbol: BehaviorSubject<Symbol> = new BehaviorSubject({
        name: 'Apple Inc.',
        symbol: 'AAPL',
    });
    public symbols: BehaviorSubject<Symbol[]> = new BehaviorSubject([]);

    constructor() {
        console.log('Fetching all available symbols');
        this._subject.subscribe((msg: any) => {
            // console.log( msg );
            this.symbols.next(msg);
        });

        this._subject.next({
            command: ServerCommand.GET_SYMBOLS,
        });
    }

    public setCurrentSymbol(symbol: Symbol) {
        console.log(`Setting current symbol to ${symbol}`, symbol);
        this.currentSymbol.next(symbol);
    }
}
