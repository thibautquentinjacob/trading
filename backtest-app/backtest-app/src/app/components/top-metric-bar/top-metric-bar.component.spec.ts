import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopMetricBarComponent } from './top-metric-bar.component';

describe('TopMetricComponent', () => {
    let component: TopMetricBarComponent;
    let fixture: ComponentFixture<TopMetricBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TopMetricBarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopMetricBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
