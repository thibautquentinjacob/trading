import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StockSymbol } from '../../models/Symbol';

@Component({
    selector: 'app-symbol-selector',
    templateUrl: './symbol-selector.component.html',
    styleUrls: ['./symbol-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolSelectorComponent {
    @Input('symbols') public set _symbols(symbols: StockSymbol[]) {
        this.symbols = symbols;
        this.filteredSymbols = this.symbolControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }
    @Input('currentSymbol') public set _currentSymbol(
        currentSymbol: StockSymbol
    ) {
        console.log(currentSymbol);
        this.currentSymbol = currentSymbol;
        if (this.currentSymbol) {
            this.symbolControl.patchValue(this.currentSymbol.symbol);
        }
    }
    @Output() symbolSelected: EventEmitter<StockSymbol> = new EventEmitter<
        StockSymbol
    >();
    public filteredSymbols: Observable<StockSymbol[]>;
    public symbolControl: FormControl = new FormControl();
    public symbols: StockSymbol[];
    public currentSymbol: StockSymbol;

    public optionSelected(event: MatAutocompleteSelectedEvent) {
        this.symbolSelected.emit({
            name: event.option.viewValue,
            symbol: event.option.value,
        });
    }

    private _filter(value: string): StockSymbol[] {
        const filterValue = value.toLowerCase();

        const filtered: StockSymbol[] = this.symbols.filter(
            (symbol: StockSymbol) => {
                return (
                    symbol.name.toLowerCase().includes(filterValue) ||
                    symbol.symbol.toLowerCase().includes(filterValue)
                );
            }
        );
        return filtered.slice(0, 20);
    }
}
