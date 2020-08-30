import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopMetricModule } from '../top-metric/top-metric.module';
import { TopMetricBarComponent } from './top-metric-bar.component';

@NgModule({
    declarations: [TopMetricBarComponent],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        TopMetricModule,
    ],
    exports: [TopMetricBarComponent],
    providers: [],
})
export class TopMetricBarModule {}
