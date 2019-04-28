import { Component, OnInit, Input } from '@angular/core';

import { TopMetric } from 'src/app/models/TopMetric';

@Component({
    selector: 'app-top-metric',
    templateUrl: './top-metric.component.html',
    styleUrls: ['./top-metric.component.scss']
})
export class TopMetricComponent implements OnInit {

    @Input() _currentTopMetric:  TopMetric;
    @Input() _previousTopMetric: TopMetric;
    @Input() _increment:         number;

    constructor() {}

    ngOnInit() {
    }
}
