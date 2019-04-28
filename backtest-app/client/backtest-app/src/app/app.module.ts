import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconRegistry, MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { TopMetricBarModule } from './components/top-metric-bar/top-metric-bar.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        MatIconModule,
        HttpClientModule,
        AppRoutingModule,
        NgxEchartsModule,
        TopMetricBarModule
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor( matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer ) {
        matIconRegistry.addSvgIconSet( domSanitizer.bypassSecurityTrustResourceUrl( './assets/mdi.svg' ));
    }
}
