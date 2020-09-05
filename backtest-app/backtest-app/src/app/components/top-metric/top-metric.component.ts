import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TopMetric } from 'src/app/models/TopMetric';
import { TopMetricType } from 'src/app/models/TopMetricType';

@Component({
    selector: 'app-top-metric',
    templateUrl: './top-metric.component.html',
    styleUrls: ['./top-metric.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMetricComponent {
    @Input() public readonly metricType: TopMetricType;
    @Input() public readonly currentTopMetric: TopMetric;
    @Input() public readonly previousTopMetric: TopMetric;
    @Input() public readonly increment: number;
}
