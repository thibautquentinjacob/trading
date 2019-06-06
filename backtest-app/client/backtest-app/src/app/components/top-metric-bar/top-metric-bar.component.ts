import { Component, OnInit, Input } from '@angular/core';

import { TopMetric } from 'src/app/models/TopMetric';
import { Symbol } from 'src/app/models/Symbol';
import { TopMetricType } from 'src/app/models/TopMetricType';

import { PortfolioService } from 'src/app/services/portfolio.service';

@Component({
    selector: 'app-top-metric-bar',
    templateUrl: './top-metric-bar.component.html',
    styleUrls: ['./top-metric-bar.component.scss']
})
export class TopMetricBarComponent implements OnInit {

    public    total:         number;
    public    initialTotal:  number;
    @Input() _currentSymbol: string;
    @Input() _symbols:       Symbol[];

    public _metrics: {
        current:   TopMetric,
        previous:  TopMetric,
        increment: number,
        type:      TopMetricType
    }[] = [
        {
            current: {
                title: 'Total',
                value: 5000
            },
            previous: {
                title: 'Total',
                value: 5000
            },
            increment: 0,
            type:      TopMetricType.CURRENCY
        },
        {
            current: {
                title: 'Cash',
                value: 5000
            },
            previous: {
                title: 'Cash',
                value: 5000
            },
            increment: 0,
            type:      TopMetricType.CURRENCY
        },
        {
            current: {
                title: 'Stocks',
                value: 0
            },
            previous: {
                title: 'Stocks',
                value: 0
            },
            increment: 0,
            type:      TopMetricType.CURRENCY
        },
        {
            current: {
                title: 'Success Rate',
                value: 0
            },
            previous: {
                title: 'Success Rate',
                value: 0
            },
            increment: 0,
            type:      TopMetricType.PERCENTAGE
        }
    ];

    constructor( private _portfolioService: PortfolioService ) {
        this._portfolioService.totalValue.subscribe(( totalValue: number ) => {
            this._metrics[0].current.value = totalValue;
            this._metrics[0].increment = ( this._metrics[0].current.value / this._metrics[0].previous.value ) - 1;
        });
        this._portfolioService.initialTotalValue.subscribe(( initialTotalValue: number ) => {
            this._metrics[0].previous.value = initialTotalValue;
            this._metrics[0].increment = ( this._metrics[0].current.value / this._metrics[0].previous.value ) - 1;
        });
        this._portfolioService.cash.subscribe(( cash: number ) => {
            this._metrics[1].current.value = cash;
            this._metrics[1].increment = ( this._metrics[1].current.value / this._metrics[1].previous.value ) - 1;
        });
        this._portfolioService.initialCash.subscribe(( initialCash: number ) => {
            this._metrics[1].previous.value = initialCash;
            this._metrics[1].increment = ( this._metrics[1].current.value / this._metrics[1].previous.value ) - 1;
        });
        this._portfolioService.stockValue.subscribe(( stockValue: number ) => {
            this._metrics[2].current.value = stockValue;
            this._metrics[2].increment = ( this._metrics[2].current.value / this._metrics[2].previous.value ) - 1;
        });
        this._portfolioService.initialStockValue.subscribe(( initialStockValue: number ) => {
            this._metrics[2].previous.value = initialStockValue;
            this._metrics[2].increment = ( this._metrics[2].current.value / this._metrics[2].previous.value ) - 1;
        });
        this._portfolioService.successRate.subscribe(( successRate: number ) => {
            console.log( successRate );
            this._metrics[3].current.value = successRate;
            this._metrics[3].increment = 0;
        });
    }

    ngOnInit() {
        console.log( this._symbols );
    }
}