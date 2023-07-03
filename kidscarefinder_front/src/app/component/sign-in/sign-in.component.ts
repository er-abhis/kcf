import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/rest-services/auth.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { TermsUSer } from '../static_pages/custom-modal/terms-signup/terms.component';
import ShortUniqueId from 'short-unique-id';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { UserService } from 'src/app/services/rest-services/user.service';
import {passwordValidationRegex} from "../../utills/constant/global.constants";
import {confirmPasswordValidator} from "../../utills/custom.validators";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  roles: any;
  termsConditions: boolean = false;
  isLoginFailed = false;
  isLoggedIn = false;
  submitted = false;
  signupSubmitted = false;
  login: boolean = false;
  signup: boolean = false;
  verifyOtp: boolean = false;
  isVerifyOTP: boolean = false;
  isFinalStep: boolean = false;
  resetPass: boolean = false;
  changePassword: boolean = false;
  changePassSubmitted: boolean = false;
  createUserJsonData: any;
  showLoader: boolean = false;
  changePass = false;
  provider: any;
  userType: any;
  providerTypeArray: any[] = [];

  latitudedata: any = '';
  longitudedata: any = '';
  showOtpSec = false;
  hidegetOtp = true;
  afterOTP = false;
  user: any = '';

  // filteredProvidersList: any = [];
  providersList: any = [];
  //   { id: 1, value: 'Babysitter' },
  //   { id: 2, value: 'Nanny share' },
  //   { id: 3, value: 'Daycare center' },
  //   { id: 4, value: 'Before/ aftercare' },
  //   { id: 5, value: 'Sports & recreation' },
  //   { id: 6, value: 'Private nanny' },
  //   { id: 7, value: 'In-home daycare' },
  //   { id: 8, value: 'Preschool' },
  //   { id: 9, value: 'Summer camps' },
  //   { id: 10, value: 'Parent & me classes' },
  //   { id: 11, value: 'Music Teachers' },
  //   { id: 12, value: 'Tutor' },
  //   { id: 13, value: 'Special needs programs' },
  //   { id: 14, value: 'Private school (TK-12)' },
  // ];
  // For Google Loaction
  formattedaddress = '';
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };
  otp_Submitted: any;
  customAlertMessage = CustomAlertMessage;

  constructor(
    http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private providerService: ProviderService,
    private UserService: UserService,
    private localStorage: LocalstorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getProviderDetail();
    this.providerTypeArray = this.providersList;
    if (this.data && this.data.email) {
      this.verifyOTP.get('email')?.setValue(this.data.email!);
    }
    this.openModel(this.data.modalType.toLowerCase());
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

  openModel(type: string) {
    this.login = false;
    this.signup = false;
    this.verifyOtp = false;
    this.resetPass = false;
    this.changePassword = false;

    if (type == 'login' || type == 'signin') {
      this.login = true;
    } else if (type == 'signup') {
      this.signup = true;

      setTimeout(() => {
        this.signupForm.get('email')?.setValue('');
        this.signupForm.get('password')?.setValue('');
      }, 1000);
    } else if (type == 'verifyotp') {
      this.verifyOtp = true;
    } else if (type == 'resetPass') {
      this.resetPass = true;
    } else if (type == 'changepassword') {
      this.changePassword = true;
    }
  }

  closeModal() {
    this.dialog.closeAll();
  }

  changeFn(e: any) {
  }
  // For Google Loaction
  public AddressChange(address: any) {
  // ----------------- For future requirement if user want State and City in payload start---------------------------
    // let city = '';
    // let state = '';

    //   for (var i=0; i<address.address_components.length; i++) {
    //     for (var b=0;b<address.address_components[i].types.length;b++) {

    //         if (address.address_components[i].types[b] == "administrative_area_level_1") {
    //             state= address.address_components[i].short_name;
    //             this.signupForm.patchValue({
    //               state: state
    //             })
    //             break;
    //         }
    //         if (address.address_components[i].types[b] == "locality") {
    //           city= address.address_components[i].long_name;
    //           this.signupForm.patchValue({
    //             city: city
    //           })
    //           break;
    //       }
    //     }
    //   }
  // ----------------- For future requirement if user want State and City in payload start---------------------------

    this.formattedaddress = address.formatted_address;
    this.latitudedata = address.geometry.location.lat();
    this.longitudedata = address.geometry.location.lng();
  }

  //------------------------------------------or sign in ------------------------------------------
  emailRegex = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  passwordRegex =
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    password: ['', Validators.required],
  });

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  SignInUser() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (this.submitted) {
      let dataToSend = {
        email: this.loginForm?.value?.email?.toString().toLowerCase(),
        password: this.loginForm?.value?.password,
      };
      this.authService.login(dataToSend).subscribe({
        next: (data) => {
          const resData: any = data;
          this.notification.showSuccess(CustomAlertMessage.Login[0].message);
          this.localStorage.saveToken(resData.tokens.access);
          this.localStorage.saveUser(resData);
          this.isLoginFailed = false;
          localStorage.setItem('userid', data.id);
          this.isLoggedIn = true;
          this.closeModal();
          if (data?.user_type == 'USER') {
            localStorage.setItem('user_id', data?.userDetails_id);
            if (this.data.returnUrl) {
              this.router.navigateByUrl(this.data.returnUrl).then(() => {
                window.location.reload();
              });
            } else this.router.navigateByUrl('/');
          }
          if (data?.user_type == 'PROVIDER') {
            localStorage.setItem('provider_id', data?.provider_id);
            this.getProviderStepsStatus(data?.provider_id);
          } else {
            this.reloadPage();
          }
        },
        error: (error: any) => {
          this.isLoginFailed = true;
          if (error.status == 401) {
            this.notification.showWarning(CustomAlertMessage.Login[2].message);
          }
          // If user blocked by Admin then.....
          if (error.status == 403) {
            this.notification.showError(error?.error?.detail);
          }
          if (error.status == 500) {
            this.notification.showError(error.statusText);
          }
        },
      });
    }
  }
  getProviderDetail() {
    this.UserService.getProvider().subscribe({
      next: (data: any) => {
        this.provider = data;
        this.providersList = this.provider.data;
        this.providerTypeArray = this.provider.data;
      },
      error: (error: any) => { },
    });
  }
  providerSigin() { }
  getProviderStepsStatus(id: any) {
    this.providerService.getProviderSignupStepsStatus(id).subscribe({
      next: (res) => {
        let data = res.data;
        let steps_completed: any = null;
        for (let i = 1; i <= 10; i++) {
          let property = `step${i}_completed`;
          if (!data[property]) {
            steps_completed = i;
            break;
          }
        }
        let providertypeURL = ''

        switch (data.provider_type) {
          case 'DAYCARE_CENTER':
            providertypeURL = 'daycare';
            break;
          case 'PRE_SCHOOL':
            providertypeURL = 'provider';
            break;
        }
        // let providertypeURL = ''
        // if(data.provider_type == 'DAYCARE_CENTER'){
        //   providertypeURL = 'daycare'
        // }if(data.provider_type == 'PRE_SCHOOL'){
        //   providertypeURL = 'provider'
        // }


        if (!data?.unique_provider_id) {
          const uid = new ShortUniqueId({ length: 8 });
          this.providerService
            .updateProviderSignupSteps({ unique_provider_id: uid() }, id)
            .subscribe((res) => {
              if (steps_completed != null)
                this.router
                  .navigateByUrl(`/${providertypeURL}/step/${steps_completed}`)
                  .then(() => {
                    window.location.reload();
                  });
              else if (steps_completed == null) {
                this.router.navigateByUrl(`/`).then(() => {
                  window.location.reload();
                });
              } else
                this.router.navigateByUrl('/').then(() => {
                  window.location.reload();
                });
            });
        } else {
          if (steps_completed != null)
            this.router
              .navigateByUrl(`/${providertypeURL}/step/${steps_completed}`)
              .then(() => {
                window.location.reload();
              });
          else if (steps_completed == null) {
            this.router.navigateByUrl(`/`).then(() => {
              window.location.reload();
            });
          } else
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
        }
      },
      error: (error) => { },
    });
  }
  userSignin() { }
  reloadPage() {
    window.location.reload();
  }

  //------------------------------------------ signup ------------------------------------------
  signupForm = this.formBuilder.group({
    first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
    last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
    address: ['', Validators.required],
    contact: ['', [Validators.required, Validators.minLength(10)]],
    email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    password: ['', [Validators.required, Validators.pattern(passwordValidationRegex)]],
    conPass: ['', Validators.required],
    user_type: ['user', Validators.required],
    provider_type: ['pre_school'],
    latitude: [''],
    longitude: [''],
    interested_provider_type: ['', Validators.required],
    position: [''],
  }, {
    validators: confirmPasswordValidator('password', 'conPass')
  });

  get s(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  submitUserReason(terms: any): void {
    if (this.termsConditions == false) {
      this.termsConditions = terms;
    } else {
      this.termsConditions = false;
    }
  }
  SignUpUser() {
    this.signupSubmitted = true;
    this.showLoader = true;

    if (this.termsConditions == false) {
      this.notification.showError(CustomAlertMessage.termsCondition[1].message);
      this.signupSubmitted = false;
      this.showLoader = false;
      return;
    }
    if (this.formattedaddress != '') {
      this.signupForm.get('latitude')?.setValue(this.latitudedata);
      this.signupForm.get('longitude')?.setValue(this.longitudedata);
      this.signupForm.get('address')?.setValue(this.formattedaddress);
    }
    if (this.signupForm.invalid) {
      this.showLoader = false;
      return;
    }

    if (
      this.signupForm.get('password')?.value !=
      this.signupForm.get('conPass')?.value
    ) {
      this.notification.showError(
        CustomAlertMessage.passwordMismatch[2].message
      );
      this.showLoader = false;
      return;
    }

    var formdata = this.signupForm.value;
    //True if all the fields are filled
    if (this.signupSubmitted) {
      let dataToSend = {
        first_name: this.signupForm?.value?.first_name,
        last_name: this.signupForm?.value?.last_name,
        address: this.signupForm?.value?.address,
        contact: this.signupForm?.value?.contact,
        email: this.signupForm?.value?.email?.toString().toLowerCase(),
        password: this.signupForm?.value?.password,
        conPass: this.signupForm?.value?.conPass,
        user_type: this.signupForm?.value?.user_type,
        provider_type: this.signupForm?.value?.provider_type,
        latitude: this.signupForm?.value?.latitude,
        longitude: this.signupForm?.value?.longitude,
        interested_provider_type: this.signupForm?.value?.interested_provider_type,
        position: this.signupForm?.value?.position,
        // city: this.signupForm?.value?.city,
        // state: this.signupForm?.value?.state,
      };
      this.createUserJsonData = dataToSend;

      this.authService.accountActivateOtp(dataToSend).subscribe({
        next: (data) => {
          this.showLoader = false;
          const resData: any = data;
          if (resData.status == false) {
            this.notification.showError(resData.message);
          } else {
            this.verifyOtp = true;
            this.signup = false;
            this.verifyOTP.get('email')?.setValue(formdata.email!);
            // this.notification.showSuccess(resData.message);
            this.notification.showSuccess("A One time Passcode (OTP) has been sent to "+dataToSend.email+". Please check your email and enter in the OTP to login to your account.");
          }
          // this.verifyOtp = true;
          // this.signup = false;
          // this.verifyOTP.get('email')?.setValue(formdata.email!);
          // this.notification.showSuccess(CustomAlertMessage.signUp[0].message);
        },
        error: (error: any) => {
          this.isLoginFailed = true;
          this.showLoader = false;
          if (error.error?.password) {
            this.notification.showError(
              CustomAlertMessage.shortPass[1].message
            );
          } else if (error.error?.contact) {
            this.notification.showError(
              CustomAlertMessage.shortContact[1].message
            );
          } else if (error.error?.email) {
            this.notification.showError(
              CustomAlertMessage.shortEmail[1].message
            );
          }
        },
      });
    }
  }

  //------------------------------------------ for reset pass------------------------------------------
  reset_Pass = this.formBuilder.group({
    email: ['', Validators.required],
    otp: ['', Validators.required],
  });

  get r(): { [key: string]: AbstractControl } {
    return this.reset_Pass.controls;
  }

  resetPassword() {
    this.otp_Submitted = true;
    if (!this.forgotPass.valid) {
      return;
    }
    if (this.otp_Submitted) {
      this.authService.otp(this.reset_Pass.value).subscribe({
        next: (data) => {
          const resData: any = data;
          this.notification.showSuccess(resData);
          this.openModel('login');
        },
        error: (error: any) => {
          this.isLoginFailed = true;
          this.notification.showError(error);
        },
      });
    }
  }

  //------------------------------------------ For OTP------------------------------------------
  verifyOTP = this.formBuilder.group({
    email: ['', Validators.required],
    otp: ['', [Validators.required]],
  });

  get o(): { [key: string]: AbstractControl } {
    return this.verifyOTP.controls;
  }

  verifyUserOtp() {
    this.otp_Submitted = true;
    if (!this.verifyOTP.valid) {
      return;
    }
    if (this.otp_Submitted) {
      let dataToSend = {
        email: this.verifyOTP?.value?.email?.toString().toLowerCase(),
        otp: this.verifyOTP?.value?.otp,
      }
      this.authService.otp(dataToSend).subscribe({
        next: (data) => {
          const resData: any = data;

          if (resData.status == false) {
            this.notification.showError(resData.message);
          } else {
            // this.notification.showSuccess(resData.message);
            if (this.data && this.data.data) {

              this.createUser(this.data.data);
            } else {
              this.createUser(this.createUserJsonData);
            }
          }

          // if (this.data?.email) {
          //   this.router.navigateByUrl('/');
          // }
          // this.notification.showSuccess(
          //   CustomAlertMessage.verifyByOTP[0].message
          // );
          // this.openModel('login');
        },
        error: (error: any) => {
          this.isLoginFailed = true;
          this.notification.showError(
            CustomAlertMessage.verifyByOTP[1].message
          );
        },
      });
    }
  }

  //------------------------------------------ Forgot Password ------------------------------------------
  forgotPass = this.formBuilder.group({
    email: ['', Validators.required],
    otp: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.pattern(passwordValidationRegex)]],
    newpassword: ['', Validators.required],
  }, {
    validators: confirmPasswordValidator('password', 'newpassword')
  });

  createUser(createUserData: any) {
    this.authService.signup(createUserData).subscribe({
      next: (data) => {
        this.showLoader = false;
        const resData: any = data;
        if (this.data?.email) {
          this.router.navigateByUrl('/');
        }
        this.notification.showSuccess(
          CustomAlertMessage.signUp[0].message
        );
        this.openModel('login');
      },
      error: (error: any) => {
        this.isLoginFailed = true;
        this.showLoader = false;
        if (error.error?.password) {
          this.notification.showError(
            CustomAlertMessage.shortPass[1].message
          );
        } else if (error.error?.contact) {
          this.notification.showError(
            CustomAlertMessage.shortContact[1].message
          );
        } else if (error.error?.email) {
          this.notification.showError(
            CustomAlertMessage.shortEmail[1].message
          );
        }
      },
    });
  }
  ResetGetOtp() {
    if (this.forgotPass.get('email')?.value != '') {
      this.forgotPass.controls['email'].setValue(this.forgotPass.value.email?.toLowerCase())
      this.authService.forgotPass(this.forgotPass.value).subscribe({
        next: (data) => {
          this.showOtpSec = true;
          this.resetPass = true;
          this.hidegetOtp = false;
          const resData: any = data;
          this.notification.showSuccess(resData.message);
        },
        error: (error: any) => {
          this.notification.showError(error.error.message);
        },
      });
    } else {
      this.notification.showError('Enter valid email');
    }
  }

  ResetPasAOtp() {
    const OTP = this.forgotPass.value.otp?.toString().trim();
    if (
      OTP == '' ||
      this.forgotPass.value.otp == null ||
      this.forgotPass.value.otp == undefined
    ) {
      this.notification.showError(CustomAlertMessage.verifyByOTP[2].message);
      return;
    }
    if (this.forgotPass.value.otp.toString().length <= 5) {
      this.notification.showError('OTP is invalid');
      return;
    }
    if (this.forgotPass.value.otp.toString().length > 6) {
      this.notification.showError('OTP is invalid');
      return;
    }
    if (this.isFinalStep) {
      this.afterOtpVerified();
    }
    if (this.isVerifyOTP == false) {
      this.authService.forgotPassOtpVerify(this.forgotPass.value).subscribe({
        next: (data) => {
          const resData: any = data;
          this.afterOtpVerified();
          this.notification.showSuccess(
            CustomAlertMessage.verifyByOTP[0].message
          );
          this.isVerifyOTP = true;
          this.isFinalStep = true;
        },
        error: (error: any) => {
          this.isLoginFailed = true;
          this.isVerifyOTP = false;
          this.isFinalStep = false;
          this.notification.showError(
            CustomAlertMessage.verifyByOTP[1].message
          );
        },
      });
    }
  }
  afterOtpVerified() {
    this.changePass = true;
    this.afterOTP = true;
    this.hidegetOtp = false;
    this.showOtpSec = false;

    if (
      this.forgotPass.get('password')?.value !=
      this.forgotPass.get('newpassword')?.value
    ) {
      this.notification.showWarning(
        CustomAlertMessage.passwordMismatch[2].message
      );
      return;
    }

    if (this.forgotPass.get('password')?.value != '') {
      if (this.changePass) {
        this.authService.resetOTPVerified(this.forgotPass.value).subscribe({
          next: (data) => {
            const resData: any = data;
            this.notification.showSuccess(
              CustomAlertMessage.resetPass[0].message
            );
            this.openModel('login');
          },
          error: (error: any) => {
            this.isLoginFailed = true;
            this.notification.showError(
              CustomAlertMessage.shortPass[1].message
            );
          },
        });
      }
    }
  }

  //------------------------------------------ Terms and Condition Page Open------------------------------------------

  // terms & condition modal open
  openSignupTerms(event: any) {
    const dialogRef = this.dialog.open(TermsUSer, {
      width: '60%',
      panelClass: 'signupTermsPop',
      hasBackdrop: false,
      autoFocus: false,
      data: {
        modalType: event,
      },
    });
    const subscribeDialog =
      dialogRef.componentInstance.onSubmitReason.subscribe((data: string) => {
        if (data == 'accept') {
          this.termsConditions = true;
        } else {
          this.termsConditions = false;
        }
      });
  }

  changePasswordForm = this.formBuilder.group({
    current_password: ['', Validators.required],
    new_password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  });

  changeProviderPassword() {
    this.changePassSubmitted = true;
    this.setFormValidity(this.changePasswordForm);
    if (!this.changePasswordForm.valid) return;
    let userId = this.localStorage?.getUser()?.id;
    this.authService
      .changeProviderPassword(userId, this.changePasswordForm.value)
      .subscribe({
        next: (data) => {
          if (data && data?.Message) {
            this.notification.showSuccess(data?.Message);
            this.logout();
            this.notification.showSuccess(
              CustomAlertMessage.signOut[0].message
            );
            this.openModel('login');
          }
        },
        error: (error: any) => {
          if (error?.error?.new_password) {
            this.notification.showError(error?.error?.new_password);
          }
        },
      });
  }

  get cpControls(): { [key: string]: AbstractControl } {
    return this.changePasswordForm.controls;
  }

  setFormValidity(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    this.localStorage.signOut();
    // window.location.reload();
    this.router.navigateByUrl('/');
  }

  // For search provider
  search(event: any) {
    let searchData = event.target.value;
    this.providerTypeArray = this.providersList.filter((x: any) =>
      x.providercategory?.toUpperCase().match(searchData.toUpperCase())
    );
  }
}
