import {
  Injectable
} from '@angular/core';
import {
  Stock,
  StockPrice
} from './stock';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  News
} from './news';

@Injectable({
  providedIn: 'root'
})
export class SearchStockService {
  HOST = 'http://localhost:3000/';
  searchUrl = this.HOST + 'api/search/stock/';
  detailsUrl = this.HOST + 'api/stock/';
  priceUrl = this.HOST + 'api/stock/';
  newsUrl = this.HOST + 'api/news/stock';
  monthlyHistoryUrl = this.HOST + 'api/charts/stock';
  dailyHistoryUrl = this.HOST + 'api/daily/charts/stock';

  constructor(public http: HttpClient) {}

  getStocks(searchStock: string): Observable < Stock[] > {
    window.console.log('Searching stock ' + searchStock + '.');

    // ask for stock
    const urlLink = this.searchUrl;
    const options = {
      params: {
        search: searchStock
      }
    };
    return this.http.get < Stock[] > (urlLink, options);
  }

  getStock(ticker: string): Observable < Stock > {
    window.console.log('Fetching stock ' + ticker + ' details.');
    // ask for stock
    const urlLink = this.detailsUrl + ticker;
    return this.http.get < Stock > (urlLink);
  }

  getStockPrice(ticker: string): Observable < StockPrice > {
    window.console.log('Fetching stock ' + ticker + ' price.');
    // ask for stock
    const urlLink = this.priceUrl + ticker + '/price';
    return this.http.get < StockPrice > (urlLink);
  }

  getStockNews(ticker: string): Observable < News[] > {
    window.console.log('Fetching stock ' + ticker + ' news.');
    const options = {
      params: {
        q: ticker
      }
    };
    return this.http.get < News[] > (this.newsUrl, options);
  }

  getStockMonthlyHistory(ticker: string, inputStartDate: string, inputEndDate: string): Observable < [] > {
    window.console.log('Fetching stock ' + ticker + ' monthly price history.');
    const options = {
      params: {
        q: ticker,
        startDate: inputStartDate,
        endDate: inputEndDate
      }
    };
    return this.http.get < [] > (this.monthlyHistoryUrl, options);
  }

  getStockDailyHistory(ticker: string, date: string): Observable < [] > {
    window.console.log('Fetching stock ' + ticker + ' monthly price history.');
    const options = {
      params: {
        q: ticker,
        startDate: date
      }
    };
    return this.http.get < [] > (this.dailyHistoryUrl, options);
  }

  getBookmarkedStockTickers(): string[] {
    console.log('Reading bookmarked stock...');
    const bookmarkStocks = JSON.parse(localStorage.getItem('bookmark_stocks'));
    console.log('Current bookmarked stocks:', bookmarkStocks);
    return bookmarkStocks;
  }

  setBookmarkedStockTickers(bookmarkStocks: string[]): void {
    localStorage.setItem('bookmark_stocks', JSON.stringify(bookmarkStocks));
    console.log('Update bookmark stocks.');
  }

  getBuyStocks(): any[] {
    console.log('Reading buy stocks...');
    const buyStocks = JSON.parse(localStorage.getItem('buy_stocks'));
    console.log('Current buy stocks:', buyStocks);
    return buyStocks;
  }

  setBuyStocks(buyStocks: any[]): void {
    localStorage.setItem('buy_stocks', JSON.stringify(buyStocks));
    console.log('Update buy stocks.');
  }
}
