import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { ProviderSettingsService} from 'src/app/services/rest-services/provider-settings.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import {fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { ConfirmPopupComponent } from 'src/app/component/static_pages/custom-modal/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/component/static_pages/custom-modal/success-popup/success-popup.component';

@Component({
  selector: 'app-provider-enrollment',
  templateUrl: './provider-enrollment.component.html',
  styleUrls: ['./provider-enrollment.component.scss']
})
export class ProviderEnrollmentComponent implements OnInit {
  provider_id: any = null;
  category_id: any = null;
  limit: any = 10;
  notEnrolled: any = [];
  notEnrolledCount: any = 0;
  today = new Date();
  EnrolledCount: any = 0;
  Enrolled: any = [];
  @ViewChild('input', {static: true}) input !: ElementRef;

  constructor(
    private providerSettingsService: ProviderSettingsService,
    private localstorageService: LocalstorageService,
    private messengerService: MessengerService,
    private router: Router,
    private providerService: ProviderService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.provider_id = this.localstorageService.getUser().provider_id;
    this.category_id = this.localstorageService.getUser().provider_category;
    this.getEnrollmentRequests(2);
    this.getEnrollmentRequests(5);
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(1000),
            distinctUntilChanged(),
            tap((event:any) => {
              let search = this.input.nativeElement.value
              if(search.trim().length){
                this.enrollmentSearch(search);
              }
              else{
                this.getEnrollmentRequests(2);
                this.getEnrollmentRequests(5);
              }
            })
        )
        .subscribe();
    }

    checkNewStatus(date: any){
      var a = moment(this.today);
var b = moment(date)
let days = a.diff(b, 'days')
 return days < 2
    }

    confirm(item: any,type: any){
      let text1,text2,action;
      if(type == 'Enrolled')
      {
        text1 = `Are you sure you want to mark`;
        text2 = `as enrolled by provider?`;
        action = `Yes, mark as enrolled by provider`;
      }
      if(type == 'Unmarked As Enrolled')
      {
        text1 = `Are you sure you want to unmark`;
        text2 = `as enrolled by provider?`;
        action = `Yes, unmark as enrolled by provider`;
      }
      
      if(type =='Invited To Enroll')  {
        text1 = `Are you sure you want to invite`;
        text2 = `to enroll?`;
        action = `Yes, invite to enroll`;
      }
  
      if(type == 'Added To Waitlist'){
        text1 = `Are you sure you want to add`;
        text2 = `to your waitlist?`;
        action = `Yes, add to waitlist`;

      }
      if(type == 'Invited To Apply'){
        text1 = `Are you sure you want to invite`;
        text2 = `to apply?`;
        action = `Yes, invite to apply`;

      }    
      let name = '';
      if((item?.child.expected_due_date && item?.child?.first_name) || ((!item?.child.expected_due_date && item?.child?.first_name))){
        name = `${item?.child?.first_name} ${item?.child?.last_name}`
      }
      if(item?.child.expected_due_date && !item?.child?.first_name){
        name = `Upcoming Pregnancy`
      }
      const dialogRef = this.dialog.open(ConfirmPopupComponent, {
        width: '80vw',
        panelClass: 'CustomModal',
        data: {
          text1: text1,
          name: name,
          text2: text2,
          action: action,
          id: item.id
        }
      });
      const subscribeDialog = dialogRef.componentInstance.action.subscribe(
        (data: any) => {
          if (data) {
            if(type == 'Enrolled' || type == 'Unmarked As Enrolled'){
              let obj =  {
                "id": item?.id,
                "request_status": type,
                "parent_1":item.parent_1?.id,
                "child": item.child?.id,
                "provider": item.provider?.id,
                "provider_category": item?.provider_category?.id,
                "isDeleted":false
            }
              
              this.providerActivity(obj,name,item,type)
            }
            if(type == 'Invited To Enroll' || type == 'Added To Waitlist' ||  type == 'Invited To Apply'){
              this.requestApplications(item,name,type);
            }
            
          }
        }
      );
    }

    providerActivity(data: any,name:any,item:any,type: any){
      if(type == 'Enrolled' || type == 'Unmarked As Enrolled'){
        this.providerService
        .provActivity(data.id,data)
        .subscribe({
          next: (res: any) => {
            this.successPopup(name,item,type);
            this.getEnrollmentRequests(2);
            this.getEnrollmentRequests(5);
          },
          error: (error: any) => {
           },
        });
      }
    }
    successPopup(name: any,item:any,type:any){
      let text1,text2,action;
      if(type == 'Enrolled')
      {
        text1 = `You've marked`;
        text2 = `as enrolled by provider`;
      }
      if(type == 'Unmarked As Enrolled'){
        text1 = `You've ummarked`;
        text2 = `as enrolled by provider`;

      }
      if(type =='Invited To Enroll')  {
        text1 = `You've invited`;
        text2 = `to enroll`;

      }
  
      if(type == 'Added To Waitlist'){
        text1 = `You've added`;
        text2 = `to your waitlist`;
      }
      if(type == 'Invited To Apply'){
        text1 = `You've invited`;
        text2 = `to apply`;

      }    
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
        width: '80vw',
        panelClass: 'CustomModal',
        data: {
          text1: text1,
          name: name,
          text2: text2,
        }
      });
    }

  getEnrollmentRequests(enrolled: number){
    this.providerSettingsService.getEnrollmentRequests(this.provider_id,this.category_id,enrolled,this.limit).subscribe({
      next: (res: any) => {
        if(enrolled == 5){
          this.Enrolled = res.data.data
          this.EnrolledCount = res.data.count
        }
        if(enrolled == 2){
          this.notEnrolled = res.data.data
          this.notEnrolledCount = res.data.count
        }
      },
      error: (error: any) => {
      },
    })
  }
  enrollmentSearch(search: any){
    this.providerService.enrollmentSearch(this.provider_id,this.category_id,search).subscribe({
      next: (res: any) => {
          this.notEnrolled = res.data.data
          this.notEnrolledCount = res.data.count
      },
      error: (error: any) => {
      },
    })
  } 
  requestApplications(item: any,name: any,request_status: any){
    let obj = {
      parent_1: item.parent_1.id,
      parent_2: item?.parent_2?.id,
      provider: this.provider_id,
      provider_category: this.category_id,
      child: item?.child?.id,
      request_status: request_status,
      isDeleted: false
    }
    this.providerService.requestApplications(obj).subscribe({
      next: (res: any) => {
        this.notificationService.showSuccess(res.data.request_status);
        this.successPopup(name,item,request_status);
        this.getEnrollmentRequests(2);
        this.getEnrollmentRequests(5);
      },
      error: (error: any) => {
        if(error.error.errors?.non_field_errors && error.error.errors?.non_field_errors[0])
        this.notificationService.showError(error.error.errors.non_field_errors[0]);
        else if(error.error.errors)
        this.notificationService.showError(error.error.errors);
        else 
        this.notificationService.showError('Some Error occured')
      },
    })
  } 
  getAllEnrollmentRequests(enrolled: number){
    this.providerSettingsService.getAllEnrollmentRequests(this.provider_id,this.category_id,enrolled).subscribe({
      next: (res: any) => {
        if(enrolled == 1){
          this.Enrolled = res.data.enrollement_requests
          this.EnrolledCount = res.data.count
        }
        if(enrolled == 0){
          this.notEnrolled = res.data.enrollement_requests
          this.notEnrolledCount = res.data.count
        }
      },
      error: (error: any) => {
      },
    })
  }
  messageUser(user: any){
    this.messengerService.user = user?.parent_1;
    this.messengerService.user.user_account_id = user?.parent1_account_id;
    if(user?.child?.id)
    this.messengerService.childArr = [user?.child?.id];
    this.router.navigate(['/providerSettings/provider-message-center'])
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
