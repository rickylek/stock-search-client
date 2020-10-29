import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyStockModalComponent } from './buy-stock-modal.component';

describe('BuyStockModalComponent', () => {
  let component: BuyStockModalComponent;
  let fixture: ComponentFixture<BuyStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyStockModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
