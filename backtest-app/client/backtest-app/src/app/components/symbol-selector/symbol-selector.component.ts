import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Symbol } from 'src/app/models/Symbol';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'app-symbol-selector',
    templateUrl: './symbol-selector.component.html',
    styleUrls: ['./symbol-selector.component.scss']
})
export class SymbolSelectorComponent implements OnInit, OnChanges {

    @Input() _symbols:         Symbol[];
    @Input() _currentSymbol:   Symbol;
    @Output() symbolSelected:  EventEmitter<Symbol> = new EventEmitter<Symbol>();
    public   _filteredSymbols: Observable<Symbol[]>;
    public   _symbolControl:   FormControl          = new FormControl();


    constructor() {}

    ngOnInit() {
        console.log( this._symbols );
        this._filteredSymbols = this._symbolControl.valueChanges.pipe(
            startWith(''),
            map( value => this._filter( value ))
        );
    }

    ngOnChanges( changes: SimpleChanges ): void {
        if ( changes._symbols ) {
            this._symbols = changes._symbols.currentValue;
        }
    }

    private _optionSelected( event: MatAutocompleteSelectedEvent ) {
        this.symbolSelected.emit({
            name:   event.option.viewValue,
            symbol: event.option.value
        });
    }

    private _filter( value: string ): Symbol[] {
        const filterValue = value.toLowerCase();

        const filtered: Symbol[] = this._symbols.filter(( symbol: Symbol ) => {
            return symbol.name.toLowerCase().includes( filterValue ) ||
                   symbol.symbol.toLowerCase().includes( filterValue );
        });

        return filtered.slice( 0, 20 );
    }
}
