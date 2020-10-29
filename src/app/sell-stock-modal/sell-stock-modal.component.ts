import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchStockService } from '../search-stock.service';
import { StockPrice } from '../stock';

@Component({
  selector: 'app-sell-stock-modal',
  templateUrl: './sell-stock-modal.component.html',
  styleUrls: ['./sell-stock-modal.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class SellStockModalComponent implements OnInit {

  @Input() stockPrice: StockPrice;
  @Output() buyStocksChange = new EventEmitter<any>();
  quantity: number;
  inputQuantity: number;
  total: number;
  sellButtonEnableStatus: boolean;
  myControl = new FormControl();
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private searchStockService: SearchStockService,
  ) {
    this.quantity = 0;
    this.inputQuantity = 0;
    this.total = 0.00;
    this.sellButtonEnableStatus = true;
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
    this.getBuyStock();
    this.modalService.open(buyModal);
  }

  getBuyStock(): void {
    const ticker = this.stockPrice.ticker;
    const buyStockLogs = this.searchStockService.getBuyStocks();
    if (buyStockLogs === null || buyStockLogs[ticker] === undefined) {
      return;
    }

    this.quantity = buyStockLogs[ticker].quantity;
    console.log('Sell stock modal get quantity is ', this.quantity);
  }

  updateQuantity(quantity: string): void {
    const newQuantity = parseInt(quantity, 10);
    if (quantity === null || newQuantity < 1 || newQuantity > this.quantity) {

      this.total = 0.00;
      this.sellButtonEnableStatus = true;
      return;
    }
    this.inputQuantity = newQuantity;
    this.total = parseFloat((this.inputQuantity * this.stockPrice.last).toFixed(2));
    this.sellButtonEnableStatus = false;
  }

  sellStock(ticker: string, price: number, quantity: number): void {
    console.log('Logging sell stock...');
    // get storage
    const buyStocks = this.searchStockService.getBuyStocks();
    if (buyStocks == null || buyStocks[ticker] === undefined) {
      return;
    }
    const oldBuyLog = buyStocks[ticker];

    const totalQuantity = oldBuyLog.quantity - quantity;
    const totalValue = parseFloat((oldBuyLog.value * (totalQuantity / oldBuyLog.quantity)).toFixed(2));

    buyStocks[ticker] = {
      value: totalValue,
      quantity: totalQuantity
    };
    buyStocks[ticker].ticker = ticker;
    console.log('Sell stock ' + ticker + ':' + quantity, ', current stock is ', buyStocks[ticker]);
    this.buyStocksChange.emit(buyStocks[ticker]);

    if (buyStocks[ticker].quantity === 0) {
      delete(buyStocks[ticker]);
    }
    this.searchStockService.setBuyStocks(buyStocks);
    this.modalService.dismissAll();
  }
}
