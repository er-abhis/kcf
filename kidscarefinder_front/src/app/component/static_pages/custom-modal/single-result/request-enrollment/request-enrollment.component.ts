import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnrollThankyouComponent } from '../thankyouModal/enroll-thankyou/enroll-thankyou.component';
import { UserService } from 'src/app/services/rest-services/user.service';
import {
  FormBuilder,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-request-enrollment',
  templateUrl: './request-enrollment.component.html',
  styleUrls: ['./request-enrollment.component.scss'],
})
export class RequestEnrollmentComponent implements OnInit {
  childId: any;
  applyForm: any = FormGroup;
  children: any;
  provider: any;
  providerSelectedData: any;
  user: any;
  selectedChild: any;
  submitted: boolean =false;

  constructor(
    private dialog: MatDialog,
    private userservice: UserService,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.providerSelectedData = this.userservice.getApplyOnlineData();
    this.loadData();
  }
  loadData() {
    this.getChild();
    this.getProvider();
  }

  closeModal() {
    this.dialog.closeAll();
  }
  callChild(value: any) {
    this.childId = value.split('|')[1];
    this.selectedChild = this.childId;
    this.updateChildData(value.split('|')[0]);
  }
  getChild() {
    let token = this.localServ.getToken();
    this.userservice.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
        if (this.children.length == 0) {
          this.notification.showInfo('Please Update Child Details First');
          this.dialog.closeAll();
          this.router.navigateByUrl('/user/profile');
        }
      },
    });
  }
  getProvider() {
    var id = this.providerSelectedData.provider.id;
    this.userservice.getProviderInfo(this.applyForm, id).subscribe({
      next: (data: any) => {
        this.provider = data?.data;
      },
    });
  }
  updateChildData(index: any) {
    this.userservice.getChild(this.applyForm).subscribe({
      next: (data) => {
        let dataToPopulate = data?.data;
        localStorage.setItem('childId', dataToPopulate[index].id);
      },
      error: (error: any) => {},
    });
  }
  openThanksModal() {
    this.submitted = true;
    if(this.selectedChild){
    this.waitlist();

    this.dialog.closeAll();
    const dialogRef = this.dialog.open(EnrollThankyouComponent, {
      width: '80vw',
      maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
    });
  }
  }
  waitlist() {
    let dataToSend = {
      parent_1: localStorage.getItem('user_id'),
      provider: this.providerSelectedData.provider.id,
      parent_2: localStorage.getItem('guardId'),
      provider_category: this.providerSelectedData.provider.providercategory.id,
      child: localStorage.getItem('childId'),
      request_status: 'Enrollment Requested',
      isDeleted: false,
    };
    this.userservice.addToWaitList(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;

        this.userservice.setEnrollData(resData);
      },
      error: (error: any) => {
        if(error.error.errors?.non_field_errors && error.error.errors?.non_field_errors[0])
        this.notification.showError(error.error.errors.non_field_errors[0]);
        else if(error.error.errors)
        this.notification.showError(error.error.errors);
        else 
        this.notification.showError('Some Error occured')
        this.dialog.closeAll();
      }
    });
  }
  subString(str:any,start:number,last:number){
    return str.substring(start,last)
   }
   usLast(str:any){
     return this.subString(str,0,1).toUpperCase();
   }
   ucFirst(str:any){
     return str.substring(0,1).toUpperCase()+ str.substring(1,str.length).toLowerCase() 
   }
}
