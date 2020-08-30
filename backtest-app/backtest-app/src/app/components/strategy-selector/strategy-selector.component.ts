import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-strategy-selector',
    templateUrl: './strategy-selector.component.html',
    styleUrls: ['./strategy-selector.component.scss'],
})
export class StrategySelectorComponent implements OnInit, OnChanges {
    @Input() _strategies: string[];
    @Input() _currentStrategy: string;
    @Output() strategySelected: EventEmitter<string> = new EventEmitter<
        string
    >();
    public _filteredStrategies: Observable<string[]>;
    public _strategyControl: FormControl = new FormControl();

    constructor() {}

    ngOnInit() {
        console.log(this._strategies);
        this._filteredStrategies = this._strategyControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
        this._strategyControl.patchValue(this._currentStrategy);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes._strategies) {
            this._strategies = changes._strategies.currentValue;
        }
        if (changes._currentStrategy) {
            this._currentStrategy = changes._currentStrategy.currentValue;
            this._strategyControl.patchValue(
                changes._currentStrategy.currentValue
            );
        }
    }

    private _optionSelected(event: MatAutocompleteSelectedEvent) {
        this.strategySelected.emit(event.option.value);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        const filtered: string[] = this._strategies.filter(
            (strategy: string) => {
                return strategy.toLowerCase().includes(filterValue);
            }
        );

        return filtered.slice(0, 20);
    }
}
