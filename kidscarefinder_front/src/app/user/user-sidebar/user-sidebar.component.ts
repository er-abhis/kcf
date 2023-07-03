import { UserService } from 'src/app/services/rest-services/user.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { Router } from '@angular/router';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { StripeAfterpayClearpayMessageElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
})
export class UserSidebarComponent implements OnInit {
  welcome_name: any;
  msg: any;
  profilePicUser: any;
  parentList: any;
  authList: any;
  firstName: any;
  medical: any;
  health: any;
  dentist: any;
  pedia: any;
  lastName: any;
  public activeTab: any;
  user_type: any;
  provider_id: any;
  userDetails_id: any;
  id: any;
  onSelectTab(newTab: string): void {
    this.activeTab = newTab;
    this.router.navigate([newTab]);
  }
  constructor(private router: Router, public userService: UserService,
    private localStorage: LocalstorageService,
    private messengerService: MessengerService,
  ) { }

  ngOnInit(): void {
    this.userDetails();
    this.msgNotify();
  }

  msgNotify() {
    let data: any = {}
    this.user_type = this.localStorage.getUser().user_type;
    this.provider_id = this.localStorage.getUser().provider_id;
    this.userDetails_id = this.localStorage.getUser().userDetails_id;

    if (this.user_type == 'USER') {
      data.user_id = this.userDetails_id;
    }
    if (this.user_type == 'PROVIDER') {
      data.provider_id = this.provider_id;
    }
    this.messengerService.allrooms(data).subscribe({
      next: (res: any) => {
        this.userService.newMsgCount = res.data?.new_messages;
      },
    });
  }

  userDetails() {
    let id = this.localStorage.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.userService.setUserData(data);
        this.id = id;
        this.parentList = data.user_parentguardian;
        this.authList = data.user_authorizedperson;
        this.medical = data.user_medicalcontacts;
        this.health = data.user_childhealthhistory;

        if (data && data.data && data.data[0].userDetails) {
          this.firstName = data.data[0].userDetails.first_name;
          this.lastName = data.data[0].userDetails.last_name;
          this.welcome_name = data.data?.[0].userDetails.first_name[0];
          this.profilePicUser = data.data[0].profile_photo;
        }
      },
    });
  }

  closeSidebar() {
    var menu = <any>document.querySelector('.sidebarleft');
    menu.classList.remove("active_menu")
  }

}
