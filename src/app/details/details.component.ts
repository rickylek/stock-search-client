import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { interval, Observable } from 'rxjs';
import { Stock, StockPrice } from '../stock';
import { EMPTY_STOCK, EMPTY_STOCK_PRICE } from '../mock-stock';
import { SearchStockService } from '../search-stock.service';
import { EMPTY_NEWS, News } from '../news';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  ticker: string;
  stock: Stock;
  stockPrice: StockPrice;
  stockNews: News[];
  marketOpenStatusText: string;
  marketOpenStatusColor: string;
  currentTime: Date;
  messages = [];
  loadStatus: string;
  starClassName: string;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private searchStockService: SearchStockService,
    private datePipe: DatePipe
  ) {
      this.loadStatus = 'loading';

      this.stock = EMPTY_STOCK;
      this.stockPrice = EMPTY_STOCK_PRICE;
      // this.stockNews = [];
      this.marketOpenStatusText = '';
      this.currentTime = new Date();

      this.ticker = this.route.snapshot.paramMap.get('ticker');
      this.getStock();
      this.getStockNews();
      this.initStarClassName();
    }
    
  ngOnInit(): void {
  }

  isLoading(): boolean {
    if (this.loadStatus === 'loading') {
      return true;
    }
    return false;
  }

  isLoadFailed(): boolean {
    if (this.loadStatus === 'failed') {
      return true;
    }
    return false;
  }

  isLoadSuccess(): boolean {
    if (this.loadStatus === 'success') {
      return true;
    }
    return false;
  }

  initStarClassName(): void {
    let bookmarkStocks = this.searchStockService.getBookmarkedStockTickers();
    if (bookmarkStocks == null) {
      bookmarkStocks = [];
      this.starClassName = 'fa-star-o';
      return;
    }

    const targetStockIndex = bookmarkStocks.indexOf(this.ticker);
    if (targetStockIndex === -1) {
      this.starClassName = 'fa-star-o';
    } else {
      this.starClassName = 'fa-star';
    }
  }

  closeMessage(index: number): void {
    this.messages.splice(index, 1);
  }

  getStock(): void {
    console.log('run get stock...');
    this.searchStockService.getStock(this.ticker).subscribe(
      stock => {
        this.stock = stock;
        console.log(this.stock);
      },
      err => console.error(err),
      () => {
        if (this.stock.ticker === undefined) {
          this.loadStatus = 'failed';
          return;
        }

        console.log('Done Loading Stock Data');
        this.searchStockService.getStockPrice(this.ticker).subscribe(
          stockPrice => {
            this.stockPrice = stockPrice;
            // calculate change and change percentage
            this.stockPrice.change = this.stockPrice.last - this.stockPrice.prevClose;
            this.stockPrice.changePercentage = this.stockPrice.change * 100 / this.stockPrice.prevClose;

            // fix all number to .2
            for (const key in this.stockPrice) {
              if (Object.prototype.hasOwnProperty.call(this.stockPrice, key)) {
                const element = this.stockPrice[key];
                console.log(key + '\'s type is:', typeof(element));
                if (typeof(element) === 'number') {
                  this.stockPrice[key] = parseFloat(this.stockPrice[key]).toFixed(2);
                }
              }
            }
            // fix special values
            // volume must be integer
            this.stockPrice.volume = parseInt(this.stockPrice.volume.toString(), 10);
    
            // set null value to '-'
            for (const key in this.stockPrice) {
              if (Object.prototype.hasOwnProperty.call(this.stockPrice, key)) {
                const element = this.stockPrice[key];
                console.log(key + '\'s value is:', element);
                if (element === null) {
                  this.stockPrice[key] = '-';
                }
              }
            }
    
            console.log(this.stockPrice);
    
            // update market close status
            const dataTimestamp = new Date(this.stockPrice.timestamp);
            const currentTimestamp = new Date();
            const marketTimespan = (currentTimestamp.getTime() - dataTimestamp.getTime()) / 1000;
    
            // console.log('Data timestamp: ', dataTimestamp);
            // console.log('Current timestamp: ', currentTimestamp);
            // console.log('Market time span: ', marketTimespan);
    
            if (marketTimespan > 60) {
              this.marketOpenStatusText = 'Market Closed on ' + this.datePipe.transform(dataTimestamp, 'yyyy-MM-dd HH:mm:ss');
              this.marketOpenStatusColor = 'pink';
            } else {
              this.marketOpenStatusText = 'Market is Open';
              this.marketOpenStatusColor = 'green';
            }
          },
          err => console.error(err),
          () => {
            console.log('Done Loading Stock Price Data');
            this.loadStatus = 'success';
          });
      });
  }

  getStockNews(): void {
    console.log('getting stock news ...');
    this.searchStockService.getStockNews(this.ticker).subscribe(
      stockNews => {
        this.stockNews = stockNews;

        // transfer publishedAt to 'March 18, 2025' style
        for (const news of this.stockNews) {
          const publishedTime = new Date(news.publishedAt);
          news.publishedAt = this.datePipe.transform(publishedTime, 'MMMM dd, yyyy');
        }

        console.log(this.stockNews);
      },
      err => console.error(err),
      () => console.log('Done Loading Stock News'));
  }

  bookmarkStock(): void {
    console.log('Storing stock...');
    // get storage
    let bookmarkStocks = this.searchStockService.getBookmarkedStockTickers();

    if (bookmarkStocks == null) {
      bookmarkStocks = [];
    }

    const targetStockIndex = bookmarkStocks.indexOf(this.ticker);
    if (targetStockIndex !== -1) {
      bookmarkStocks.splice(targetStockIndex, 1);
      this.messages.push({
        className: 'alert-danger',
        text: this.ticker + ' removed from Wathchlist.'
      });
      this.starClassName = 'fa-star-o';
    } else {
      bookmarkStocks.push(this.ticker);
      this.messages.push({
        className: 'alert-success',
        text: this.ticker + ' added to Wathchlist.'
      });
      this.starClassName = 'fa-star';
    }

    this.searchStockService.setBookmarkedStockTickers(bookmarkStocks);
  }

  buyStocksChange(updatedBuyStock: any): void {
    this.messages.push({
      className: 'alert-success',
      text: this.ticker + ' bought successfully!'
    });
  }

}
