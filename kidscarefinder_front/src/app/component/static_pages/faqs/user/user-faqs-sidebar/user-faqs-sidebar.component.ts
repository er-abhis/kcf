import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-faqs-sidebar',
  templateUrl: './user-faqs-sidebar.component.html',
  styleUrls: ['./user-faqs-sidebar.component.scss']
})
export class UserFAQSSidebarComponent implements OnInit {
  activeWebsite: any = '';
  activeAccount: any = '';
  activePayments: any = '';
  activeFinding: any = '';
  constructor(private scroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  backgroundCheck() {
    this.activeWebsite = 'active';
    this.activeAccount = '';
    this.activePayments = '';
    this.activeFinding = '';
    this.scroller.scrollToAnchor("backgroundCheck");
  } 
  
  applicationEnroll() {
    this.activeWebsite = '';
    this.activeAccount = 'active';
    this.activePayments = '';
    this.activeFinding = '';
    this.scroller.scrollToAnchor("applicationEnroll");
  } 
  
  waitlist() {
    this.activeWebsite = '';
    this.activeAccount = '';
    this.activePayments = 'active';
    this.activeFinding = '';
    this.scroller.scrollToAnchor("waitlist");
  } 
  
  additionalWeb() {
    this.activeWebsite = '';
    this.activeAccount = '';
    this.activePayments = '';
    this.activeFinding = 'active';
    this.scroller.scrollToAnchor("additionalWeb");
  } 
}
