import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';

@Component({
  selector: 'app-enroll-thankyou',
  templateUrl: './enroll-thankyou.component.html',
  styleUrls: ['./enroll-thankyou.component.scss'],
})
export class EnrollThankyouComponent implements OnInit {
  showLoader: boolean = false;
  enrolled: any;
  childName: any;
  providerName: any;
  constructor(private dialog: Dialog, private userservice: UserService) { }
  ngOnInit(): void {
    this.showLoader = true;

    this.WaitlistLoader();
  }
  WaitlistLoader() {

    setTimeout(() => {
      this.enrolled = this.userservice.getEnrollData();
      this.providerName = this.enrolled?.data?.provider?.organi;

      this.childName = this.enrolled?.data?.child?.first_name;
      this.showLoader = false;
    }, 1000);
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
