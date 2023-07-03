import { async } from '@angular/core/testing';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { MatDialog } from '@angular/material/dialog';
import { CustomisableDialogComponent } from '../../../component/customisable-dialog/customisable-dialog.component';
@Component({
  selector: 'app-enrollment-signatures',
  templateUrl: './enrollment-signatures.component.html',
  styleUrls: ['./enrollment-signatures.component.scss']
})
export class EnrollmentSignaturesComponent implements OnInit {
  statusObservable = interval(5000);
  mySubscription!: Subscription;
  docUrl: any;
  pdf_link: any;
  envelope_id: any;
  public selectedVal = 7;
  stepCount: number = 0;
  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;

    if (this.selectedVal == 7) {
      this.embedSignature();

      // this.getUserPreference();
    }
  }
  get selectedCurrentIndex(): number {
    return this.selectedVal;
  }
  @Input()
  set stepCountNumber(value: any) {

    if (this.selectedVal == 7) {

      // this.getUserPreference();
      this.stepCount = + value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  showLoader: boolean = false;
  url: any;
  pdfData: any;
  constructor(
    private formBuilder: FormBuilder,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private router: Router,
    public dialog: MatDialog,
    private UserService: UserService,
  ) {


  }

  async ngOnInit() {

    this.showLoader = true;
  }
  ngOnDestroy() {
    this.destroy();
  }
  destroy() {
    this.mySubscription.unsubscribe()

  }

  signatureStatus() {
    this.UserService.signatureStatus().subscribe({
      next: (data: any) => {
        let res = data.response.status
        if (res == 'completed') {
          this.destroy();
          this.docLink();


        }
      }
    })

  }
  refreshStatus() {
    this.mySubscription = this.statusObservable.subscribe((val) => {
      this.signatureStatus();
    });

  }
  embedSignature() {
    let user_data = this.UserService.getUserData();

    let dataToSend = {
      email: user_data.email,
      full_name: user_data.userDetails.first_name + ' ' + user_data.userDetails.last_name,
      type: 'embedded',
      user_id: user_data.userDetails.id,
    }
    this.UserService.embedSignature(dataToSend).subscribe({
      next: (data) => {
        const resData: any = data;
        this.docUrl = data.docusign_url;
        this.UserService.setDocUrl(this.docUrl);
        this.navigate();
        this.envelope_id = data.envelope_id;
        this.UserService.setEnvelope(this.envelope_id);
        this.refreshStatus();
        this.mySubscription;

      }
    })
  }
  navigate() {
    this.url = this.UserService.getDocUrl();
    window.open(this.url, "_blank");
  }
  docLink() {
    this.UserService.getDocLink().subscribe({
      next: (data: any) => {
        this.pdf_link = data.pdflink;
        this.UserService.setDocuSignPdf(this.pdf_link);
        this.downloadPdf();
        this.showLoader = false;

      }
    })
  }
  downloadPdf() {
    this.pdfData = this.UserService.getDocuSignPdf();
    window.open(this.url, "_blank")
  }


}
