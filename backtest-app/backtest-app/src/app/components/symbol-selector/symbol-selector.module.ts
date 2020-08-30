// import { BrowserModule } from '@angular/platform-browser';
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
import { SymbolSelectorComponent } from './symbol-selector.component';

@NgModule({
    declarations: [SymbolSelectorComponent],
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
    exports: [SymbolSelectorComponent],
    providers: [],
})
export class SymbolSelectorModule {}
