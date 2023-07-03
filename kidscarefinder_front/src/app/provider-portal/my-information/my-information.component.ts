import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderSettingsService } from 'src/app/services/rest-services/provider-settings.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import {passwordValidationRegex} from "../../utills/constant/global.constants";
import {confirmPasswordValidator} from "../../utills/custom.validators";

@Component({
  selector: 'app-my-information',
  templateUrl: './my-information.component.html',
  styleUrls: ['./my-information.component.scss'],
})
export class MyInformationComponent implements OnInit {
  user: any;
  basicInfoForm: any = FormGroup;
  toggle: boolean = true;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  profile_photoForm = this.formBuilder.group({
    profile_photo: [],
  });
  profilePhoto: any;
  changeUserSubmitted = false;
  showUsername = false;
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
  userAccounts = this.formBuilder.group({
    changeUserName: ['', [Validators.required]],
    accountName: ['', [Validators.required]],
  });
  showPassword = false;
  changePass = false;
  changeUserName: boolean = false;
  userId: number = 0;
  login: boolean = false;
  signup: boolean = false;
  verifyOtp: boolean = false;
  resetPass: boolean = false;
  changeuserPassword: boolean = false;
  data: any;
  username: any;
  NotificationForm = this.formBuilder.group({
    user_messages: [false],
    waitlist_notifications: [false],
    new_online_applications: [false],
    enrollment_requests: [false],
    new_enrollment_packages: [false],
    monthly_usage_summary: [false],
    affiliated_provider_requests: [false],
    marketing_from_KCF_affiliates: [false],
  });
  url: any;
  msg = '';
  imageURl = '';
  reader: any;
  latitudedata: any;
  longitudedata: any;
  userSubmitted: boolean = false;
  customAlertMessage = CustomAlertMessage;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private userService: UserService,
    private providerService: ProviderService,
    private router: Router,
    private localStorage: LocalstorageService,
    private providerSettingService: ProviderSettingsService
  ) {}

  ngOnInit(): void {
    this.initUserForm();
    this.getUserById();
    this.getNotification();
  }
  get u(): { [key: string]: AbstractControl } {
    return this.changeUser.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.changePassword.controls;
  }

  passwordChanged() {
    this.changePass = true;
    if (
      this.changePassword.get('new_password')?.value !=
      this.changePassword.get('confirm_password')?.value
    ) {
      this.notification.showError(
        CustomAlertMessage.passwordMismatch[2].message
      );
      return;
    }
    if (this.changePassword.invalid) {
      return;
    }
    if (this.changePass) {
      this.userService.changeUserPass(this.changePassword.value).subscribe({
        next: (data: any) => {
          const resData: any = data;
          this.notification.showSuccess(
            CustomAlertMessage.resetPass[0].message
          );
          this.logout();
          this.openModel('login');
        },
        error: (error: any) => {
          // this.notification.showError(error.message);
          this.notification.showError(CustomAlertMessage.shortPass[2].message);
        },
      });
    }
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

  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    localStorage.removeItem('userData');
    this.localStorage.signOut();
    this.router.navigateByUrl('/');
  }

  onKeyDown(event: KeyboardEvent) {
    var RegExpression = new RegExp(/^[a-zA-Z\s]*$/);
    const input = event.target as HTMLInputElement;
    let trimmed = input.value.replace(/\s+/g, '');
    if (!RegExpression.test(event.key) || event.key == 'Backspace') {
      if (trimmed.length > 12) {
        trimmed = trimmed.substr(0, 12);
      }

      trimmed = trimmed.replace(/-/g, '');

      let numbers = [];
      numbers.push(trimmed.substr(0, 3));
      if (trimmed.substr(3, 3) !== '') numbers.push(trimmed.substr(3, 3));
      if (trimmed.substr(6, 4) != '') numbers.push(trimmed.substr(6, 4));
      input.value = numbers.join('-');
      return true;
    }
    return false;
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
          this.notification.showSuccess(resData.status);
          this.showHideUserForm(false);
        },
        error: (error: any) => {
          this.notification.showError(error.message);
        },
      });
    }
  }

  getUserById() {
    let id = this.localStorage.getUser()?.id;
    this.userService.getUserById(id).subscribe({
      next: (res: any) => {

        this.user = res.data[0];
        this.username = this.user?.username;
        this.url = this.user?.provider.profile_photo;
        this.initUserForm();
      },
      error: (error: any) => {},
    });
  }
  showHidePasswordForm(type: any) {
    this.showPassword = type;
    this.showUsername = false;
  }

  showHideUserForm(type: any) {
    this.showUsername = type;
    this.showPassword = false;
  }

  initUserForm() {
    this.basicInfoForm = this.formBuilder.group({
      first_name: [
        this.user?.provider?.first_name,
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      last_name: [
        this.user?.provider?.last_name,
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      email: [
        this.user?.email,
        [Validators.required, Validators.pattern(this.emailRegex)],
      ],
      contact: [this.user?.contact ? this.user?.contact : '', [Validators.required, Validators.minLength(10)]],
      position: [this.user?.provider.position, Validators.required],
      latitude: [''],
      longitude: [''],
      user_type: [this.user?.user_type],
    });
  }

  onSelectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);

    var mimeType = event.target.files[0].type;
    if (event.target.files[0]) {
      this.profilePhoto = event.target.files[0];
      //upload api cal
      this.uploadPic();
    }
    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }
  }
  delete() {
    this.url = '';
    this.reader = '';
    this.profilePicDelete();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.basicInfoForm.controls;
  }
  uploadPic() {
    this.providerService.photo(this.profilePhoto).subscribe({
      next: (data: any) => {
        const resData: any = data;
        if (resData && resData.data && resData?.data?.upload_file) {
          this.photoUploadUrlUpdate(resData?.data?.upload_file);
        }
      },
      error: (error: any) => {
        if(error?.error?.errors){
          this.notification.showError(error?.error.errors)
          }
      },
    });
  }
  photoUploadUrlUpdate(imageUrl: string) {
    this.url = imageUrl;
    let dataToSend = {
      profile_photo: imageUrl,
      is_photo_uploaded: this.url ? true : false,
    };
    return this.providerService.video(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess(
          CustomAlertMessage.photoUpdate[0].message
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (error: any) => {
      },
    });
  }
  selectDeselect() {
    let obj: any = this.NotificationForm.value;
    Object.keys(obj).forEach((v) => (obj[v] = this.toggle));
    this.NotificationForm.patchValue(obj);
    this.toggle = !this.toggle;
  }
  getNotification() {
    return this.providerSettingService
      .getNotification(this.localStorage.getUser()?.provider_id)
      .subscribe({
        next: (res: any) => {
          this.NotificationForm.patchValue(res.data[0]);
        },
        error: (error: any) => {
        },
      });
  }
  updateNotification() {
    return this.providerSettingService
      .updateNotification(
        this.localStorage.getUser()?.provider_id,
        this.NotificationForm.value
      )
      .subscribe({
        next: (res: any) => {},
        error: (error: any) => {
        },
      });
  }
  profilePicDelete() {
    return this.providerService
      .saveProviderWebsiteInfo(
        { profile_photo: null },
        this.localStorage.getUser()?.provider_id
      )
      .subscribe({
        next: (data: any) => {
          this.profilePhoto = null;
          this.notification.showWarning(
            CustomAlertMessage.photoUpdate[1].message
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error: any) => {
        },
      });
  }
  basicInfoUpdate() {
    let data = {
      contact: this.basicInfoForm.value?.contact
    };

    this.providerSettingService
      .providerInfoUpdate(
        data,
        this.localStorage.getUser()?.id
      )
      .subscribe({
        next: (data: any) => {
          const resData: any = data;
          this.user = resData.data;
          this.updateDetails();
          this.notification.showSuccess(CustomAlertMessage.myInfo[0].message);
        },
        error: (error: any) => {},
      });
  }

  updateDetails() {
    let dataToSend = {
      first_name: this.basicInfoForm?.value?.first_name,
      last_name: this.basicInfoForm?.value?.last_name,
      position: this.basicInfoForm?.value?.position
    };
    let id = this.localStorage.getUser()?.provider_id;
    this.providerSettingService.providerNameUpdate(dataToSend, id).subscribe({
      next: (data: any) => {
        const resData: any = data;
      },
    });
  }

  submitData() {
    this.userSubmitted = true;
    this.updateNotification();
    if (this.basicInfoForm.invalid) {
      return;
    }

    this.basicInfoUpdate();
  }
}
