import { Component, Input, OnInit } from '@angular/core';
import { EMPTY_NEWS, News } from '../news';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-details-news',
  templateUrl: './details-news.component.html',
  styleUrls: ['./details-news.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class DetailsNewsComponent implements OnInit {

  @Input() stockNews: News;
  selectedNews: News;
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) {
    this.selectedNews = EMPTY_NEWS;
    // config.backdrop = 'static';
    config.size = 'sm';
    // config.centered = true;
    config.windowClass = 'news-modal';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  showNewsDetails(news: News, content: any): void {
    this.selectedNews = news;
    this.modalService.open(content);
  }

}
