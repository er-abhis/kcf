import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { LoginProviderModalComponent } from '../custom-modal/login-provider-modal/login-provider-modal.component';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  logedIn: boolean = false;
  loginRole: any;
  msg: any;
  user: any;
  user_type: any;
  provider_id: any;
  userDetails_id: any;

  constructor(
    private userService: UserService,
    private localServ: LocalstorageService,
    public dialog: MatDialog,
    private notiserv: NotificationService,
    private messengerService: MessengerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginRole = this.localServ.getUser()?.user_type;
    this.user = this.localServ.getUser().email;
    if (this.user !== undefined) {
      this.logedIn = true;
    }
    if (this.logedIn) {
      this.msgNotify();
    }
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
    this.user_type = this.localServ.getUser().user_type;
    this.provider_id = this.localServ.getUser().provider_id;
    this.userDetails_id = this.localServ.getUser().userDetails_id;

    if (this.user_type == 'USER') {
      data.user_id = this.userDetails_id;
    }
    if (this.user_type == 'PROVIDER') {
      data.provider_id = this.provider_id;
    }
    this.messengerService.allrooms(data).subscribe({
      next: (res: any) => {
        this.msg = res.data?.new_messages;
      },
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    this.router.navigateByUrl('/');
    this.localServ.signOut();
    this.notiserv.showSuccess(CustomAlertMessage.signOut[0].logoutSuccess);
    this.logedIn = true;
    //  window.location.reload();
  }
}
