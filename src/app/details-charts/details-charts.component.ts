import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
HC_stock(Highcharts);
import HC_indicators from 'highcharts/indicators/indicators';
HC_indicators(Highcharts);
import HC_volume_by_price from 'highcharts/indicators/volume-by-price';
HC_volume_by_price(Highcharts);
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  SearchStockService
} from '../search-stock.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details-charts',
  templateUrl: './details-charts.component.html',
  styleUrls: ['./details-charts.component.css']
})
export class DetailsChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts; // required
  updateFlag = false;
  @Input() ticker: string;
  chartConstructor = 'stockChart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options;
  constructor(
    private searchStockService: SearchStockService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.getSourceDataFromService();
  }

  getSourceDataFromService(): void {
    const today = new Date();
    const start = new Date();
    start.setTime(today.getTime() - 2 * 365 * 24 * 3600 * 1000);
    const startDate = this.datePipe.transform(start, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.searchStockService.getStockMonthlyHistory(this.ticker, startDate, endDate).subscribe(
      history => this.updateSourceDataFromService(history),
      err => console.error(err),
      () => {
        console.log('Done Loading Stock History');
      });
  }

  updateSourceDataFromService(history): void {
    let data = [];
    history.forEach(element => {
      data.push([
        new Date(element['date']).getTime(),
        element['open'],
        element['high'],
        element['low'],
        element['close'],
        element['volume'],
      ]);
    });

    console.log('Load data:', data);

    // split the data set into ohlc and volume
    const ohlc = [];
    const volume = [];
    const dataLength = data.length;

    let i = 0;
    for (i; i < dataLength; i += 1) {
      ohlc.push([
        data[i][0], // the date
        data[i][1], // open
        data[i][2], // high
        data[i][3], // low
        data[i][4] // close
      ]);
      volume.push([
        data[i][0], // the date
        data[i][5] // the volume
      ]);
    }

    this.chartOptions = {
      rangeSelector: {
        selected: 2
      },
      title: {
        text: 'AAPL Historical'
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      tooltip: {
        split: true
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              [
                'week', // unit name
                [1] // allowed multiples
              ],
              [
                'month',
                [1, 2, 3, 4, 6]
              ]
            ]
          }
        }
      },
      series: [{
          type: 'candlestick',
          name: 'AAPL',
          id: 'aapl',
          zIndex: 2,
          data: ohlc // ohlc
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume, // this.volume,
          yAxis: 1
        },
        {
          type: 'vbp',
          linkedTo: 'aapl',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        },
        {
          type: 'sma',
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
            enabled: false
          }
        }
      ]
    };
  }

}
