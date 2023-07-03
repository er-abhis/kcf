import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us-sidebar',
  templateUrl: './about-us-sidebar.component.html',
  styleUrls: ['./about-us-sidebar.component.scss'],
})
export class AboutUsSidebarComponent implements OnInit {
  activeWhatKCF: any = '';
  activeWhyKCF: any = '';
  activeAboutFounder: any = '';

  constructor(private scroller: ViewportScroller) {}

  ngOnInit(): void {}
  whatKCF() {
    this.activeWhatKCF = 'active';
    this.activeWhyKCF = '';
    this.activeAboutFounder = '';
    this.scroller.scrollToAnchor('whatKCF');
  }
  whyKCF() {
    this.activeWhatKCF = '';
    this.activeWhyKCF = 'active';
    this.activeAboutFounder = '';
    this.scroller.scrollToAnchor('whyKCF');
  }
  aboutFounder() {
    this.activeWhatKCF = '';
    this.activeWhyKCF = '';
    this.activeAboutFounder = 'active';
    this.scroller.scrollToAnchor('aboutFounder');
  }
}
