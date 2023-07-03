import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { message } from 'src/app/utills/constant/message.constants';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-daycare-admin-setting',
  templateUrl: './daycare-admin-setting.component.html',
  styleUrls: ['./daycare-admin-setting.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DaycareAdminSettingComponent implements OnInit {
  @Output() public moveToStep = new EventEmitter();
  stepCount: number = 0;
  selectedVal: number = 9;
  notificationPreferences!: FormGroup;
  optionalForm!: FormGroup;
  allowApplyOnline!: FormGroup;
  addMode: boolean = true;
  waitListYesNo: any[] = [
    { key: true, value: 'Yes' },
    { key: false, value: 'No' },
  ];
  waitlist: boolean = false;
  enrollmentDocumentForm!: FormGroup;
  isAdminOpen: boolean = false;

  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 9) {
      this.stepCount = +value;
      this.getRecordsForSteps(value);
    }
  }

  get stepCountNumber(): number {
    return this.stepCount;
  }

  constructor(
    public _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificationService: NotificationService,
    private localStrService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.initNotificationForm();
    this.initApplyUserForm();
    this.initDocumentForm();
    this.initOptionalForm();
  }

  initDocumentForm() {
    this.enrollmentDocumentForm = this._formBuilder.group({
      enrollment_documentation: false,
    });
  }

  initOptionalForm() {
    this.optionalForm = this._formBuilder.group({
      tell_us_about_family: [],
      tell_us_about_child: [],
      any_special_needs: [],
      occupation: [],
      employer_name: [],
      employer_address: [],
      employer_phone: [],
      annual_gross_income: [],
    });
  }

  initApplyUserForm() {
    this.allowApplyOnline = this._formBuilder.group({
      apply_online: false,
      online_template: false,
      own_online_template_url: [''],
    });
  }

  initNotificationForm() {
    this.notificationPreferences = this._formBuilder.group({
      user_messages: false,
      waitlist_notifications: false,
      new_online_applications: false,
      enrollment_requests: false,
      new_enrollment_packages: false,
      monthly_usage_summary: false,
      affiliated_provider_requests: false,
      marketing_from_KCF_affiliates: false,
    });
  }

  checkFormValidity(stepCount: number, callback: any) {
    let providerId = this.localStrService.getProviderId();
    switch (stepCount) {
      case 0:
        if (
          this.notificationPreferences?.controls?.['user_messages'].value ==
            true ||
          this.notificationPreferences?.controls?.['waitlist_notifications']
            .value == true ||
          this.notificationPreferences?.controls?.['new_online_applications']
            .value == true ||
          this.notificationPreferences?.controls?.['enrollment_requests']
            .value == true ||
          this.notificationPreferences?.controls?.['new_enrollment_packages']
            .value == true ||
          this.notificationPreferences?.controls?.['monthly_usage_summary']
            .value == true ||
          this.notificationPreferences?.controls?.[
            'affiliated_provider_requests'
          ].value == true ||
          this.notificationPreferences?.controls?.[
            'marketing_from_KCF_affiliates'
          ].value == true
        ) {
          this.notificationService.showSuccess(
            CustomAlertMessage.Notification[0].message
          );
        } else {
          this.notificationService.showError(
            CustomAlertMessage.Notification[1].message
          );
          return;
        }

        let sendData = this.notificationPreferences.value;
        return this.providerService
          .saveAdminSettings(sendData, !this.addMode)
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              } else {
                callback(false);
              }
            },
            error: (error: any) => {
              this.notificationService.showError(error?.error?.errors?.error);
              console.log(
                'error?.error?.errors?.error',
                error?.error?.errors?.error
              );

              callback(false);
            },
          });
      case 1:
        if (this.isAdminOpen) {
          this.notificationService.showError(message.saveAdmin);
          console.log('message.saveAdmin', message.saveAdmin);

          return callback(false);
        }
        return callback(true);
      case 2:
        return this.providerService
          .saveProviderWebsiteInfo(
            { waitlist_functionality: this.waitlist },
            providerId
          )
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              }
            },
            error: (error: any) => {
              this.notificationService.showError(error?.error?.errors?.error);
              console.log(
                'error?.error?.errors?.error',
                error?.error?.errors?.error
              );

              callback(false);
            },
          });
      case 3:
        let obj = {
          ...this.allowApplyOnline.value,
          ...this.optionalForm.value,
        };
        return this.providerService
          .saveProviderWebsiteInfo(obj, providerId)
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              }
            },
            error: (error: any) => {
              this.notificationService.showError(error?.error?.errors?.error);
              console.log(
                'error?.error?.errors?.error',
                error?.error?.errors?.error
              );

              callback(false);
            },
          });

      case 4:
        return this.providerService
          .saveProviderWebsiteInfo(
            this.enrollmentDocumentForm.value,
            providerId
          )
          .subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                callback(true);
              }
            },
            error: (error: any) => {
              this.notificationService.showError(error?.error?.errors?.error);
              console.log(
                'error?.error?.errors?.error',
                error?.error?.errors?.error
              );
              callback(false);
            },
          });
      default:
        return callback(true);
    }
  }

  selectDeselectAll() {
    const controls = this.notificationPreferences.controls;
    let selectAll = false;
    for (const name in controls) {
      if (!controls[name].value) {
        selectAll = true;
      }
    }
    this.notificationPreferences.patchValue(this.patchedData(selectAll, false));
  }

  patchedData(selectAll: boolean, isData: any) {
    return {
      user_messages: isData ? isData?.user_messages : selectAll,
      waitlist_notifications: isData
        ? isData?.waitlist_notifications
        : selectAll,
      new_online_applications: isData
        ? isData?.new_online_applications
        : selectAll,
      enrollment_requests: isData ? isData?.enrollment_requests : selectAll,
      new_enrollment_packages: isData
        ? isData?.new_enrollment_packages
        : selectAll,
      monthly_usage_summary: isData ? isData?.monthly_usage_summary : selectAll,
      affiliated_provider_requests: isData
        ? isData?.affiliated_provider_requests
        : selectAll,
      marketing_from_KCF_affiliates: isData
        ? isData?.marketing_from_KCF_affiliates
        : selectAll,
    };
  }

  getRecordsForSteps(step: number) {
    switch (step) {
      case 0:
        this.providerService.getAdminNotifications().subscribe({
          next: (data) => {
            if (data?.code && data?.code == 200) {
              if (data?.data?.length) {
                this.addMode = false;
                this.notificationPreferences.patchValue(
                  this.patchedData(true, data?.data[0])
                );
              } else {
                this.addMode = true;
              }
            }
          },
          error: (error: any) => {
            // console.log(error);
          },
        });
        break;
      case 2:
        this.providerService.getProviderBasicInfo().subscribe((data) => {
          this.waitlist = data?.data?.waitlist_functionality;
        });
        break;
      case 3:
        this.providerService.getProviderBasicInfo().subscribe((data) => {
          const dataInfo = data?.data;
          this.allowApplyOnline.patchValue({
            apply_online: dataInfo.apply_online,
            online_template: dataInfo.online_template,
            own_online_template_url: dataInfo.own_online_template_url,
          });
          this.optionalForm.patchValue(dataInfo);
        });
        break;
      case 4:
        this.providerService.getProviderBasicInfo().subscribe((data) => {
          const dataInfo = data?.data;
          this.enrollmentDocumentForm.patchValue({
            enrollment_documentation: dataInfo.enrollment_documentation,
          });
        });
        break;
    }
  }

  moveToNextStep(step: number) {
    this.moveToStep.emit(step);
  }

  isAddAdminOpen(data: any) {
    this.isAdminOpen = data;
  }
}
