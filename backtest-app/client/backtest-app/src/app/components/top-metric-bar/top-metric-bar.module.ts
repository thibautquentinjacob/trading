import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TopMetricBarComponent } from './top-metric-bar.component';
import { MatIconModule, MatTooltipModule, MatSelectModule } from '@angular/material';
import { TopMetricModule } from '../top-metric/top-metric.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        TopMetricBarComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        TopMetricModule
    ],
    exports: [
        TopMetricBarComponent
    ],
    providers: []
})
export class TopMetricBarModule {}
