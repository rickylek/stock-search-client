import { Component, Input, OnInit } from '@angular/core';
import { StockPrice } from '../stock';

@Component({
  selector: 'app-test-child',
  templateUrl: './test-child.component.html',
  styleUrls: ['./test-child.component.css']
})
export class TestChildComponent implements OnInit {

  @Input() stockPrice: StockPrice;
  constructor() { }

  ngOnInit(): void {
  }

}
