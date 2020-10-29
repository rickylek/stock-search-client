import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Stock} from '../stock';
import { SearchStockService } from '../search-stock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  detailsUrl = 'details/';
  myControl = new FormControl();
  stocks: Observable<Stock[]>;
  constructor(private searchStockService: SearchStockService, private router: Router) {}

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe(data => {
      console.log('input change to:', data);
      this.updateSearch(data);
    });
  }

  updateSearch(search: string): void {
    this.stocks = this.getStocks(search.toUpperCase());
  }

  getStocks(searchStock: string): Observable<Stock[]> {
    return this.searchStockService.getStocks(searchStock);
  }

  getStockDetails(): void {
    const ticker = this.myControl.value;
    console.log('input stock ticker is:', ticker);
    const result = this.searchStockService.getStock(ticker);
    result.toPromise().then(response => {
      console.log('fetch stock detail result:', response);
      if (response == null) {
        console.log('Not found stock ' + ticker + '!');
      } else {
        console.log('Found stock ' + ticker + ', go to the details page!');
        this.router.navigate([this.detailsUrl + ticker]);
      }
    });

  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
}
