// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TopMetricBarComponent } from './top-metric-bar.component';
import { MatIconModule } from '@angular/material';
import { TopMetricModule } from '../top-metric/top-metric.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        TopMetricBarComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatIconModule,
        TopMetricModule
    ],
    exports: [
        TopMetricBarComponent
    ],
    providers: []
})
export class TopMetricBarModule {}
