import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-provider-message-center',
  templateUrl: './provider-message-center.component.html',
  styleUrls: ['./provider-message-center.component.scss']
})
export class ProviderMessageCenterComponent implements OnInit {

  subscription! : Subscription
  constructor() { }

  ngOnInit(): void {
      
  }
  subsriptionChange($event: Subscription){
   this.subscription = $event
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
