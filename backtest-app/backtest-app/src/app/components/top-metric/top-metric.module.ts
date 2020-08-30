// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { TopMetricComponent } from './top-metric.component';

@NgModule({
    declarations: [TopMetricComponent],
    imports: [FlexLayoutModule, MatIconModule, CommonModule],
    exports: [TopMetricComponent],
    providers: [],
})
export class TopMetricModule {}
