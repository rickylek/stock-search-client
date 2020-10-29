import { TestBed } from '@angular/core/testing';

import { SearchStockService } from './search-stock.service';

describe('SearchStockService', () => {
  let service: SearchStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
