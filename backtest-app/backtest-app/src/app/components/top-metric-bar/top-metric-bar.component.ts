import { Component, Input } from '@angular/core';
import { StockSymbol } from 'src/app/models/Symbol';
import { TopMetric } from 'src/app/models/TopMetric';
import { TopMetricType } from 'src/app/models/TopMetricType';
import { PortfolioService } from 'src/app/services/portfolio.service';

@Component({
    selector: 'app-top-metric-bar',
    templateUrl: './top-metric-bar.component.html',
    styleUrls: ['./top-metric-bar.component.scss'],
})
export class TopMetricBarComponent {
    public total: number;
    public initialTotal: number;
    @Input() public readonly currentSymbol: StockSymbol;
    @Input() public readonly symbols: StockSymbol[];

    public metrics: {
        current: TopMetric;
        previous: TopMetric;
        increment: number;
        type: TopMetricType;
    }[] = [
        {
            current: {
                title: 'Total',
                value: 5000,
            },
            previous: {
                title: 'Total',
                value: 5000,
            },
            increment: 0,
            type: TopMetricType.CURRENCY,
        },
        {
            current: {
                title: 'Cash',
                value: 5000,
            },
            previous: {
                title: 'Cash',
                value: 5000,
            },
            increment: 0,
            type: TopMetricType.CURRENCY,
        },
        {
            current: {
                title: 'Stocks',
                value: 0,
            },
            previous: {
                title: 'Stocks',
                value: 0,
            },
            increment: 0,
            type: TopMetricType.CURRENCY,
        },
        {
            current: {
                title: 'Success Rate',
                value: 0,
            },
            previous: {
                title: 'Success Rate',
                value: 0,
            },
            increment: 0,
            type: TopMetricType.PERCENTAGE,
        },
    ];

    constructor(private _portfolioService: PortfolioService) {
        this._portfolioService.totalValue.subscribe((totalValue: number) => {
            this.metrics[0].current.value = totalValue;
            this.metrics[0].increment =
                this.metrics[0].current.value / this.metrics[0].previous.value -
                1;
        });
        this._portfolioService.initialTotalValue.subscribe(
            (initialTotalValue: number) => {
                this.metrics[0].previous.value = initialTotalValue;
                this.metrics[0].increment =
                    this.metrics[0].current.value /
                        this.metrics[0].previous.value -
                    1;
            }
        );
        this._portfolioService.cash.subscribe((cash: number) => {
            this.metrics[1].current.value = cash;
            this.metrics[1].increment =
                this.metrics[1].current.value / this.metrics[1].previous.value -
                1;
        });
        this._portfolioService.initialCash.subscribe((initialCash: number) => {
            this.metrics[1].previous.value = initialCash;
            this.metrics[1].increment =
                this.metrics[1].current.value / this.metrics[1].previous.value -
                1;
        });
        this._portfolioService.stockValue.subscribe((stockValue: number) => {
            this.metrics[2].current.value = stockValue;
            this.metrics[2].increment =
                this.metrics[2].current.value / this.metrics[2].previous.value -
                1;
        });
        this._portfolioService.initialStockValue.subscribe(
            (initialStockValue: number) => {
                this.metrics[2].previous.value = initialStockValue;
                this.metrics[2].increment =
                    this.metrics[2].current.value /
                        this.metrics[2].previous.value -
                    1;
            }
        );
        this._portfolioService.successRate.subscribe((successRate: number) => {
            console.log(successRate);
            this.metrics[3].current.value = successRate;
            this.metrics[3].increment = 0;
        });
    }
}
