import { Component, OnInit, Input } from '@angular/core';
import { EMPTY_STOCK_PRICE } from '../mock-stock';
import { StockPrice } from '../stock';

@Component({
  selector: 'app-change-price',
  templateUrl: './change-price.component.html',
  styleUrls: ['./change-price.component.css']
})
export class ChangePriceComponent implements OnInit {

  @Input() stockPrice: StockPrice;
  changeColor: string;
  changeIcon: string;
  constructor() {
    this.stockPrice = EMPTY_STOCK_PRICE;
    this.changeColor = 'green';
    this.changeIcon = 'arrowdropup';
  }

  ngOnInit(): void {
    console.log('Calculate change:', this.stockPrice);
  }

  getChangeColor(): string {
    if (this.stockPrice.change === 0) {
      this.changeColor = 'black';
      this.changeIcon = '';
    } else if (this.stockPrice.change > 0) {
      this.changeColor = 'green';
      this.changeIcon = 'fa-caret-up';
    } else {
      this.changeColor = 'red';
      this.changeIcon = 'fa-caret-down';
    }
    return this.changeColor;
  }

}
