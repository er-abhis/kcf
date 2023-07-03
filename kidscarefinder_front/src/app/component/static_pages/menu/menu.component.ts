import { Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { SignInComponent } from './../../sign-in/sign-in.component';
import { UserService } from 'src/app/services/rest-services/user.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LoginProviderModalComponent } from '../custom-modal/login-provider-modal/login-provider-modal.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
@Component({
  selector: 'app-custom-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  logedIn: boolean = false;
  loginRole: any;
  user: any;
  msg: any;
  welcome_name: any;
  welcome_icon: any;
  profilePicProvider: any;
  profilePicUser: any;
  welcome_icon_provider: any;
  welcome_provider_name: any;
  user_type: any;
  provider_id: any;
  userDetails_id: any;
  constructor(
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private router: Router,
    public userService: UserService,
    private providerService: ProviderService,
    private localStorage: LocalstorageService,
    private notiserv: NotificationService,
    private messengerService: MessengerService,
  ) { }

  ngOnInit(): void {
    this.loginRole = this.localStorage.getUser()?.user_type;
    if (this.loginRole == 'PROVIDER') {
      this.providerDetails();
    }
    if (this.loginRole == 'USER') {
      this.userDetails();
    }

    this.user = this.localStorage.getUser().email;
    if (this.user !== undefined) {
      this.logedIn = true;
    }
    if (this.logedIn) {
      this.msgNotify();
    }
  }
  editProviderDetails() {
    this.localStorage.saveKey('backButton', true)
    this.router.navigateByUrl('/provider/step/1').then(() => {
      window.location.reload();
    });
  }

  openModal(event: any) {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      hasBackdrop: false,
      data: {
        modalType: event,
      },
    });
    this.menuOpen();
  }

  menuOpen() {
    var menu = <HTMLElement>document.querySelector('.header_user');
    menu.classList.toggle('active_menu');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');

    this.localStorage.signOut();
    this.router.navigateByUrl('');
    this.logedIn = false;
    this.notiserv.showSuccess(CustomAlertMessage.signOut[0].logoutSuccess);
    setInterval(() => {
      window.location.reload();
    }, 1000);
  }

  userDetails() {
    let id = this.localStorage.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.welcome_name = data.data[0]?.userDetails?.first_name;
        this.welcome_icon = data.data?.[0].userDetails.first_name[0].toUpperCase();
        this.profilePicUser = data.data?.[0].profile_photo;
      },
    });
  }

  providerDetails() {
    let id = this.localStorage.getUser().id;

    this.providerService.getProviderBasicInfo().subscribe({
      next: (data: any) => {
        this.welcome_provider_name = data.data?.first_name;
        this.welcome_icon_provider = data.data?.first_name[0].toUpperCase()
        this.profilePicProvider = data.data.profile_photo;

      },
    });
  }

  // Provider Modal Open Section Start
  openProviderModal(event: any) {
    const dialogRef = this.dialog.open(LoginProviderModalComponent, {
      width: '80vw',
      maxWidth: '750px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: event,
      },
    });
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

}
