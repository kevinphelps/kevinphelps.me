import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { pageNotFoundTitle } from './../../shared/constants';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private originalTitle: string;

  constructor(private readonly title: Title) {}

  ngOnInit() {
    this.originalTitle = this.title.getTitle();
    this.title.setTitle(pageNotFoundTitle);
  }

  ngOnDestroy() {
    this.title.setTitle(this.originalTitle);
  }
}
