import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-enrollment-upload-additional-documents',
  templateUrl: './enrollment-upload-additional-documents.component.html',
  styleUrls: ['./enrollment-upload-additional-documents.component.scss']
})
export class EnrollmentUploadAdditionalDocumentsComponent implements OnInit {
  public selectedVal = 8;
  stepCount: number = 0;
  filteredProvidersList: any = [];
  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;

    if (this.selectedVal == 8) {
      // this.getUserPreference();
    }
  }
  get selectedCurrentIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 8) {
      // this.getUserPreference();
      this.stepCount = + value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  pdfData: File[] = [];
  fileArray: any = []
  fileLink: string = '';
  uploading: boolean = false;
  holidayPhoto: any;
  constructor(
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  removeFile(i:any){
    this.fileArray.splice(i,1)
  }
  fileTypeSelect(i:any,value: any){
    this.fileArray[i].type = value;
  }

    // check validity of form on next click
    checkFormValidity(stepCount: number, callback: any) {
      switch (stepCount) {
        default:     let formData = new FormData()
        let error: string ='';
        if(!this.fileArray.length){
            this.notificationService.showError("Please select file");
            return callback(false);
        }
        this.fileArray.forEach((el: any, i: any) => {
          formData.append(`upload_file[${i}].file`, el.file);
          if(!el.type){
            error= 'Please select file type';
          }
          formData.append(`upload_file[${i}].type`, el.type);
        });
        if(error){
          this.notificationService.showError(error);
          return callback(false);
        }
        else{
          this.userService.uploadDocuments(formData).subscribe(
            {
              next: (data:any)=>{
                return callback(true)

              },
              error: (error: any)=>{
                return callback(false)
              }
            }
          )
        }
      }
    }


  providersList: any = [
    { id: 1, value: 'Doc 1' },
    { id: 2, value: 'Doc 2' },
  ]

  handle(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.pdfData = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file && file.name) {
          this.pdfData.push(file);
        }
        let obj = {
          file: file,
          name: file.name,
          type: ''
        }
        this.fileArray.push(obj);
      }
      // const fileList: FileList = event.target.files;
      // if (fileList.length > 0) {
      //   const file = fileList[0];
      //   let obj = {
      //     file: file,
      //     name: file.name,
      //     type: 'Record'
      //   }
      //   this.fileArray.push(obj)
      // }
    }
  }
  handleUpload(fileInput: any) {
    this.uploading = true;
    fileInput.setAttribute('multiple', 'true'); // Allow selecting multiple files
    fileInput.click();
  }



}
