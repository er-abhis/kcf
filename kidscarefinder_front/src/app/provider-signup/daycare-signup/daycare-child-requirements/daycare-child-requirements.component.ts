import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-daycare-child-requirements',
  templateUrl: './daycare-child-requirements.component.html',
  styleUrls: ['./daycare-child-requirements.component.scss'],
})
export class DaycareChildRequirementsComponent implements OnInit {
  stepCount: number = 0;
  selectedVal = 4;
  yearMonthReqYes: boolean = false;
  attendFacilityYesNo: string[] = ['Yes', 'No'];
  pottyTrainnedYesNo: string[] = ['Yes', 'No'];
  attendFacDetailsYesNo: string[] = ['Yes', 'No'];
  isProviderChildReq: boolean = false;

  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 4) {
      this.stepCount = +value;
      this.getReviewDetails();
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificationService: NotificationService
  ) {}

  stepsChildNeedsDetailsForm = this._formBuilder.group({
    pottyTrainnedDetails: [''],
    attendFacDetails: [''],
    minimumAgeMonth: [''],
    minimumAgeYear: [''],
  });

  ngOnInit(): void {}

  childNeedCareGroup = this._formBuilder.group({
    is_potty_trained: [''],
    is_minimum_age: [''],
    minimum_age_years: [null],
    minimum_age_months: [null],
  });

  attendFacilityChange(event: MatRadioChange, data: any) {
    if (data === 'Yes') this.yearMonthReqYes = true;
    else this.yearMonthReqYes = false;
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (this.childNeedCareGroup.invalid) {
          this.notificationService.showError(
            CustomAlertMessage.childReq[0].message
          );
          return;
        }
        if (
          this.childNeedCareGroup.value.is_minimum_age == 'Yes' &&
          (this.childNeedCareGroup.value.minimum_age_months == null ||
            this.childNeedCareGroup.value.minimum_age_years == null)
        ) {
          this.notificationService.showWarning(
            CustomAlertMessage.childReq[1].message
          );
          return callback(false);
        }
        if (this.childNeedCareGroup.value.is_minimum_age != 'Yes') {
          this.childNeedCareGroup.value.minimum_age_months = null;
          this.childNeedCareGroup.value.minimum_age_years = null;
        }

        return this.providerService
          .daycarecenterchildRequiremnet(this.childNeedCareGroup.value)
          .subscribe({
            next: (data: any) => {
              const resData: any = data;
              callback(true);
            },
            error: (error: any) => {
              this.isProviderChildReq = true;
              if (error?.error.errors.minimum_age_months[0]) {
                this.notificationService.showError(
                  error?.error.errors.minimum_age_months[0]
                );
                console.log('Error', error?.error.errors.minimum_age_months[0]);
              } else {
                this.notificationService.showError('Some Error occured');
              }
              callback(false);
            },
          });
      case 1:
        if (this.childNeedCareGroup.invalid) {
          this.notificationService.showError(
            CustomAlertMessage.childReq[0].message
          );
          return;
        }
        return this.providerService
          .daycarecenterchildRequiremnet(this.childNeedCareGroup.value)
          .subscribe({
            next: (data: any) => {
              const resData: any = data;
              callback(true);
            },
            error: (error: any) => {
              this.isProviderChildReq = true;

              if (error?.error.errors) {
                this.notificationService.showError(error?.error.errors);
              } else {
                this.notificationService.showError('Some Error occured');
              }
              callback(false);
            },
          });
    }
    return callback(true);
  }

  getReviewDetails() {
    this.providerService.childRequiremnets().subscribe({
      next: (data: any) => {
        let mapData = data?.data;
        if (mapData?.is_potty_trained != null) {
          this.stepsChildNeedsDetailsForm.patchValue({
            pottyTrainnedDetails: mapData?.is_potty_trained ? 'Yes' : 'No',
          });
          this.childNeedCareGroup.patchValue({
            is_potty_trained: mapData?.is_potty_trained ? 'Yes' : 'No',
          });
        }
        if (mapData?.is_minimum_age != null) {
          this.stepsChildNeedsDetailsForm.patchValue({
            attendFacDetails: mapData?.is_minimum_age ? 'Yes' : 'No',
          });
          if (mapData?.is_minimum_age) {
            this.stepsChildNeedsDetailsForm.patchValue({
              minimumAgeYear: mapData?.minimum_age_years,
              minimumAgeMonth: mapData?.minimum_age_months,
            });
            this.childNeedCareGroup.patchValue({
              minimum_age_years: mapData?.minimum_age_years,
              minimum_age_months: mapData?.minimum_age_months,
            });
          }
          this.childNeedCareGroup.patchValue({
            is_minimum_age: mapData?.is_minimum_age ? 'Yes' : 'No',
            minimum_age_years: mapData?.minimum_age_years,
            minimum_age_months: mapData?.minimum_age_months,
          });
        }

        if (mapData?.is_minimum_age != null && mapData?.is_minimum_age) {
          this.yearMonthReqYes = true;
        }
      },
      error: (error: any) => {},
    });
  }
}
