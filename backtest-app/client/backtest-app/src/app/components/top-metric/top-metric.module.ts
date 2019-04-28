// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';

import { TopMetricComponent } from './top-metric.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TopMetricComponent
    ],
    imports: [
        FlexLayoutModule,
        MatIconModule,
        CommonModule,
    ],
    exports: [
        TopMetricComponent
    ],
    providers: []
})
export class TopMetricModule {}
