import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  FormArray,
} from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { MatDialog } from '@angular/material/dialog';
import { SignInComponent } from 'src/app/component/sign-in/sign-in.component';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { TermsProvider } from 'src/app/component/static_pages/custom-modal/terms-provider/terms.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { AuthService } from 'src/app/services/rest-services/auth.service';
import { passwordValidationRegex } from 'src/app/utills/constant/global.constants';
import { confirmPasswordValidator } from "src/app/utills/custom.validators";

@Component({
  selector: 'provider-step-one-component',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
})
export class BasicInformationComponent implements OnInit {
  @Output() public moveToStep = new EventEmitter();
  @ViewChild('modalTemp', { static: true }) modelTemp!: TemplateRef<any>;
  public selectedVal = 1;
  termsConditions: boolean = false;
  public submitted: boolean = false;
  public locationSubmitted: boolean = false;
  public licenceSubmitted: boolean = false;
  public EINsubmitted: boolean = false;
  public webSubmitted: boolean = false;
  public hasWebsite: boolean = false;
  public ageGroupSubmitted: boolean = false;
  public description: string = '';
  variable: boolean[] = [];
  isGroupAgeGroupEdit: boolean = false;
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };

  @Output() public sideBarEnable = new EventEmitter();
  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedCurrentIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 1) {
      this.stepCount = +value;
      this.getRecordForSteps(Number(value));
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }

  stepCount: number = 0;
  maxStepCount: number = 9;
  LicenceProOptions: string = 'Yes';
  checked: boolean = true;
  accountBasicInfo!: FormGroup;
  createUserJsonData: any;
  websiteVals: string[] = ['Yes', 'No'];
  BasicLicensedVals: string[] = ['Yes', 'No'];
  StepDetailPhoto: string[] = ['Yes', 'No'];
  preSchoolGroup!: FormGroup;
  licensedGroup!: FormGroup;
  basicInfoLicensedGroup!: FormGroup;
  licenseInfoGroup!: FormGroup;
  licenseWebGroup!: FormGroup;
  providerId: number = 0;
  categoryAgeGroups: any = [];
  selectedAgeGroups: any = [];
  groupCategoryForm = this._formBuilder.group({
    checkArray: this._formBuilder.array([], [Validators.required]),
  });

  userData: any;
  showLoader: boolean = false;

  mainSteppeGroup = this._formBuilder.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    phone: [''],
    provider_type: [''],
    organization_name: [''],
    description: [''],
    website_link: [''],
    is_license: [''],
    ein: [null],
    license_no: [null],
    issuing_agency: [''],
    license_type: [''],
    cds_code: [''],
    checkArray: [],
    address: [''],
  });
  customAlertMessage = CustomAlertMessage;

  constructor(
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private storageService: LocalstorageService,
    private providerService: ProviderService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userData = this.storageService.getUser();
    this.initBasicForm();
    this.initPreSchoolForm();
    this.initLicenseForm();
    this.initLicenseInfoForm();
    this.initLicenseGroupForm();
  }

  initGroupCategoryForm() {
    this.groupCategoryForm = this._formBuilder.group({
      checkArray: this._formBuilder.array([], [Validators.required]),
    });
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
  initLicenseGroupForm() {
    this.licenseWebGroup = this._formBuilder.group({
      website_link: ['', [ Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+(\/[^\s]*)?$/)]],
      is_website: ['', Validators.required],
    });
  }

  initPreSchoolForm() {
    this.preSchoolGroup = this._formBuilder.group({
      organization_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z /s]+$/)],
      ],
      street_address: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      latitude: [''],
      longitude: [''],
    });
  }

  initLicenseForm() {
    this.basicInfoLicensedGroup = this._formBuilder.group({
      licensedInfo: ['', Validators.required],
    });
  }

  initBasicForm() {
    this.accountBasicInfo = this._formBuilder.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)],
      ],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      position: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/s),
        ],
      ],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.pattern(passwordValidationRegex)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: confirmPasswordValidator('password', 'confirmPassword')
    });
  }

  initLicenseInfoForm() {
    this.licenseInfoGroup = this._formBuilder.group({
      license_id: [],
      ein: ['', [Validators.pattern('[- 0-9]+')]],
      license_no: ['', [Validators.pattern('^[0-9]*$')]],
      issuing_agency: [''],
      license_type: [''],
      cds_code: ['', [Validators.pattern('^[0-9]*$')]],
    });
  }

  // formControls for forms
  get lMainControls(): {
    [key: string]: AbstractControl;
  } {
    return this.basicInfoLicensedGroup.controls;
  }

  get accControls(): {
    [key: string]: AbstractControl;
  } {
    return this.accountBasicInfo.controls;
  }

  get lControls(): {
    [key: string]: AbstractControl;
  } {
    return this.preSchoolGroup.controls;
  }

  get licenceControls(): {
    [key: string]: AbstractControl;
  } {

    return this.licenseInfoGroup.controls;
  }

  get webControls(): {
    [key: string]: AbstractControl;
  } {
    return this.licenseWebGroup.controls;
  }

  // check validity of form on next click
  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 1:
        this.submitted = true;
        this.setFormValidity(this.accountBasicInfo);
        if (!this.accountBasicInfo.valid) {
          // this.notificationService.showError('Error');
          return callback(false);
        }
        if (!this.termsConditions) {
          this.notificationService.showError(
            CustomAlertMessage.termsCondition[1].message
          );
          return callback(false);
        }
        if (
          this.accountBasicInfo?.value?.password !==
          this.accountBasicInfo?.value?.confirmPassword
        ) {
          this.notificationService.showError(
            CustomAlertMessage.passwordMismatch[2].message
          );
          return callback(false);
        }
        let provideData = {
          user_type: 'provider',
          provider_type: 'pre_school',
          address: null,
          latitude: null,
          longitude: null,
        };
        this.accountBasicInfo.patchValue({
          email: this.accountBasicInfo?.value?.email.toString().toLowerCase()
        })
        let dataToSend = {
          ...this.accountBasicInfo.value,
          ...provideData,
        };
        // dataToSend.contact = dataToSend.contact.replaceAll('-', '');
        this.createUserJsonData = dataToSend;
        this.showLoader = true;
        return this.authService.accountActivateOtp(dataToSend).subscribe({
          next: (data: any) => {
            this.showLoader = false;
            const resData: any = data;
            if (resData.status == false) {
              callback(false);
              this.notificationService.showError(resData.message);
            } else {
              // this.notificationService.showSuccess(resData.message);
              this.notificationService.showSuccess("A One time Passcode (OTP) has been sent to " + dataToSend.email + ". Please check your email and enter in the OTP to login to your account.");
              this.openModal();
            }
          },
          error: (error: any) => {
            this.showLoader = false;
            if (error?.error?.email) {
              this.notificationService.showError(
                CustomAlertMessage.signupStepOne[0].message
              );
            } else if (error?.error?.password) {
              this.notificationService.showError(
                CustomAlertMessage.signupStepOne[1].message
              );
            } else if (error?.error?.contact) {
              this.notificationService.showError(
                CustomAlertMessage.signupStepOne[2].message
              );
            }
            callback(false);
          },
        });
        // return this.providerService.providerSignUp(dataToSend).subscribe({
        //   next: (data) => {
        //     this.showLoader = false;
        //     if (data?.code && data?.code == 200) {
        //       this.notificationService.showInfo(data.data.message);
        //       this.openModal();
        //     } else {
        //       callback(false);
        //     }
        //   },
        //   error: (error: any) => {
        //     this.showLoader = false;
        //     if (error?.error?.email) {
        //       this.notificationService.showError(
        //         CustomAlertMessage.signupStepOne[0].message
        //       );
        //     } else if (error?.error?.password) {
        //       this.notificationService.showError(
        //         CustomAlertMessage.signupStepOne[1].message
        //       );
        //     } else if (error?.error?.contact) {
        //       this.notificationService.showError(
        //         CustomAlertMessage.signupStepOne[2].message
        //       );
        //     }
        //     callback(false);
        //   },
        // });
        break;
      case 2:
        this.locationSubmitted = true;
        this.setFormValidity(this.preSchoolGroup);
        if (!this.preSchoolGroup.valid) return callback(false);

        let preSchoolData = {
          ...this.preSchoolGroup.value,
        };
        this.callBasicUpdateAPI({
          organization_name: this.preSchoolGroup.value.organization_name,
        });
        this.showLoader = true;
        return this.providerService
          .providerSaveAddress(preSchoolData, this.userData?.address_id?.id)
          .subscribe({
            next: (data) => {
              this.showLoader = false;
              if (data?.code && data?.code == 200) {
                this.providerService
                  .getProviderAddressDetails()
                  .subscribe((data: any) => {

                    if (data && data?.data && data?.code == 200) {
                      let providerUrl = `${window.origin.split('//')[1]}/preschool/${data?.data[0]?.state?.replaceAll(' ', '')}/${data?.data[0]?.city?.replaceAll(' ', '')}/${this.preSchoolGroup.value.organization_name?.replaceAll(' ', '')}/${this.providerId}`
                      this.providerService.updateProviderSignupSteps({ "affiliated_provider_url": providerUrl }, this.providerId)
                        .subscribe((res) => {
                          this.providerService.sideBarChange.next(true);
                          callback(true);
                        })
                      this.providerService.sideBarChange.next(true);
                    }
                  });
              } else {
                callback(false);
              }
            },
            error: (error: any) => {
              this.showLoader = false;
              callback(false);
            },
          });
        break;
      case 3:
        this.licenceSubmitted = true;
        this.setFormValidity(this.basicInfoLicensedGroup);
        if (!this.basicInfoLicensedGroup.valid) return callback(false);

        return callback(true);
      case 4:
        this.EINsubmitted = true;
        this.setFormValidity(this.licenseInfoGroup);
        if (!this.licenseInfoGroup.valid) return;

        let licenseData = {
          ...this.licenseInfoGroup.value,
          ...{
            provider: this.providerId,
          },
        };
        if (this.licenseInfoGroup.value?.cds_code == null) {
          this.notificationService.showError(
            CustomAlertMessage.licenceDetail[4].message
          );
          callback(false);
          return
        }

        let licenseId = null;
        if (this.licenseInfoGroup?.value?.license_id?.id == undefined) {
          licenseId = this.licenseInfoGroup?.value?.license_id
        } else {
          licenseId = this.licenseInfoGroup?.value?.license_id?.id
        }
        return this.providerService
          .SaveProviderLicenseInfo(licenseData, licenseId)
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                this.saveLicenseInfo();
                callback(true);
              } else {
                callback(false);
              }
            },
            error: (error: any) => {
              if (error?.error?.errors?.ein) {
                this.notificationService.showError(
                  CustomAlertMessage.licenceDetail[0].message
                );
              } else if (error?.error?.errors?.license_no) {
                this.notificationService.showError(
                  CustomAlertMessage.licenceDetail[1].message
                );
              } else if (error?.error?.errors?.issuing_agency) {
                this.notificationService.showError(
                  CustomAlertMessage.licenceDetail[3].message
                );
              } else if (error?.error?.errors?.license_type) {
                this.notificationService.showError(
                  CustomAlertMessage.licenceDetail[2].message
                );
              } else if (error?.error?.errors?.cds_code) {
                this.notificationService.showError(
                  CustomAlertMessage.licenceDetail[4].message
                );

              }
              callback(false);
            },
          });
      case 5:
        this.webSubmitted = true;
        this.setFormValidity(this.licenseWebGroup);
        if (!this.licenseWebGroup.valid) return callback(false);

        let sendData: any = {
          is_website: false,
        };
        if (this.licenseWebGroup?.value?.is_website == 'Yes') {
          sendData.is_website = true;
          sendData = {
            ...sendData,
            website_link: this.licenseWebGroup?.value?.website_link,
            is_license: true,
          };
        }
        return this.providerService
          .saveProviderWebsiteInfo(sendData, this.providerId)
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              } else {
                callback(false);
              }
            },
            error: (error: any) => {
              callback(false);
            },
          });
      case 6:
        this.ageGroupSubmitted = true;
        this.setFormValidity(this.groupCategoryForm);
        if (!this.groupCategoryForm.valid) return callback(false);

        let groupCategoryData = this.groupCategoryForm?.value?.checkArray;
        let anySelected: boolean = false;
        groupCategoryData?.forEach((item: any) => {
          if (item?.is_present) {
            anySelected = true;
          }
        });
        if (!anySelected) {
          this.notificationService.showWarning('Please select atleast one');
          return callback(false);
        }
        return this.providerService
          .saveProviderAgeGroup(this.isGroupAgeGroupEdit, groupCategoryData)
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              } else {
                callback(false);
              }
            },
            error: (error: any) => {
              if (error?.error?.errors[0]?.non_field_errors) {
                this.notificationService.showError(
                  error?.error?.errors[0]?.non_field_errors
                );
              }
              callback(false);
            },
          });
        break;
      case 7:
        let desc = {
          description: this.description,
        };
        if (this.description) {
          return this.providerService
            .saveProviderWebsiteInfo(desc, this.providerId)
            .subscribe({
              next: (data) => {
                if (data?.code && data?.code == 200) {
                  callback(true);
                } else {
                  callback(false);
                }
              },
              error: (error: any) => {
                if (error?.error?.errors) {
                  this.notificationService.showError(error?.error?.errors);
                }
                callback(false);
              },
            });
        } else {
          return callback(true);
        }
      case 8:
        return callback(true);
      default:
        return callback(true);
    }
  }

  // set all controls touched
  setFormValidity(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // For Google Loaction
  public AddressChange(address: any) {




    this.preSchoolGroup.patchValue({
      street_address: address.formatted_address,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  openModal() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      data: {
        modalType: 'verifyOtp',
        email: this.accountBasicInfo?.value?.email,
        data: this.createUserJsonData,
      },
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(this.modelTemp, {
      width: '80vw',
      maxWidth: '500px',
      panelClass: 'modalLicense',
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
      this.basicInfoLicensedGroup?.get('licensedInfo')?.setValue('Yes');
    });
  }

  changeToYes() {
    this.basicInfoLicensedGroup?.get('licensedInfo')?.setValue('Yes');
    this.moveToStep.emit(4);
  }

  changeProvider() {
    this.router.navigate(['/provider/signup']);
  }

  changeLicenseOption(data: any) {
    if (data && data?.value && data.value == 'Yes') {
      this.callBasicUpdateAPI({ is_license: true });
      this.moveToStep.emit(4);
    } else {
      this.openDialog();
    }
  }

  hasWebsiteUrl(data: any) {
    if (data && data?.value && data.value == 'Yes') {
      this.licenseWebGroup.controls['website_link'].setValidators([
        Validators.required,
        Validators.pattern(
          /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
        ),
      ]);
      this.hasWebsite = true;
      this.webSubmitted = false;
    } else {
      this.hasWebsite = false;
      this.licenseWebGroup.controls['website_link'].clearValidators();
    }
    this.licenseWebGroup.controls['website_link'].updateValueAndValidity();
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.groupCategoryForm.get(
      'checkArray'
    ) as FormArray;
    let index = checkArray?.value?.findIndex(
      (x: any) => x.agegroupcategory == e?.source?.value
    );
    if (index > -1) {
      checkArray.value[index].is_present = e.checked;
    }
  }

  // get user basic information
  getBasicInfo(providerId: number) {
    // whole form api
    if (providerId) {
      this.providerService.getProviderBasicInfo().subscribe({
        next: (data) => {
          if (data?.code && data?.code == 200) {
            if (data && data?.data) {
              let dataToPopulate = data?.data;
              this.mainSteppeGroup.patchValue({
                first_name: dataToPopulate?.first_name,
                last_name: dataToPopulate?.last_name,
                is_license: dataToPopulate?.is_license ? 'Yes' : 'No',
                organization_name: dataToPopulate.organization_name,
                description: dataToPopulate.description,
                provider_type:
                  dataToPopulate.provider_type == 'PRE_SCHOOL'
                    ? 'Preschool'
                    : dataToPopulate.provider_type,
                website_link: dataToPopulate.website_link,
              });
              if (dataToPopulate?.license) {
                this.providerService
                  .getLicenseInfo(dataToPopulate?.license?.id)
                  .subscribe({
                    next: (data) => {
                      if (data && data?.data?.length) {
                        let licenseData = data?.data[0];
                        this.mainSteppeGroup.patchValue({
                          ein: licenseData?.ein,
                          license_no: licenseData?.license_no,
                          issuing_agency: licenseData?.issuing_agency,
                          license_type: licenseData?.license_type,
                          cds_code: licenseData?.cds_code,
                        });
                      }
                    },
                    error: (error: any) => {
                    },
                  });
              }
            }
          }
        },
        error: (error: any) => {
        },
      });
      // age groups api
      this.getAgeGroups();
    }

    if (this.userData) {
      this.providerService
        .getProviderAddressDetails()
        .subscribe((data: any) => {

          if (data && data?.data && data?.code == 200) {
            this.mainSteppeGroup.patchValue({
              address: data?.data[0]?.street_address,
            });
          }
        });

      this.mainSteppeGroup.patchValue({
        email: this.userData?.email,
        phone: this.userData?.contact,
      });
    }
  }

  changePassword() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      data: {
        modalType: 'changePassword',
      },
    });
  }

  callBasicUpdateAPI(data: any) {
    this.providerService
      .saveProviderWebsiteInfo(data, this.providerId)
      .subscribe((x) => {
      });
  }

  // get data for stepper
  getRecordForSteps(stepNumber: number) {
    this.userData = this.storageService.getUser();
    this.providerId = this.userData?.provider_id;
    switch (stepNumber) {
      case 2:
        if (this.userData?.address_id?.id) {
          this.providerService
            .getProviderAddressDetails()
            .subscribe((data: any) => {

              if (data && data?.data && data?.code == 200) {
                this.preSchoolGroup.patchValue({
                  street_address: data?.data[0]?.street_address,
                  latitude: data?.data[0]?.latitude,
                  longitude: data?.data[0]?.longitude,
                });
              }
            });
        }
        this.getBasicInfoRecords();
        break;
      case 4:

        if (this.licenseInfoGroup?.value?.license_id?.id == undefined) {
          // let licenseId = this.licenseInfoGroup?.value?.license_id;
          this.getLicenseInfo(this.licenseInfoGroup?.value?.license_id);
        } else {
          this.getLicenseInfo(this.licenseInfoGroup?.value?.license_id?.id);
        }

        break;
      case 5:
        let webSite = this.licenseWebGroup?.value?.is_website;
        if (webSite == 'Yes') {
          this.hasWebsite = true;
        }
        break;
      case 6:
        this.getAgeGroups(true);
        break;
      case 7:
        this.getBasicInfoRecords();
        break;
      case 8:
        this.getBasicInfo(this.storageService.getUser()?.provider_id);
        break;
    }
  }

  getBasicInfoRecords() {
    this.providerService.getProviderBasicInfo().subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200 && data?.data) {
          this.preSchoolGroup.patchValue({
            organization_name: data?.data?.organization_name,
          });
          if (data?.data?.is_license != null)
            this.basicInfoLicensedGroup.patchValue({
              licensedInfo: data?.data?.is_license ? 'Yes' : 'No',
            });
          this.licenseInfoGroup.patchValue({
            license_id: data?.data?.license?.id,
          });
          if (data?.data?.is_website != null)
            this.licenseWebGroup.patchValue({
              website_link:
                data?.data?.website_link == 'False'
                  ? ''
                  : data?.data?.website_link,
              is_website: data?.data?.is_website ? 'Yes' : 'No',
            });
          this.description = data?.data?.description;
        }
      },
      error: (error: any) => {
      },
    });
  }

  getLicenseInfo(licenseId: number) {
    this.providerService.getLicenseInfo(licenseId).subscribe({
      next: (data: any) => {
        if (data?.code && data?.code == 200 && data?.data) {
          this.licenseInfoGroup.patchValue({
            ein: data?.data[0]?.ein,
            license_no: data?.data[0]?.license_no,
            issuing_agency: data?.data[0]?.issuing_agency,
            license_type: data?.data[0]?.license_type,
            cds_code: data?.data[0]?.cds_code,
          });
        }
      },
      error: (error: any) => {
      },
    });
  }

  getAgeGroups(fromSixth = false) {
    this.isGroupAgeGroupEdit = false;
    const checkArray: FormArray = this.groupCategoryForm.get(
      'checkArray'
    ) as FormArray;
    this.providerService.getProviderAgeGroups().subscribe({
      next: (data) => {
        if (data && data?.data?.length) {
          this.categoryAgeGroups = data?.data;

          if (fromSixth) {
            this.isGroupAgeGroupEdit = true;
          } else {
            let newData: any = [];
            data.data?.forEach((record: any) => {
              newData.push({
                id: record.id,
                agegroupcategory: record.agegroupcategory.id,
                provider: this.providerId,
                is_present: record.is_present ? record.is_present : false,
              });
            });
            this.mainSteppeGroup.get('checkArray')?.setValue(data?.data);
          }
          checkArray.clear();
          this.categoryAgeGroups.forEach((group: any) => {
            checkArray.push(
              new FormControl({
                id: group.id,
                provider: this.providerId,
                agegroupcategory: group.agegroupcategory.id,
                is_present: group.is_present,
              })
            );
          });
        }
      },
      error: (error: any) => {
        if (error.status == 400) {
          this.getAllAgeGroups();
        }
      },
    });
  }

  getAllAgeGroups() {
    const checkArray: FormArray = this.groupCategoryForm.get(
      'checkArray'
    ) as FormArray;
    this.providerService.getProviderAgeGroup().subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          this.categoryAgeGroups = [];
          checkArray.clear();
          this.categoryAgeGroups = data?.data.map((data: any) => ({
            ...data,
            is_present: false,
            agegroupcategory: {
              agegroupcategory: data.agegroupcategory,
              id: data.id,
            },
          }));
          this.categoryAgeGroups.forEach((group: any) => {
            checkArray.push(
              new FormControl({
                provider: this.providerId,
                agegroupcategory: group.id,
                is_present: group.is_present,
              })
            );
          });
          this.mainSteppeGroup
            .get('checkArray')
            ?.setValue(this.categoryAgeGroups);
        }
      },
      error: (error: any) => {
      },
    });
  }

  checkDataArray(id: number) {
    let returnVal = this.selectedAgeGroups?.indexOf(id) === -1 ? true : false;
    return returnVal;
  }

  saveLicenseInfo() {
    this.providerService.getProviderBasicInfo().subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200 && data?.data) {
          this.licenseInfoGroup.patchValue({
            license_id: data?.data?.license,
          });
        }
      },
      error: (error: any) => {
      },
    });
  }
  // Terms and condition Dialog
  // Provider Modal Open Section Start
  openProviderTerms(event: any) {
    const dialogRef = this.dialog.open(TermsProvider, {
      width: '60vw',
      maxWidth: '600px',
      maxHeight: '800px',
      panelClass: 'CustomModal',
      hasBackdrop: false,
      autoFocus: false,
      data: {
        modalType: event,
      },
    });
    const subscribeDialog =
      dialogRef.componentInstance.onSubmitReason.subscribe((data) => {
        if (data == 'accept') {
          this.termsConditions = true;
        } else {
          this.termsConditions = false;
        }
      });
  }
}
