import { Component, NgZone, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { stepperSteps } from 'src/app/shared/stepper-steps/stepper';

import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { DaycareBasicInfoComponent } from '../daycare-basic-info/daycare-basic-info.component';
import { DaycareScheduleAvailabilityComponent } from '../daycare-schedule-availability/daycare-schedule-availability.component';
import { DaycarePhotoVideoComponent } from '../daycare-photo-video/daycare-photo-video.component';
import { DaycareChildRequirementsComponent } from '../daycare-child-requirements/daycare-child-requirements.component';
import { DaycareMealsComponent } from '../daycare-meals/daycare-meals.component';
import { DaycareTeacherToAdultComponent } from '../daycare-teacher-to-adult/daycare-teacher-to-adult.component';
import { DaycareTuitionsComponent } from '../daycare-tuitions/daycare-tuitions.component';
import { DaycareAffiliationComponent } from '../daycare-affiliation/daycare-affiliation.component';
import { DaycareAdminSettingComponent } from '../daycare-admin-setting/daycare-admin-setting.component';
import { DaycareAccountTypeComponent } from '../daycare-account-type/daycare-account-type.component';

@Component({
  selector: 'app-daycare-stepper',
  templateUrl: './daycare-stepper.component.html',
  styleUrls: ['./daycare-stepper.component.scss'],
})
export class DaycareStepperComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  private stepper!: MatStepper;
  hideBackBtn: boolean = true;
  @ViewChild(DaycareBasicInfoComponent, { static: true })
  basicInfo!: DaycareBasicInfoComponent;
  @ViewChild(DaycareScheduleAvailabilityComponent, { static: true })
  scheduleAvailable!: DaycareScheduleAvailabilityComponent;
  @ViewChild(DaycarePhotoVideoComponent, { static: true })
  photoVideo!: DaycarePhotoVideoComponent;
  @ViewChild(DaycareChildRequirementsComponent, { static: true })
  childRequiremnet!: DaycareChildRequirementsComponent;
  @ViewChild(DaycareMealsComponent, { static: true })
  mealsSnacks!: DaycareMealsComponent;
  @ViewChild(DaycareTeacherToAdultComponent, { static: true })
  teacherchildratio!: DaycareTeacherToAdultComponent;
  @ViewChild(DaycareTuitionsComponent, { static: true })
  tuition!: DaycareTuitionsComponent;
  @ViewChild(DaycareAffiliationComponent, { static: true })
  affliation!: DaycareAffiliationComponent;
  @ViewChild(DaycareAdminSettingComponent, { static: true })
  adminsettings!: DaycareAdminSettingComponent;
  @ViewChild(DaycareAccountTypeComponent, { static: true })
  accounttypes!: DaycareAccountTypeComponent;
  visible = false;
  stepContinue: number = 1;
  stepOne!: FormGroup;
  stepTwo!: FormGroup;
  stepThree!: FormGroup;
  stepFour!: FormGroup;
  stepFive!: FormGroup;
  stepSix!: FormGroup;
  stepSeven!: FormGroup;
  stepEight!: FormGroup;
  stepNine!: FormGroup;
  stepTen!: FormGroup;
  saveShareBtn: boolean = false;
  stepCurrentCount: number = 1;
  totalStep: number = 10;
  introStepsCount: any = 0;
  subStepsCount: any = 0;
  stepperBackBtn: boolean = false;
  stepperNextBtn: boolean = false;
  public selectedIndex: number = 1;
  public iconColor!: string;
  hideStepperContinue: boolean = true;
  btnText: string = 'Next';
  subscription: Subscription = new Subscription();
  beforeAfterCareGroup: any;
  isUserLoggedIn: boolean = false;
  providerData: any;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private providerService: ProviderService,
    private localStrService: LocalstorageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    let userid = this.localStrService.getUser()?.id;
    // update based upon route params
    this._activatedRoute.params.subscribe((params) => {
      let stepId = +params['stepNumber'];
      this.stepCurrentCount = stepId;
      this.stepContinue = this.stepCurrentCount + 1;
      this.selectedIndex = stepId - 1;
      if (this.selectedIndex == 0 && this.subStepsCount < 2) {
        this.saveShareBtn = false;
      } else {
        this.saveShareBtn = true;
      }
      if (this.selectedIndex > 0) {
        this.providerService.enableSideBar.next(true);
        this.btnText = 'Next';
      } else if (this.subStepsCount < 2) {
        this.btnText = 'Continue';
        if (userid!) {
          this.subStepsCount = 2;
        }
      }
    });
    // if clicked from sidebar
    this.getProviderStepsStatus();
    this.subscription = this.providerService.clickedFromSideBar.subscribe(
      (sideBar: any) => {
        if (sideBar?.fromSideBar) {
          let stepper = stepperSteps.steppers.find(
            (x) => x.stepNumber == sideBar?.stepNumber
          );
          if (stepper?.maxSteps) {
            this.stepperNextBtn = true;
            this.selectedIndex = stepper?.stepNumber;
            this.subStepsCount =
              typeof this.subStepsCount === 'string'
                ? stepper?.maxSteps
                : stepper?.maxSteps.toString();
            this.hideStepperContinue = false;
            this.hideBackBtn = true;
            this.saveShareBtn = true;
          }
        } else if (!sideBar?.fromSideBar) {
          let stepper = stepperSteps.steppers.find(
            (x) => x.stepNumber == sideBar?.stepNumber
          );
          if (stepper?.maxSteps) {
            this.stepperNextBtn = true;
            this.selectedIndex = stepper?.stepNumber;
            this.subStepsCount = 0;
            this.hideStepperContinue = false;
            this.hideBackBtn = true;
            this.saveShareBtn = true;
          }
        }
      }
    );

    // Before push pls uncomment 128 to 135
    if (userid!) {
      // this.selectedIndex = 8;
      // this.subStepsCount = 5;
      if (this.selectedIndex == 0) {
        this.subStepsCount = 1;
        this.subStepsNext(true);
        this.btnText = 'Next';
        this.providerService.enableSideBar.next(true);
      }
    }

    // form intialization
    this.stepOne = this._formBuilder.group({});
    this.stepTwo = this._formBuilder.group({});
    this.stepThree = this._formBuilder.group({});
    this.stepFour = this._formBuilder.group({});
    this.stepFive = this._formBuilder.group({});
    this.stepSix = this._formBuilder.group({});
    this.stepSeven = this._formBuilder.group({});
    this.stepEight = this._formBuilder.group({});
    this.stepNine = this._formBuilder.group({});
    this.stepTen = this._formBuilder.group({});
  }

  ngAfterViewInit() {
    this.makeHeaderActive();
  }

  goBack() {
    this.stepper?.previous();
    let stepper = stepperSteps.steppers.find(
      (x) => x.stepNumber === this.selectedIndex
    );
    if (stepper && stepper.hasOwnProperty('stepNumber')) {
      this.subStepsCount = stepper.maxSteps;
      this.hideStepperContinue = false;
      this.hideBackBtn = true;
      this.saveShareBtn = true;
    }
  }
  showDiv() {
    this.visible = true;
  }
  goForward() {
    this.subStepsCount = 0;
    this.stepper?.next();
    if (this.selectedIndex == 0 && this.subStepsCount < 2) {
      this.saveShareBtn = false;
    } else {
      this.saveShareBtn = true;
    }
    this.updateProviderStepsStatus(this.selectedIndex);
  }
  getProviderStepsStatus() {
    if (this.localStrService.getUser()?.provider_id != undefined) {
      this.providerService
        .getProviderSignupStepsStatus(
          this.localStrService.getUser()?.provider_id
        )
        .subscribe({
          next: (res) => {
            this.providerData = res.data;
          },
          error: (error) => {},
        });
    }
  }

  updateProvider(data: any) {
    this.getProviderStepsStatus();
  }

  updateProviderStepsStatus(currentCompletedStep: any) {
    let property = `step${currentCompletedStep}_completed`;
    let data: any = {};
    data[property] = true;
    this.providerService
      .updateProviderSignupSteps(
        data,
        this.localStrService.getUser()?.provider_id
      )
      .subscribe({
        next: (res) => {
          this.providerData = res.data;
          // this.notificationService.showSuccess(CustomAlertMessage.saveNext[1].message);
        },
        error: (error) => {},
      });
  }

  stepChange(event: any) {
    this.selectedIndex = event.selectedIndex;
    this.stepContinue = this.selectedIndex + 2;
    const url = '/daycare/step/' + (this.selectedIndex + 1);
    if (event && event.previouslySelectedIndex > event.selectedIndex) {
      this.stepperNextBtn = true;
    } else {
      let stepper = stepperSteps.steppers.find(
        (x) => x.stepNumber === this.selectedIndex
      );
      if (stepper && stepper.hasOwnProperty('stepNumber')) {
        if (stepper.maxSteps == this.subStepsCount) {
          this.stepperNextBtn = true;
          this.hideStepperContinue = false;
          // this.hideBackBtn = false
        } else {
          this.stepperNextBtn = false;
          this.hideStepperContinue = true;
          this.hideBackBtn = true;
        }
      }
    }
    this.router.navigate([url]);
    this.makeHeaderActive();
  }

  enableSideBarFull(data: any) {
    if (data && data.count) {
      this.subStepsCount = data.count;
      this.providerService.enableSideBar.next(data.showStepper);
      this.saveShareBtn = true;
    }
  }

  subStepsNext(callfromC = false) {
    console.log("callfromCcallfromC ", callfromC);
    
    if (!callfromC) {
      this.checkValidityBasedUponSteps((status: boolean) => {
        console.log("statusstatusstatus ", status);
        if (status) {
          this.goToNextStep();
        }
      });
    } else {
      this.goToNextStep();
    }
  }

  saveAndClose() {
    let flag = false;
    this.checkValidityBasedUponSteps((status: boolean) => {
      if (status) {
        flag = true;
        if (flag) {
          flag = false;
          this.notificationService.showSuccess(
            CustomAlertMessage.saveNext[0].message
          );
          this.router.navigate(['']);
        }
      }
    });
  }

  goToNextStep() {
    this.subStepsCount = this.subStepsCount + 1;
    if (this.selectedIndex == 0 && this.subStepsCount < 2) {
      this.btnText = 'Continue';
      this.saveShareBtn = false;
    } else if (this.selectedIndex == 0 && this.subStepsCount == 2) {
      this.hideBackBtn = false;
      this.providerService.enableSideBar.next(true);
      this.btnText = 'Next';
    } else {
      this.btnText = 'Next';
      if (this.subStepsCount > 2) {
        this.saveShareBtn = true;
        this.hideBackBtn = true;
      }
      this.providerService.enableSideBar.next(true);
    }

    let stepper = stepperSteps.steppers.find(
      (x) => x.stepNumber === this.selectedIndex
    );
    if (stepper && stepper.hasOwnProperty('stepNumber')) {
      if (this.subStepsCount == stepper?.maxSteps) {
        this.stepperNextBtn = true;
        this.hideBackBtn = true;
        this.hideStepperContinue = false;
      } else {
        this.stepperNextBtn = false;
      }
    }
  }

  checkValidityBasedUponSteps(callback: any) {
    switch (this.selectedIndex) {
      case 0:
        return this.basicInfo.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 1:
        console.log("subStepsCount", this.subStepsCount);
        return this.scheduleAvailable.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 2:
        return this.photoVideo.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 3:
        return this.childRequiremnet.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
        break;
      case 4:
        return this.mealsSnacks.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 5:
        return this.teacherchildratio.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 6:
        return this.tuition.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 7:
        return this.affliation.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 8:
        return this.adminsettings.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );
      case 9:
        return this.accounttypes.checkFormValidity(
          this.subStepsCount,
          (status: any) => {
            callback(status);
          }
        );

      default:
        return callback(true);
    }
    // return callback(true);
  }

  subStepsPrev() {
    this.subStepsCount = this.subStepsCount - 1;
    if (this.selectedIndex == 0 && this.subStepsCount < 2) {
      this.providerService.enableSideBar.next(false);
      this.saveShareBtn = false;
      this.hideStepperContinue = true;
      this.hideBackBtn = true;
    } else if (this.selectedIndex == 0 && this.subStepsCount == 2) {
      this.hideBackBtn = false;
    } else {
      this.hideBackBtn = true;
    }

    let stepper = stepperSteps.steppers.find(
      (x) => x.stepNumber === this.selectedIndex
    );
    if (stepper && stepper.hasOwnProperty('stepNumber')) {
      if (this.subStepsCount != stepper?.maxSteps) {
        this.stepperNextBtn = false;
        this.hideStepperContinue = true;
      }
    }
  }

  moveToStep(step: number) {
    this.subStepsCount = step;
    this.hideBackBtn = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.stepper?.reset();
  }

  moveToNextStep(subStep: number) {
    if (subStep) {
      this.subStepsCount = subStep - 1;
      this.hideStepperContinue = true;
      this.stepperNextBtn = false;
    } else {
      this.subStepsCount += 1;
    }
  }

  moveToBarStep(subStep: any) {
    this.subStepsCount = subStep;
    this.hideStepperContinue = true;
    this.stepperNextBtn = false;
  }

  private makeHeaderActive() {
    let headers: any = document.getElementsByClassName('mat-step-label-active');
    while (headers.length > 0) {
      if (headers.length) {
        headers[0]?.classList?.remove('mat-step-label-active');
      }
    }
    const headerDivs: any = document.getElementsByClassName('mat-step-header');
    for (let h of headerDivs) {
      if (+h.getAttribute('ng-reflect-index') <= this.selectedIndex) {
        const stepLabel = h.getElementsByClassName('mat-step-label');
        if (stepLabel.length) {
          stepLabel[0].classList.add('mat-step-label-active');
        }
      }
    }
  }

  showSideBar() {
    let lefPanel: any = document.getElementsByClassName('sidebarleft')[0];
    lefPanel.style.display = 'block';
  }
}
