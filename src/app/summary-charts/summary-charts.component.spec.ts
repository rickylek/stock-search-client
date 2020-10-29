import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChartsComponent } from './summary-charts.component';

describe('SummaryChartsComponent', () => {
  let component: SummaryChartsComponent;
  let fixture: ComponentFixture<SummaryChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
