import { Component, Input, OnInit } from '@angular/core';
import { TopMetric } from 'src/app/models/TopMetric';
import { TopMetricType } from 'src/app/models/TopMetricType';

@Component({
    selector: 'app-top-metric',
    templateUrl: './top-metric.component.html',
    styleUrls: ['./top-metric.component.scss'],
})
export class TopMetricComponent implements OnInit {
    @Input() _metricType: TopMetricType;
    @Input() _currentTopMetric: TopMetric;
    @Input() _previousTopMetric: TopMetric;
    @Input() _increment: number;

    constructor() {}

    ngOnInit() {}
}
