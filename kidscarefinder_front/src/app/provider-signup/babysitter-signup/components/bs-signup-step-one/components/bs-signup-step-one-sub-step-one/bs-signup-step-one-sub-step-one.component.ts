import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomAlertMessage } from "../../../../../../utills/constant/customAlertMessage";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { TermsProvider } from "../../../../../../component/static_pages/custom-modal/terms-provider/terms.component";
import { MatDialog } from "@angular/material/dialog";
import { NotificationService } from "../../../../../../utills/notification.service";
import { confirmPasswordValidator } from "../../../../../../utills/custom.validators";
import { nameValidationRegex, passwordValidationRegex } from "../../../../../../utills/constant/global.constants";

@Component({
  selector: 'app-bs-signup-step-one-sub-step-one',
  templateUrl: './bs-signup-step-one-sub-step-one.component.html',
  styleUrls: ['./bs-signup-step-one-sub-step-one.component.scss']
})
export class BsSignupStepOneSubStepOneComponent implements OnInit {

  basicInfoRegisterForm: FormGroup = new FormGroup([]);
  @Output() stepCompleted = new EventEmitter<{}>();
  customAlertMessage = CustomAlertMessage;
  submitted = false;
  termsConditions: any;
  moment = moment;
  maxDob: any = new Date();
  checked: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.basicInfoRegisterForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(nameValidationRegex)]],
      lastName: ['', [Validators.required, Validators.pattern(nameValidationRegex)]],
      dob: '',
      address: '',
      email: '',
      contact: '',
      password: ['', [Validators.required, Validators.pattern(passwordValidationRegex)]],
      confirmPassword: '',
      isTAndCAccepted: ['', [Validators.requiredTrue]]
    }, {
      validators: confirmPasswordValidator('password', 'confirmPassword')
    });

    this.basicInfoRegisterForm.get('isTAndCAccepted')?.valueChanges.subscribe(async e => {
      if (e) {
        const isAccepted = await this.openProviderTerms();
        if (isAccepted) {
          return
        } else {
          this.basicInfoRegisterForm.get('isTAndCAccepted')?.setValue(false);
        }
      }
    })
  }

  get fg(): { [key: string]: AbstractControl } {
    return this.basicInfoRegisterForm.controls;
  }

  openProviderTerms() {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(TermsProvider, {
        width: '60vw',
        maxWidth: '600px',
        maxHeight: '800px',
        panelClass: 'CustomModal',
        hasBackdrop: false,
        autoFocus: false,
        data: {
          modalType: event
        }
      });
      dialogRef.componentInstance.onSubmitReason.subscribe((data) => {
        resolve(data === 'accept');
      });
    });
  }

  addressChange($event: any) {

  }

  submit() {
    this.submitted = true;
    if (this.basicInfoRegisterForm.invalid) {
      this.notificationService.showError('Please clear the form errors');
      // return
    }
    const values = this.basicInfoRegisterForm.value;
    delete values.confirmPassword;
    delete values.isTAndCAccepted;
    this.stepCompleted.emit(values)
  }
}
