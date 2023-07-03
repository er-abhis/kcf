import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-overview',
  templateUrl: './site-overview.component.html',
  styleUrls: ['./site-overview.component.scss']
})
export class SiteOverviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
   //correct-route faqs/user-step1
   // faqs/provider-step1
  }
  userFaq(){
    this.router.navigateByUrl('/faqs');
  }
  providerFaq(){
    this.router.navigateByUrl('/faqs');

  }

}
