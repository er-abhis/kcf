import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import template from "./content";
@Component({
  selector: 'app-user-faqs',
  templateUrl: './user-faqs.component.html',
  styleUrls: ['./user-faqs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserFaqsComponent implements OnInit {
  count: number = 0;
  html: any;

  constructor() { }

  ngOnInit(): void {
    //this.html = template;
    let myContainer = <HTMLElement>document.querySelector(".contentright");
    myContainer.innerHTML = template;
  }

  onSearch(e: any) {
    let myContainer = <HTMLElement>document.querySelector(".contentright");
    myContainer.innerHTML = template;
    var count = 0;
    if (e.target.value && e.target.value.trim()) {
      (<any>window).find(e.target.value);
      const re = new RegExp(e.target.value, 'igm');
      //first parahra
      var dom = Array.from(document.getElementsByClassName('faqToph1') as HTMLCollectionOf<HTMLElement>)
      dom.forEach((item, index) => {
        item.innerHTML = item.innerHTML.replace(re, (x: any) => {
          count++;
          return '<span class="highlighted-text">' + x + '</span>';
        });
      });

      for (var i = 1; i < 4; i++) {
        var dom = Array.from(document.getElementsByClassName('faqh' + i) as HTMLCollectionOf<HTMLElement>)
        dom.forEach((item, index) => {
          item.innerHTML = item.innerHTML.replace(re, (x: any) => {
            count++;
            return '<span class="highlighted-text">' + x + '</span>';
          });
        });
      }
      //second parah
      var dom = Array.from(document.getElementsByClassName('headPara') as HTMLCollectionOf<HTMLElement>)
      dom.forEach((item, index) => {
        item.innerHTML = item.innerHTML.replace(re, (x: any) => {
          count++;
          return '<span class="highlighted-text">' + x + '</span>';
        });
      });

      var dom = Array.from(document.getElementsByClassName('faqpara') as HTMLCollectionOf<HTMLElement>)
      dom.forEach((item, index) => {
        item.innerHTML = item.innerHTML.replace(re, (x: any) => {
          count++;
          return '<span class="highlighted-text">' + x + '</span>';
        });
      });

      var dom = Array.from(document.getElementsByClassName('faqList') as HTMLCollectionOf<HTMLElement>)
      dom.forEach((item, index) => {
        item.innerHTML = item.innerHTML.replace(re, (x: any) => {
          count++;
          return '<span class="highlighted-text">' + x + '</span>';
        });
      });
    }
    this.count = count;
  }
}
