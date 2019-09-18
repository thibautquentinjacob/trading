import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StrategySelectorComponent } from './strategy-selector.component';



@NgModule({
    declarations: [
        StrategySelectorComponent
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
        StrategySelectorComponent
    ],
    providers: []
})
export class StrategySelectorModule {}
