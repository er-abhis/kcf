import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policies-sidebar',
  templateUrl: './privacy-policies-sidebar.component.html',
  styleUrls: ['./privacy-policies-sidebar.component.scss']
})
export class PrivacyPoliciesSidebarComponent implements OnInit {
  activePrivacy :  any = '';
  activeCopy :  any = '';
  constructor(private scroller: ViewportScroller) { }

  ngOnInit(): void {
  }



  privacyPolicy() {
    this.activePrivacy = 'active';
    this.activeCopy = '';
    this.scroller.scrollToAnchor("privacyPolicy");
  }
  copyrightPolicy() {
    this.activePrivacy = '';
    this.activeCopy = 'active';
    this.scroller.scrollToAnchor("copyrightPolicy");
  }






}
