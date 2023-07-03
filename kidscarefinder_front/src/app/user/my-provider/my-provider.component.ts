import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { EnrollmentComponent } from 'src/app/component/static_pages/custom-modal/enrollment/enrollment.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/component/static_pages/custom-modal/confirm-popup/confirm-popup.component';
import { SuccessPopupComponent } from 'src/app/component/static_pages/custom-modal/success-popup/success-popup.component';
import { ApplyOnlineComponent } from 'src/app/component/static_pages/custom-modal/single-result/apply-online/apply-online.component';
import { ViewEnrollmentDocumentsComponent } from 'src/app/component/static_pages/custom-modal/view-enrollment-documents/view-enrollment-documents.component';

@Component({
  selector: 'app-my-provider',
  templateUrl: './my-provider.component.html',
  styleUrls: ['./my-provider.component.scss'],
})
export class MyProviderComponent implements OnInit {
  myProviderList: any = {};
  favouriteList: any = [];
  asc: boolean = false;
  actions: any = {
    'Added To Waitlist': 'Remove',
    'Enrollment Requested': 'Cancel',
    'Application Submitted': 'Withdraw',
    'Enrollment Started': 'Continue Enrollment',
    'Application Started': 'Continue Application',
    'Enrolled': 'View Enrollment Documents',
    'Invited To Enroll': 'Enroll Now',
    'Invited To Apply':'Apply Now'
  }
  constructor(
    private providerService: ProviderService,
    private notificationService: NotificationService,
    private localstorageService: LocalstorageService,
    private messengerService: MessengerService,
    private userservice: UserService,
    private router: Router,
    private UserService:UserService,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.favourite();
    this.myProvider();
  }

  goToMyProviderPage(id: any){
    this.localstorageService.saveKey('provider_return_text','my providers')
    this.router.navigate(['/preschool',id]);
  }

  viewEnrollmentDocs(item: any){
    const dialogRef = this.dialog.open(ViewEnrollmentDocumentsComponent, {
      maxWidth: '90vw',
      panelClass: 'EnrollmentDocs',
      data: item
    });
  }

  enrollNow(){
    const dialogRef = this.dialog.open(EnrollmentComponent, {
      // maxWidth: '90vw',
      panelClass: 'EnrollmentModal',
    });
  }
  handleActions(item: any, status: any) {

    this.UserService.setEnrolledItem(item);
    switch(status){
      case 'Added To Waitlist': return this.confirm(item,status)
      case 'Enrollment Requested':return this.confirm(item,status)

      case 'Application Submitted': return this.confirm(item,status)
      case 'Enrolled': return this.viewEnrollmentDocs(item);
      case 'Enrollment Started': return this.enrollNow();
      case 'Invited To Enroll': return this.enrollNow();
      case 'Invited To Apply': return this.openApplyOnlineModal(item,'openApplyOnlineModal')
      case 'Application Started': return this.openApplyOnlineModal(item,'Application Started')
      default: return {

      }
    }

  }
  favourite() {
    this.providerService
      .favourite(this.localstorageService.getUser().userDetails_id)
      .subscribe({
        next: (res: any) => {
          this.favouriteList = res.data;
        },
        error: (error: any) => { },
      });
  }

  // favrouites remove start
  confirmDelete(item: any){
    let name = (item?.provider?.organization_name)
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: `Are you sure you want to remove`,
        name: name,
        text2: `from your`,
        text3: `favorites?`,
        action: `Yes, remove from favorites`,
        id: item.id,
        providerActivity: true
      }
    });
    const subscribeDialog = dialogRef.componentInstance.action.subscribe(
      (data: any) => {
        if (data) {
          this.favouriteDelete(item?.provider?.id,name);
        }
      }
    );
  }

  successFav(name: any){
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: `Provider has been removed`,
        // name: name,
        text2: `from favorites`,
        // text3: ` favorites`,
      }
    });
  }

  favouriteDelete(id: any, name: any) {
    let param = { add_to_favourite: false };
    this.providerService
      .favouriteDelete(
        this.localstorageService.getUser().userDetails_id,
        id,
        param
      )
      .subscribe({
        next: (res: any) => {
          this.successFav(name);
          this.favourite();
        },
        error: (error: any) => {
          this.notificationService.showError('Some Error occoured');
        },
      });
  }

  // favrouites remove end

  myProvider(queryParams?:any) {
    this.providerService
      .myprovider(this.localstorageService.getUser().userDetails_id,queryParams)
      .subscribe({
        next: (res: any) => {
          this.myProviderList = res.data;
        },
        error: (error: any) => { },
      });
  }
  provActivityRemove(name: any,item: any,type: any,request_status: any) {
    let id: any,data: any;
    id = item.parent_1?.id;
    data = {
      "id": item?.id,
      "request_status":request_status,
      "parent_1":item.parent_1?.id,
      "child": item.child?.id,
      "provider": item.provider?.id,
      "provider_category": item.provider?.providercategory?.id,
      "isDeleted":false
  }
    this.providerService
      .provActivity(id,data)
      .subscribe({
        next: (res: any) => {
          this.successPopup(name,item,type);
          this.myProvider();
        },
        error: (error: any) => { },
      });
  }

  confirm(item: any,type: any){
    let text1,text2,action;
    if(type == 'Added To Waitlist')
    {
      text1 = `Are you sure you want to remove`;
      text2 = `from the waitlist for`;
      action = `Yes, remove from waitlist`;
    }
    if(type =='Enrollment Requested')  {
      text1 = `Are you sure you want to cancel`;
      text2 = `enrollment request for`;
      action = `Yes, cancel enrollment request`;
    }

    if(type == 'Application Submitted'){
      text1 = `Are you sure you want to withdraw your application to`;
      text2 = ``;
      action = `Yes, withdraw application`;

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
        name: type=='Application Submitted'?'':name,
        providerActivity: true,
        text2: text2,
        organization_name: item?.provider?.organization_name,
        action: action,
        id: item.id
      }
    });
    const subscribeDialog = dialogRef.componentInstance.action.subscribe(
      (data: any) => {
        if (data) {
          if(type == 'Added To Waitlist'){
            this.provActivityRemove(name,item,type,"Removed");
          }
          if(type == 'Enrollment Requested'){
            this.provActivityRemove(name,item,type,"Cancelled");
          }
          if(type == 'Application Submitted'){
            this.provActivityRemove(name,item,type,"Withdrawn");
          }
        }
      }
    );
  }
  openApplyOnlineModal(data: any, event: any) {
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(ApplyOnlineComponent, {
      width: '100% !important',
      // height: 'auto',
      panelClass: 'CustomModal',
      data: {
        modalType: event,
      },
    });
    const subscribeDialog =
    dialogRef.componentInstance.onSubmitSelection.subscribe((data) => {
      this.myProvider();
    });
  }

  sort(type: any){
    this.asc = !this.asc;
    let queryParams = `?${type}=${this.asc?'asc':'desc'}`;
    this.myProvider(queryParams);
  }

  successPopup(name: any,item:any,type:any){
    let text1,text2,action;
    if(type == 'Added To Waitlist')
    {
      text1 = `You've removed`;
      text2 = `from the waitlist for`;
      action = ``;
    }
    if(type =='Enrollment Requested')  {
      text1 = `You've canceled`;
      text2 = `enrollment request for`;
      action = ``;

    }

    if(type == 'Application Submitted'){
      text1 = `You've withdrawn your application from`;
      text2 = ``;
      action = ``;
    }
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: text1,
        name: type=='Application Submitted'?'':name,
        organization_name: item?.provider?.organization_name,
        text2: text2,
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
