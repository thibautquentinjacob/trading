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

@Component({
    selector: 'app-strategy-selector',
    templateUrl: './strategy-selector.component.html',
    styleUrls: ['./strategy-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrategySelectorComponent {
    @Input('strategies') public set _strategies(strategies: string[]) {
        this.strategies = strategies;
        this.filteredStrategies = this.strategyControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }
    @Input('currentStrategy') public set _currentStrategy(strategy: string) {
        this.currentStrategy = strategy;
        this.strategyControl.patchValue(this.currentStrategy);
    }
    @Output() strategySelected: EventEmitter<string> = new EventEmitter<
        string
    >();
    public strategies: string[];
    public currentStrategy: string;
    public filteredStrategies: Observable<string[]>;
    public strategyControl: FormControl = new FormControl();

    constructor() {}

    public optionSelected(event: MatAutocompleteSelectedEvent): void {
        this.strategySelected.emit(event.option.value);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        const filtered: string[] = this.strategies.filter(
            (strategy: string) => {
                return strategy.toLowerCase().includes(filterValue);
            }
        );

        return filtered.slice(0, 20);
    }
}
