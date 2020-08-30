import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategySelectorComponent } from './strategy-selector.component';

describe('TopMetricComponent', () => {
    let component: StrategySelectorComponent;
    let fixture: ComponentFixture<StrategySelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StrategySelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StrategySelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
