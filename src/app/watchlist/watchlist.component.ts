import { Component, OnInit } from '@angular/core';
import { SearchStockService } from '../search-stock.service';
import { Stock } from '../stock';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  isNoBookmarkedStock: boolean;
  bookmarkedStocks: Stock[];
  constructor(
    private searchStockService: SearchStockService,
  ) {
    this.isNoBookmarkedStock = false;
    this.bookmarkedStocks = [];
  }

  ngOnInit(): void {
    this.getBookmarkedStocks();
  }

  isLoadFailed(): boolean {
    return this.isNoBookmarkedStock;
  }

  getBookmarkedStocks(): void {
    // load all bookmarked stock tickers
    const bookmarkedStockTickers = this.searchStockService.getBookmarkedStockTickers();
    if (bookmarkedStockTickers == null || bookmarkedStockTickers.length < 1) {
      this.isNoBookmarkedStock = true;
      console.log('There is no bookmarked stocks!');
      return;
    }

    // load all bookmarked stocks
    const stocks = [];
    bookmarkedStockTickers.forEach(ticker => {
      this.searchStockService.getStock(ticker).subscribe(
        stock => {
          // load all bookmarked stock price
          this.searchStockService.getStockPrice(stock.ticker).subscribe(
            stockPrice => {
              console.log('Current stock price ', stockPrice);
              // calculate change and change percentage
              stockPrice.change = stockPrice.last - stockPrice.prevClose;
              stockPrice.changePercentage = stockPrice.change * 100 / stockPrice.prevClose;
      
              // fix all number to .2
              for (const key in stockPrice) {
                if (Object.prototype.hasOwnProperty.call(stockPrice, key)) {
                  const element = stockPrice[key];
                  console.log(key + '\'s type is:', typeof(element));
                  if (typeof(element) === 'number') {
                    stockPrice[key] = parseFloat(stockPrice[key]).toFixed(2);
                  }
                }
              }
              // fix special values
              // volume must be integer
              stockPrice.volume = parseInt(stockPrice.volume.toString(), 10);
      
              // set null value to '-'
              for (const key in stockPrice) {
                if (Object.prototype.hasOwnProperty.call(stockPrice, key)) {
                  const element = stockPrice[key];
                  console.log(key + '\'s value is:', element);
                  if (element === null) {
                    stockPrice[key] = '-';
                  }
                }
              }
              stock.stockPrice = stockPrice;
              console.log('Get stock with stock price: ', stock);
            },
            err => console.error(err),
            () => console.log('Done Loading Stock Data'));

          stocks.push(stock);
        },
        err => console.error(err),
        () => console.log('Done Loading Stock Data'));
    });

    this.bookmarkedStocks = stocks;
  }

  unBookmarkStock(ticker: string): void {
    let bookmarkedStockIndex = -1;
    this.bookmarkedStocks.forEach((stock, index) => {
      if (stock.ticker === ticker) {
        bookmarkedStockIndex = index;
        return false;
      }
    });

    if (bookmarkedStockIndex === -1) {
      console.log('Stock ' + ticker + ' not bookmarked!');
      return;
    }

    this.bookmarkedStocks.splice(bookmarkedStockIndex, 1);

    // load all bookmarked stock tickers
    const bookmarkedStockTickers = this.searchStockService.getBookmarkedStockTickers();
    if (bookmarkedStockTickers === null) {
      console.log('Stock ' + ticker + ' not found bookmarked log in local storage!');
      return;
    }
    bookmarkedStockTickers.splice(bookmarkedStockTickers.indexOf(ticker), 1);
    this.searchStockService.setBookmarkedStockTickers(bookmarkedStockTickers);
  }

}
