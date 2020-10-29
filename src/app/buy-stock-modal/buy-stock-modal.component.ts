import { EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { StockPrice } from '../stock';

@Component({
  selector: 'app-buy-stock-modal',
  templateUrl: './buy-stock-modal.component.html',
  styleUrls: ['./buy-stock-modal.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class BuyStockModalComponent implements OnInit {

  @Input() stockPrice: StockPrice;
  @Output() buyStocksChange = new EventEmitter<any>();
  quantity: number;
  total: number;
  buyButtonEnableStatus: boolean;
  myControl = new FormControl();
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    this.quantity = 0;
    this.total = 0.00;
    this.buyButtonEnableStatus = true;
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(data => {
      console.log('Quantity change to:', data);
      this.updateQuantity(data);
    });
  }

  showModal(buyModal: any): void {
    this.modalService.open(buyModal);
  }

  updateQuantity(quantity: string): void {
    this.quantity = parseInt(quantity, 10);
    if (quantity === null || this.quantity < 1) {
      this.quantity = 0;
      this.total = 0.00;
      this.buyButtonEnableStatus = true;
      return;
    }
    this.total = parseFloat((this.quantity * this.stockPrice.last).toFixed(2));
    this.buyButtonEnableStatus = false;
  }

  buyStock(ticker: string, price: number, quantity: number): void {
    console.log('Logging buy stock...');
    // get storage
    let buyStocks = JSON.parse(localStorage.getItem('buy_stocks'));
    console.log('Current buy stocks:', buyStocks, quantity, price);
    if (buyStocks == null) {
      buyStocks = {};
    }

    let totalQuantity = quantity;
    let totalValue = parseFloat((quantity * price).toFixed(2));

    if (ticker in buyStocks) {
      const oldBuyLog = buyStocks[ticker];
      totalValue += oldBuyLog.value;
      totalQuantity += oldBuyLog.quantity;
    }

    buyStocks[ticker] = {
      value: totalValue,
      quantity: totalQuantity
    };
    buyStocks[ticker].ticker = ticker;

    this.buyStocksChange.emit(buyStocks[ticker]);

    localStorage.setItem('buy_stocks', JSON.stringify(buyStocks));
    console.log('Update buy stocks.');
    this.modalService.dismissAll();
  }

}
