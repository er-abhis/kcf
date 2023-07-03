import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  userFaq(){
    this.router.navigateByUrl('/faqs/user-faqs');
  }
  providerFaq(){
    this.router.navigateByUrl('/faqs/provider-faqs');

  }

}
