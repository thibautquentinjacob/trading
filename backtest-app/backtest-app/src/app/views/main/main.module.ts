import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';
import { StrategySelectorModule } from 'src/app/components/strategy-selector/strategy-selector.module';
import { SymbolSelectorModule } from 'src/app/components/symbol-selector/symbol-selector.module';
import { TopMetricBarModule } from '../../components/top-metric-bar/top-metric-bar.module';
import { MainComponent } from './main.component';

@NgModule({
    declarations: [MainComponent],
    imports: [
        BrowserModule,
        FormsModule,
        NgxEchartsModule,
        FlexLayoutModule,
        TopMetricBarModule,
        SymbolSelectorModule,
        StrategySelectorModule,
        MatProgressSpinnerModule,
    ],
    exports: [MainComponent],
    providers: [],
})
export class MainModule {}
