import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support-sidebar',
  templateUrl: './support-sidebar.component.html',
  styleUrls: ['./support-sidebar.component.scss']
})
export class SupportSidebarComponent implements OnInit {
  public activeTab : any;
  faq: any = '';
  videotutorial: any = '';
  contactUs: any = '';
  siteOverview: any = '';
  
  onSelectTab(newTab: string): void {
    this.activeTab = newTab;
    this.router.navigate([newTab]);
  }
  constructor(private router: Router, private scroller: ViewportScroller) { }

  ngOnInit(): void {
  }

  siteover(){
    this.siteOverview = 'active';
    this.faq = '';
    this.videotutorial = '';
    this.contactUs = '';
    this.scroller.scrollToAnchor('overView');
  }

  supportFAQ() {
    this.siteOverview = '';
    this.faq = 'active';
    this.videotutorial = '';
    this.contactUs = '';
    this.scroller.scrollToAnchor('supportFAQ');
    this.router.navigateByUrl('/faqs');
  } 
  video() {
    this.siteOverview = '';
    this.faq = '';
    this.videotutorial = 'active';
    this.contactUs = '';
    this.scroller.scrollToAnchor('videoTutorial');
  } 
  contact() {
    this.siteOverview = '';
    this.faq = '';
    this.videotutorial = '';
    this.contactUs = 'active';
    this.scroller.scrollToAnchor('contactUS');
  } 

}
