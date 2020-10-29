import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  SearchStockService
} from '../search-stock.service';
import * as Highcharts from 'highcharts/highstock';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);

import {
  StockPrice
} from '../stock';
import {
  DatePipe
} from '@angular/common';
@Component({
  selector: 'app-summary-charts',
  templateUrl: './summary-charts.component.html',
  styleUrls: ['./summary-charts.component.css']
})
export class SummaryChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  updateFlag = false;
  chartOptions: Highcharts.Options;
  chartConstructor = 'stockChart';
  @Input() stockPrice: StockPrice;
  constructor(
    private searchStockService: SearchStockService,
    private datePipe: DatePipe
  ) {
    this.getSourceData();
  }

  ngOnInit(): void {
    // console.log('Summary charts page: read stock price is', this.stockPrice);
    console.log('Summary charts page ng on init: read stock price is', this.stockPrice);
    const lastDay = new Date(this.stockPrice.timestamp);
    const lastMarketOpenDay = this.datePipe.transform(lastDay, 'yyyy-MM-dd');

    this.searchStockService.getStockDailyHistory(this.stockPrice.ticker, lastMarketOpenDay).subscribe(
      history => this.updateSourceData(history),
      err => console.error(err),
      () => {
        console.log('Done Loading Stock Daily Price');
      });
  }

  getSourceData(): void {
    // get the price at the last market open day.
    // console.log('Summary charts page construct: read stock price is', this.stockPrice);
    // const lastDay = new Date(this.stockPrice.timestamp);
    // const lastMarketOpenDay = this.datePipe.transform(lastDay, 'yyyy-MM-dd');

    // this.searchStockService.getStockDailyHistory(this.stockPrice.ticker, lastMarketOpenDay).subscribe(
    //   history => this.updateSourceData(history),
    //   err => console.error(err),
    //   () => {
    //     console.log('Done Loading Stock Daily Price');
    //   });
  }

  updateSourceData(history): void {
    const dailyData = [];
    history.forEach(element => {
      dailyData.push([
        new Date(element['date']).getTime(),
        element['open'],
      ]);
    });

    console.log('Load daily price data:', dailyData);

    this.chartOptions = {
      //   rangeSelector: {
      //     selected: 2
      // },
      title: {
        text: '平安银行历史股价'
      },
      plotOptions: {
        series: {
          showInLegend: true
        }
      },
      tooltip: {
        split: false,
        shared: true
      },
      series: [{
        type: 'line',
        id: '000001',
        name: this.stockPrice.ticker,
        data: dailyData
      }]
    };
  }
}
