import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SymbolSelectorComponent } from './symbol-selector.component';

describe('TopMetricComponent', () => {
    let component: SymbolSelectorComponent;
    let fixture: ComponentFixture<SymbolSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SymbolSelectorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SymbolSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
