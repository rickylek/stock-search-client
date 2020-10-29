import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchInputComponent } from './search-input/search-input.component';
import { ReactiveFormsModule, FormsModule,   } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DetailsComponent } from './details/details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DetailsSummaryComponent } from './details-summary/details-summary.component';
import { DetailsNewsComponent } from './details-news/details-news.component';
import { DetailsChartsComponent } from './details-charts/details-charts.component';
import { ChangePriceComponent } from './change-price/change-price.component';
import { DatePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLineModule } from '@angular/material/core';
import { BuyStockModalComponent } from './buy-stock-modal/buy-stock-modal.component';
import { SellStockModalComponent } from './sell-stock-modal/sell-stock-modal.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { SummaryChartsComponent } from './summary-charts/summary-charts.component';
import { TestChildComponent } from './test-child/test-child.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    SearchInputComponent,
    WatchlistComponent,
    PortfolioComponent,
    DetailsComponent,
    DetailsSummaryComponent,
    DetailsNewsComponent,
    DetailsChartsComponent,
    ChangePriceComponent,
    BuyStockModalComponent,
    SellStockModalComponent,
    SummaryChartsComponent,
    TestChildComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatLineModule,
    MatGridListModule,
    HighchartsChartModule,
    MatProgressSpinnerModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
