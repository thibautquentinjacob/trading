import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
} from '@angular/material';
import { StrategySelectorComponent } from './strategy-selector.component';

@NgModule({
    declarations: [StrategySelectorComponent],
    imports: [
        FlexLayoutModule,
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
    ],
    exports: [StrategySelectorComponent],
    providers: [],
})
export class StrategySelectorModule {}
