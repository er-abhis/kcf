import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { confirmPasswordValidator } from "../../utills/custom.validators";
import { passwordValidationRegex } from "../../utills/constant/global.constants";

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent implements OnInit {
  changeUserSubmitted = false;
  showUsername = false;
  type = 1;
  showHidebox = true;
  showPassword = false;
  changePass = false;
  changeUserName: boolean = false;
  userId: number = 0;
  login: boolean = false;
  signup: boolean = false;
  verifyOtp: boolean = false;
  resetPass: boolean = false;
  changeuserPassword: boolean = false;
  checkboxType = {
    individual: false,
    company: false,
  };
  bankDetailForm = this.formBuilder.group({
    name: ['', Validators.required],
    account_number: ['', Validators.required],
    verify_account_number: ['', Validators.required],
    routing_number: ['', Validators.required],
    account_type: ['', Validators.required],
  });
  cardDetailForm = this.formBuilder.group({
    name: ['', Validators.required],
    card_number: ['', Validators.required],
    expiry_month: ['', Validators.required],
    expiry_year: ['', Validators.required],
    cvc: ['', Validators.required],
  });
  cardDetailSubmitted = false;
  bankDetailSubmitted = false;
  data: any;
  msg: any;
  savemsg: any;
  user: any;

  username: any;
  NotificationForm!: FormGroup;
  customAlertMessage = CustomAlertMessage;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notification: NotificationService,
    private localStorage: LocalstorageService,
    private router: Router,
    private dialog: MatDialog,
    private localServ: LocalstorageService
  ) { }

  ngOnInit(): void {
    this.getMessage();

    localStorage.getItem('message');

    this.initmsgForm();

    this.userDetails();
  }
  changeUser = this.formBuilder.group({
    username: ['', Validators.required],
  });


  changePassword = this.formBuilder.group({
    current_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.pattern(passwordValidationRegex)]],
    confirm_password: ['', Validators.required],
  }, {
    validators: confirmPasswordValidator('new_password', 'confirm_password')
  });

  get u(): { [key: string]: AbstractControl } {
    return this.changeUser.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changePassword.controls;
  }
  get c(): { [key: string]: AbstractControl } {
    return this.cardDetailForm.controls;
  }

  get b(): { [key: string]: AbstractControl } {
    return this.bankDetailForm.controls;
  }
  initmsgForm() {

    this.NotificationForm = this.formBuilder.group({
      profile_visible_Provider: this.savemsg?.profile_visible_Provider,
      email_alerts: this.savemsg?.email_alerts,
      email_notifications: this.savemsg?.email_notifications,
      marketing_updates_kcf: this.savemsg?.marketing_updates_kcf,
      marketing_kcf_affiliates: this.savemsg?.marketing_kcf_affiliates,
    });
  }
  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    localStorage.removeItem('userData');
    this.localStorage.signOut();
    this.router.navigateByUrl('/');
  }

  openModel(type: string) {
    this.login = false;
    this.signup = false;
    this.verifyOtp = false;
    this.resetPass = false;
    this.changeuserPassword = false;

    if (type == 'login' || type == 'signin') {
      this.login = true;
    } else if (type == 'signup') {
      this.signup = true;
    } else if (type == 'verifyotp') {
      this.verifyOtp = true;
    } else if (type == 'resetPass') {
      this.resetPass = true;
    } else if (type == 'changepassword') {
      this.changeuserPassword = true;
    }
  }
  checkbox(type: any) {
    if (type == 'individual') {
      this.checkboxType.individual = true;
      this.checkboxType.company = false;
    } else {
      this.checkboxType.individual = false;
      this.checkboxType.company = true;
    }
  }
  closeModal() {
    this.dialog.closeAll();
  }

  showHideUserForm(type: any) {
    this.showHidebox = type == true ? false : true;
    this.showUsername = type;
    this.showPassword = false;
  }

  showHidePasswordForm(type: any) {
    this.showHidebox = type == true ? false : true;
    this.showPassword = type;
    this.showUsername = false;
  }

  userAccSetting() {
    this.changeUserSubmitted = true;
  }

  passwordChanged() {
    this.changePass = true;
    if (
      this.changePassword.get('new_password')?.value !=
      this.changePassword.get('confirm_password')?.value
    ) {
      this.notification.showError(CustomAlertMessage.passwordMismatch[2].message);
      return;
    }
    if (this.changePassword.invalid) {
      return;
    }
    if (this.changePass) {
      this.userService.changeUserPass(this.changePassword.value).subscribe({
        next: (data: any) => {
          const resData: any = data;
          this.notification.showSuccess(CustomAlertMessage.resetPass[0].message);
          this.logout();
          this.openModel('login');
        },
        error: (error: any) => {
          this.notification.showError(CustomAlertMessage.shortPass[2].message);
        },
      });
    }
  }
  submit() {
    if (this.type == 2) {
      this.cardDetailSubmitted = true;
      if (!this.cardDetailForm.valid) {
        return;
      }
    } else {
      this.bankDetailSubmitted = true;
      if (
        !this.bankDetailForm.valid ||
        this.bankDetailForm.value.account_number !=
        this.bankDetailForm.value.verify_account_number
      ) {
        return;
      }
    }
  }
  userDetails() {
    let id = this.localStorage.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.username = data.data[0].username;
      },
    });
  }

  sendMessage() {
    if (
      !this.NotificationForm.value.profile_visible_Provider &&
      !this.NotificationForm.value.email_alerts &&
      !this.NotificationForm.value.email_alerts &&
      !this.NotificationForm.value.email_notifications &&
      !this.NotificationForm.value.marketing_updates_kcf &&
      !this.NotificationForm.value.marketing_kcf_affiliates
    ) {
      this.notification.showError(CustomAlertMessage.Notification[1].message);
      return;
    }
    var dataSend = {
      userdetails: localStorage.getItem('user_id'),
      marketing_kcf_affiliates: this.NotificationForm.value
        .marketing_kcf_affiliates
        ? true
        : false,
      profile_visible_Provider: this.NotificationForm.value
        .profile_visible_Provider
        ? true
        : false,
      email_alerts: this.NotificationForm.value.email_alerts ? true : false,
      email_notifications: this.NotificationForm.value.email_notifications
        ? true
        : false,
      marketing_updates_kcf: this.NotificationForm.value.marketing_updates_kcf
        ? true
        : false,
    };
    this.userService.sendMessage(dataSend).subscribe({
      next: (data) => {
        const resData: any = data;
        this.notification.showSuccess(CustomAlertMessage.Notification[0].message);
        this.getMessage();
      },
      error: (error: any) => {
        this.notification.showError(error.message);
      },
    });
  }

  reloadPage() {
    window.location.reload();
  }
  changeType(type: any) {
    this.type = type;
    this.bankDetailForm.reset();
    this.cardDetailForm.reset();
  }

  getMessage() {
    let id = localStorage.getItem('user_id');
    this.userService.getMessage(id).subscribe({
      next: (data: any) => {

        this.savemsg = data.data.pop();
        this.initmsgForm();

      },
    });
  }

  usernameChanged() {
    this.changePass = true;

    if (this.changeUser.invalid) {
      return;
    }
    if (this.changePass) {
      this.userService.changeUserName(this.changeUser.value).subscribe({
        next: (data) => {
          const resData: any = data;
          this.username = data.data.username;
          this.notification.showSuccess('User name changed');
          this.showHideUserForm(false);
        },
        error: (error: any) => {
          this.notification.showError(error.error.errors.username[0]);
        },
      });
    }
  }
}
