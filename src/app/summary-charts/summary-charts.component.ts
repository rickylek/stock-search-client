import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);

import { StockPrice } from '../stock';
import { SearchStockService } from '../search-stock.service';
import { EMPTY_STOCK_PRICE } from '../mock-stock';
@Component({
  selector: 'app-summary-charts',
  templateUrl: './summary-charts.component.html',
  styleUrls: ['./summary-charts.component.css']
})
export class SummaryChartsComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartRef: Highcharts.Chart;
  @Input() stockPrice: StockPrice;
  chartOptions: Highcharts.Options;
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart; // We can get chart through chartRef
  }
  constructor(
    private searchStockService: SearchStockService,
    private datePipe: DatePipe
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputStockPrice: any = changes['stockPrice'].currentValue;

    // console.log('Summary charts page: read stock price is', this.stockPrice);
    console.log('Summary charts page ng on init: read stock price is', inputStockPrice);

    if (inputStockPrice.ticker === EMPTY_STOCK_PRICE.ticker) {
      console.log('Data not loading done, keep waiting.');
      return;
    }

    const lastDay = new Date(this.stockPrice.timestamp);
    const lastMarketOpenDay = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.searchStockService.getStockDailyHistory(this.stockPrice.ticker, lastMarketOpenDay).subscribe(
      history => this.updateSourceData(history),
      err => console.error(err),
      () => {
        console.log('Done Loading Stock Daily Price');
      });
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
      lang: {
        rangeSelectorZoom: '' // hide 'zoom' word
      },
      rangeSelector: {
        buttonTheme: {
            display: 'none' // hide buttons
        },
        selected: 1,
        inputEnabled: false // hide date inputs
      },
      title: {
        text: this.stockPrice.ticker
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
