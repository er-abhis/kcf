import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { SignInComponent } from 'src/app/component/sign-in/sign-in.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-login-provider-modal',
  templateUrl: './login-provider-modal.component.html',
  styleUrls: ['./login-provider-modal.component.scss'],
})
export class LoginProviderModalComponent implements OnInit {
  logedIn: boolean = false;

  constructor(
    private dialog: MatDialog,
    private localStorage: LocalstorageService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {}

  closeModal() {
    this.dialog.closeAll();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    this.localStorage.signOut();
  }
  openLoginModal(event: any) {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      hasBackdrop: false,
      data: {
        modalType: event,
        returnUrl: '/preschool/result-single',
      },
    });
  }

  openModal() {
    // this.router.navigate(['/provider/signup']);
    setTimeout(() => {
      this.router.navigateByUrl('provider/signup');
     this. closeModal();
    }, 1000);
    this.logout();
    this.notification.showSuccess(CustomAlertMessage.signOut[0].logoutSuccess);
  }
}
