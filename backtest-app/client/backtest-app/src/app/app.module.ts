import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainComponent } from './views/main/main.component';
import { MainModule } from './views/main/main.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        RouterModule.forRoot([
            {
                path: ':symbol',
                component: MainComponent
            },
            {
                path: '',
                component: MainComponent
            }
        ]),
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MainModule
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
