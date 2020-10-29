import { Component, OnInit } from '@angular/core';
import { SearchStockService } from '../search-stock.service';
import { Stock } from '../stock';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  buyStocks = [];
  isNoBuyStock: boolean;
  constructor(
    private searchStockService: SearchStockService,
  ) {
    this.isNoBuyStock = false;
  }
  ngOnInit(): void {
    this.getBuyStocks();
  }

  isLoadFailed(): boolean {
    return this.isNoBuyStock;
  }

  getBuyStocks(): void {

    // load all buy stock tickers
    const buyStockLogs = this.searchStockService.getBuyStocks();
    const buyStocks = this.buyStocks;
    if (buyStockLogs == null) {
      this.isNoBuyStock = true;
      console.log('There is no buy stocks!');
      return;
    }

    for (const ticker in buyStockLogs) {
      if (Object.prototype.hasOwnProperty.call(buyStockLogs, ticker)) {
        const element = buyStockLogs[ticker];
        element.ticker = ticker;
        buyStocks.push(element);
      }
    }

    console.log('Start loading buy stock prices: ', buyStocks);

    // load all buy stocks
    buyStocks.forEach(buyMessage => {
      const ticker = buyMessage.ticker;
      this.searchStockService.getStock(ticker).subscribe(
        stock => {
          buyMessage.name = stock.name;
          buyMessage.costPrice = parseFloat((buyMessage.value / buyMessage.quantity).toFixed(2));
          this.searchStockService.getStockPrice(stock.ticker).subscribe(
            stockPrice => {
              // calculate change
              buyMessage.last = stockPrice.last;
              buyMessage.change = stockPrice.last - buyMessage.costPrice;
              buyMessage.currentValue = parseFloat((buyMessage.last * buyMessage.quantity).toFixed(2));
              buyMessage.stockPrice = stockPrice;
              
              // calculate color and icon
              buyMessage.changeColor = 'black';
              buyMessage.changeIcon = '';
              if (buyMessage.change > 0) {
                buyMessage.changeColor = 'green';
                buyMessage.changeIcon = 'fa-caret-up';
              } else if (buyMessage.change < 0) {
                buyMessage.changeColor = 'red';
                buyMessage.changeIcon = 'fa-caret-down';
              }

              console.log('Get buy message: ', buyMessage);
            },
            err => console.error(err),
            () => console.log('Done Loading Stock Data'));
        },
        err => console.error(err),
        () => console.log('Done Loading Stock Data'));
    });
  }

  buyStocksChange(updatedBuyStock: any): void {
    for (const index in this.buyStocks) {
      if (Object.prototype.hasOwnProperty.call(this.buyStocks, index)) {
        const element = this.buyStocks[index];
        // update value and quantity
        if (element.ticker === updatedBuyStock.ticker) {
          element.value = updatedBuyStock.value;
          element.quantity = updatedBuyStock.quantity;
          element.costPrice = parseFloat((element.value / element.quantity).toFixed(2));
          element.currentValue = element.last * element.quantity;
          element.change = element.last - element.costPrice;
          if (element.quantity === 0) {
            this.buyStocks.splice(parseInt(index, 10), 1);
          }
        }

      }
    }
  }

}
