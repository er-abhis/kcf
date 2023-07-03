import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-message-provider',
  templateUrl: './message-provider.component.html',
  styleUrls: ['./message-provider.component.scss'],
})
export class MessageProviderComponent implements OnInit {
  applyForm: any = FormGroup;
  children: any;
  newData: any;
  providerSelectedData: any;
  childId: any;
  dataSource = new MatTableDataSource();
  selectedChild: any;
  submitted: boolean =false;
  constructor(
    private dialog: MatDialog,
    private userservice: UserService,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private router: Router,
    private messengerService: MessengerService,

  ) {}

  ngOnInit(): void {
    this.providerSelectedData = this.userservice.getApplyOnlineData();
    this.getChild();
  }
  getChild() {
    let token = this.localServ.getToken();
    this.userservice.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
        if (this.children.length == 0) {
          this.notification.showInfo('Please update child details first');
          this.router.navigateByUrl('/user/profile');
        }
      },
    });
  }
  callChild(value: any) {
    this.messengerService.childArr = value;
    this.selectedChild = value;
  }
  closeModal() {
    this.dialog.closeAll();
  }
  messageProvider(user: any) {
    this.submitted = true;
    if(this.selectedChild){
    user.prov_organization_name = user.organization_name;
    this.messengerService.user = user;
    this.router.navigate(['/user/message-center']);
    this.dialog.closeAll();
    }
  }
  searchData() {
    this.userservice.searchData().subscribe({
      next: (data: any) => {
        let newData = data;
        if (newData.length > 0) {
          this.dataSource = new MatTableDataSource(newData);
        }
      },
    });
  }
  updateChildData(index: any) {
    this.userservice.getChild(this.applyForm).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          if (data && data?.data) {
            let dataToPopulate = data?.data;
            localStorage.setItem('childId', dataToPopulate[index].id);
          }
        }
      },
      error: (error: any) => {},
    });
  }

  messageProviderModal = [
    {id: 1, value: 'child1'}
  ]
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
