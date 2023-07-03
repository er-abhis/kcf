import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/rest-services/user.service';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.scss']
})
export class MessageCenterComponent implements OnInit {
  providerSelectedData: any;
  subscription! : Subscription

  constructor(
    private userservice: UserService
  ) { }

  ngOnInit(): void {
    this.providerSelectedData = this.userservice.getApplyOnlineData();
  }
  subsriptionChange($event: Subscription){
    this.subscription = $event
   }
  getProvider() {
    var id = this.providerSelectedData.provider.id;

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
