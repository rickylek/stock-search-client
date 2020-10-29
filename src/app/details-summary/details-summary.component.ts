import { Component, Input, OnInit } from '@angular/core';
import { Stock, StockPrice } from '../stock';
@Component({
  selector: 'app-details-summary',
  templateUrl: './details-summary.component.html',
  styleUrls: ['./details-summary.component.css']
})
export class DetailsSummaryComponent implements OnInit {
  @Input() stock: Stock;
  @Input() stockPrice: StockPrice;
  constructor() {

  }

  ngOnInit(): void {
  }

}
