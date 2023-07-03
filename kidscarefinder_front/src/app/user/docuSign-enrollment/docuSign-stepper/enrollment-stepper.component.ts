import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, NgZone, OnInit, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { stepperSteps } from 'src/app/shared/stepper-steps/enrollment.stepper';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { DetailsComponent } from '../docuSign-details/details.component';
import { MatDialog } from '@angular/material/dialog';
import { EnrollmentUploadAdditionalDocumentsComponent } from '../docuSign-upload-additional-documents/enrollment-upload-additional-documents.component';

@Component({
  selector: 'app-enrollment-stepper',
  templateUrl: './enrollment-stepper.component.html',
  styleUrls: ['./enrollment-stepper.component.scss']
})
export class EnrollmentStepperComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  private stepper!: MatStepper;
  hideBackBtn: boolean = true;
  visible = false;
  stepContinue: number = 1;
  @ViewChild(DetailsComponent, { static: true })
  details!: DetailsComponent;
  @ViewChild(EnrollmentUploadAdditionalDocumentsComponent, { static: true })
  uploadEnrollmentDoc!: EnrollmentUploadAdditionalDocumentsComponent;
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
  stepCurrentCount: number = 0;
  totalStep: number = 10;
  introStepsCount: any = 0;
  subStepsCount: any = 0;
  stepperBackBtn: boolean = false;
  stepperNextBtn: boolean = true;
  cancelExit: boolean = false;
  saveClose: boolean = false;
  public selectedIndex: number = 0;
  public iconColor!: string;
  hideStepperContinue: boolean = false;
  btnText: string = 'Start enrollment';
  subscription: Subscription = new Subscription();
  beforeAfterCareGroup: any;
  isUserLoggedIn: boolean = false;
  providerData: any;
  user: any;
  url: any;
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private UserService: UserService,
    private _activatedRoute: ActivatedRoute,
    private providerService: ProviderService,
    private localStrService: LocalstorageService,
    private notificationService: NotificationService,
    private userService: UserService,
    public dialog: MatDialog

  ) { }


  ngOnInit(): void {
    let userData = this.localStrService.getUser();

    // if clicked from sidebar
    this.stepCurrentCount = 1;
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
    this.resumeStepper();
  }

  resumeStepper(){
    let enrollmentInfo = this.userService.getEnrolledItem();
    let steps_completed = null;
    if(enrollmentInfo.child && enrollmentInfo.request_status == 'Enrollment Started'){
      for (let i = 1; i <= 7; i++) {
        let property = `docusign_step${i}_completed`;
        if (!enrollmentInfo.child[property]) {
          steps_completed = i;
          break;
        }
      }
      if(steps_completed){
        this.goTostep(steps_completed);
      }
    }
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

  setBtnText(){
    if (this.stepCurrentCount == 2) {
      this.checkStartStatus();
      this.saveClose = true;
      this.btnText = 'Continue to authorized details';

    }
    if (this.stepCurrentCount == 3) {
      this.checkParentStatus();
      this.btnText = 'Continue to medical contacts';

    }
    if (this.stepCurrentCount == 4) {
      this.checkAuthStatus();
      this.btnText = 'Continue to health history';

    }
    if (this.stepCurrentCount == 5) {
      this.checkMedicalStatus();
      this.btnText = 'Validate and Continue';

    }
    if (this.stepCurrentCount == 6) {
      this.healthHistoryStatus();
      this.saveClose = false;
      this.btnText = 'Continue to DocuSign';

    }
    if (this.stepCurrentCount == 7) {
      this.callDocStatus();
      this.saveClose = false;
      this.btnText = 'Continue to Upload documents';

    }
    if (this.stepCurrentCount == 8) {
      this.docusignStatus();
      this.saveClose = false;

      this.btnText = 'Continue to payment';

    }
  }

  goForward() {
    this.subStepsCount = 0;
    this.stepCurrentCount++;
    this.stepper?.next();

    this.setBtnText();
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
          this.notificationService.showSuccess('Updated successfully');
        },
        error: (error) => { },
      });
  }
  checkParentStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step2_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  checkStartStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step1_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  checkAuthStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step3_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  checkMedicalStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step4_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  healthHistoryStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step5_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  callDocStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step6_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }
  docusignStatus() {
    let enrolledData = this.UserService.getEnrolledItem();
    let dataToSend = {
      id: enrolledData.child.id,
      docusign_step7_completed: true
    }
    this.UserService.checkStatus(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }


  stepChange(event: any) {
    this.selectedIndex = event.selectedIndex;
    this.stepContinue = this.selectedIndex + 2;
    const url = '/provider/step/' + (this.selectedIndex + 1);
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

  subStepsNext() {
    if (this.selectedIndex == 7) {
      this.checkValidityBasedUponSteps((status: boolean) => {
        if (status) {
          this.goForward();
        }
      });
    } else {
      this.goForward();
    }
  }

  cancelAndExit(){
    this.dialog.closeAll();
  }

  saveAndClose() {
    this.dialog.closeAll();
    let flag = false;
    this.checkValidityBasedUponSteps((status: boolean) => {
      if (status) {
        flag = true;
        if (flag) {
          flag = false;
        }
      }
    });
  }

  goToNextStep() {
    this.subStepsCount = this.subStepsCount + 1;

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
      case 0: return this.details.checkFormValidity(
        this.subStepsCount,
        (status: any) => {
          callback(status);
        }
      );
      case 7 : return this.uploadEnrollmentDoc.checkFormValidity(
        this.subStepsCount,
        (status: any) => {
          callback(status);
        });

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

  goTostep(step: any){
    let stepper = stepperSteps.steppers.find(
      (x) => x.stepNumber == step
    );
    if (stepper) {
      this.stepperNextBtn = true;
      this.selectedIndex = stepper?.stepNumber;
      this.stepCurrentCount = stepper?.stepNumber;
      this.setBtnText();
      this.stepper.selectedIndex = this.selectedIndex;
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
