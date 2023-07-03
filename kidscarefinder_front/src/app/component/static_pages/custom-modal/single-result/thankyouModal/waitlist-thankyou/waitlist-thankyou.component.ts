import { UserService } from 'src/app/services/rest-services/user.service';
import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waitlist-thankyou',
  templateUrl: './waitlist-thankyou.component.html',
  styleUrls: ['./waitlist-thankyou.component.scss'],
})
export class WaitlistThankyouComponent implements OnInit {
  showLoader: boolean = false;
  waitlist: any;
  childName: any;
  constructor(private dialog: Dialog, private userservice: UserService) {}

  ngOnInit(): void {
    this.showLoader = true;

    this.WaitlistLoader();
  }

  WaitlistLoader() {
    setTimeout(() => {
      this.waitlist = this.userservice.getWaitData();

      this.childName = this.waitlist.data.child.first_name;
      this.showLoader = false;
    }, 1000);
  }

  closeModal() {
    this.dialog.closeAll();
  }
  // errors.non_field_errors[0]
}
