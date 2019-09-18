import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMetricComponent } from './top-metric-bar.component';

describe('TopMetricComponent', () => {
  let component: TopMetricComponent;
  let fixture: ComponentFixture<TopMetricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMetricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
