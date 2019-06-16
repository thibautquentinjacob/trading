import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

import { TopMetricBarModule } from '../../components/top-metric-bar/top-metric-bar.module';
import { SymbolSelectorModule } from 'src/app/components/symbol-selector/symbol-selector.module';
import { MainComponent } from './main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StrategySelectorModule } from 'src/app/components/strategy-selector/strategy-selector.module';

@NgModule({
    declarations: [
        MainComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgxEchartsModule,
        FlexLayoutModule,
        TopMetricBarModule,
        SymbolSelectorModule,
        StrategySelectorModule
    ],
    exports: [
        MainComponent
    ],
    providers: []
})
export class MainModule {}
