// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';

import { SymbolSelectorComponent } from './symbol-selector.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        SymbolSelectorComponent
    ],
    imports: [
        FlexLayoutModule,
        CommonModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule
    ],
    exports: [
        SymbolSelectorComponent
    ],
    providers: []
})
export class SymbolSelectorModule {}
