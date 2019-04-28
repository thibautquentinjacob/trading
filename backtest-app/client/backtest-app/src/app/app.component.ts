import { Component } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';

import { EChartOption, graphic } from 'echarts';
import { PortfolioService } from './services/portfolio.service';
import { Strategy } from './models/Strategy';
import { RSIStrategy } from './models/strategies/RSIStrategy';
import { StrategicDecision } from './models/StragegicDecision';
import { Stock } from './models/Stock';
import { Marker } from './models/Marker';
import { SymbolsService } from './services/symbols.service';
import { Symbol } from './models/Symbol';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
