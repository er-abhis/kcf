import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-tuition',
  templateUrl: './tuition.component.html',
  styleUrls: ['./tuition.component.scss'],
})
export class TuitionComponent implements OnInit {
  selectedVal = 7;
  update: boolean = false;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }
  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 7) {
      this.stepCount = + value;
      this.getBasicInfo();
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  tutionData: any = {};
  Submitted = false;
  stepCount: number = 0;
  fileLink: string = ''
  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService
  ) { }

  // tutionPdf: any;
  // ChildTutionURL : any;
  // tutionFee : any;

  ngOnInit(): void { }

  getBasicInfo() {
    this.providerService.getProviderBasicInfo().subscribe({
      next: (res) => {
        this.tutionData = res.data.tuitionfees;
        let data = {
          tutionPdf: res.data?.tuitionfees?.pdf_link,
          tutionFee: res.data?.tuitionfees?.tuitionfees,
          ChildTutionURL: res.data?.tuitionfees?.web_link,
          tuitionfees_time: res.data?.tuitionfees?.tuitionfees_time
        }
        if (data?.tutionPdf || data?.tutionFee || data?.ChildTutionURL) {
          this.update = true;
        }
        else {
          this.update = false;
        }
        this.fileLink = res.data?.tuitionfees?.pdf_link;
        this.childTutionGroup.patchValue(data)
      }, error: (error: any) => {
      }
    });
  }

  childTutionGroup = this._formBuilder.group({
    tutionFee: ['', [Validators.pattern(/^[0-9]*$/)]],
    ChildTutionURL: [''],
    tutionPdf: [],
    tuitionfees_time: []
  });

  get s(): { [key: string]: AbstractControl } {
    return this.childTutionGroup.controls;
  }
  pdfData: any;
  handleUpload(fileInput: any) {
    fileInput.click();
  }

  handle(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file && file.name) {
        this.pdfData = file;
      }
    }
  }


  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (!this.childTutionGroup.value.tutionFee
          && !this.childTutionGroup.value.ChildTutionURL
          && !this.childTutionGroup.value.tutionPdf
          && !this.pdfData) {
          this.notificationService.showError(CustomAlertMessage.tuition[0].message);
          return callback(false);
        }
        let dataToSend: any = {
          provider: localStorage.getItem('provider_id'),
        };
        dataToSend.tuitionfees = this.childTutionGroup.value.tutionFee || ''
        dataToSend.web_link = this.childTutionGroup.value.ChildTutionURL || ''
        dataToSend.pdf_link = this.childTutionGroup.value.tutionPdf || ''
        dataToSend.tuitionfees_time = this.childTutionGroup.value.tuitionfees_time || ''
        this.Submitted = true;
        if (this.childTutionGroup.value.tutionFee && !this.childTutionGroup.value.tuitionfees_time) {
          this.notificationService.showError(CustomAlertMessage.tuition[1].message);
          return callback(false);
        }
        if (this.childTutionGroup.invalid) {
          return callback(false);
        }
        if (this.pdfData) {
          return this.providerService.photo(this.pdfData).subscribe({
            next: (data: any) => {
              if (data && data.data && data.code == 200) {
                this.childTutionGroup.controls.tutionPdf.patchValue(data?.data?.upload_file);
                dataToSend.pdf_link = this.childTutionGroup.value.tutionPdf;
                this.providerService.tuitions(dataToSend, this.update).subscribe({
                  next: (data: any) => {
                    const resData: any = data;
                    // this.notificationService.showSuccess(
                    // 	'Update ' + resData.status
                    // );
                    return callback(true);
                  },
                  error: (error: any) => {
                    if (error?.error.data) {
                      if (error?.error.errors?.tuitionfees[0]) {
                        this.notificationService.showError('tuition fees: ' + error?.error.errors?.tuitionfees[0])
                      }
                      if (error?.error.errors?.web_link[0]) {
                        this.notificationService.showError('web link: ' + error?.error.errors?.web_link[0])
                      }
                      if (error?.error.errors?.pdf_link[0]) {
                        this.notificationService.showError('pdf file: ' + error?.error.errors.pdf_link[0])
                      }

                    } else {
                      this.notificationService.showError('Some Error occured');
                    }
                    return callback(false);
                  },
                });
              }
            },
            error: (error: any) => {
              if (error?.error?.errors) {
                this.notificationService.showError(error?.error.errors)
              }
              return callback(false);
            }
          })
        } else {
          return this.providerService.tuitions(dataToSend, this.update).subscribe({
            next: (data: any) => {
              const resData: any = data;
              // this.notificationService.showSuccess(
              // 	'Update ' + resData.status
              // );
              callback(true);
            },
            error: (error: any) => {
              if (error?.error.data) {
                if (error?.error.errors?.tuitionfees[0]) {
                  this.notificationService.showError('tuition fees: ' + error?.error.errors?.tuitionfees[0])
                }
                if (error?.error.errors?.web_link[0]) {
                  this.notificationService.showError('web link: ' + error?.error.errors?.web_link[0])
                }
                if (error?.error.errors?.pdf_link[0]) {
                  this.notificationService.showError('pdf file: ' + error?.error.errors.pdf_link[0])
                }

              } else {
                this.notificationService.showError('Some Error occured');
              }
              callback(false);
            },
          });
        }
      // return callback(false);
      default: return callback(true)
    }
    // return callback(true);
  }
  clearAll() {
    this.childTutionGroup.reset();
    this.fileLink = "";
    this.pdfData = null;
  }
}
