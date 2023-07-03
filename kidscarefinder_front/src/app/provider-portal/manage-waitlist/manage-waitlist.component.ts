import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProviderService} from 'src/app/services/rest-services/provider.service';
import {LocalstorageService} from 'src/app/utills/localstorage.service';
import {NotificationService} from 'src/app/utills/notification.service';
import {Router} from '@angular/router';
import {MessengerService} from 'src/app/services/rest-services/messenger.service';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmPopupComponent} from 'src/app/component/static_pages/custom-modal/confirm-popup/confirm-popup.component';
import {SuccessPopupComponent} from 'src/app/component/static_pages/custom-modal/success-popup/success-popup.component';
import {InvitationDialogComponent} from "./invitation-dialog.component/invitation-dialog.component";
import {AlertDialogComponent} from "./alert-dialog/alert-dialog.component";
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'app-manage-waitlist',
  templateUrl: './manage-waitlist.component.html',
  styleUrls: ['./manage-waitlist.component.scss']
})
export class ManageWaitlistComponent implements OnInit {
  waitList: any = {}
  provider_id: any = null;
  searchTxt= '';
  category_id: any = null;
  @ViewChild('input', {static: true}) input !: ElementRef;

  constructor(
    private providerService: ProviderService,
    private notificationService: NotificationService,
    private localstorageService: LocalstorageService,
    private messengerService: MessengerService,
    private router: Router,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.provider_id = this.localstorageService.getUser().provider_id;
    this.category_id = this.localstorageService.getUser().provider_category;
    this.getUserWaitlist();
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
            this.searchTxt = search.trim();
            this.waitlistSearch(search);
          }
          else{
            this.searchTxt = '';
            this.getUserWaitlist();
          }
        })
    )
    .subscribe();
}
  getUserWaitlist(){
    this.providerService.getUserWaitlist(this.provider_id).subscribe({
      next: (res: any) => {
        this.waitList = res.data;
      },
      error: (error: any) => {
      },
    })
  }

  removeConfirm(item: any){
    let name = (item?.user?.child?.expected_due_date)?`Upcoming Pregnancy` : `${item?.user?.child?.first_name} ${item?.user?.child?.last_name[0]}.`
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: `Are you sure you want to remove`,
        name: name,
        text2: `from your waitlist?`,
        action: `Yes, remove from waitlist`,
        id: item.id
      }
    });
    const subscribeDialog = dialogRef.componentInstance.action.subscribe(
      (data: any) => {
        if (data) {
          this.deleteWaitlist(data,name);
        }
      }
    );
  }

  successPopup(name: any){
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: `You've removed`,
        name: name,
        text2: `from your waitlist`,
      }
    });
  }

  deleteWaitlist(id: any, name: any){
    let data: any = {
      id: id,
      isDeleted: true
    };

    this.providerService.updateWaitList(data).subscribe({
      next: (res: any) => {
        this.successPopup(name);
        if(this.searchTxt.length){
          this.waitlistSearch(this.searchTxt);
        }
        else{
          this.getUserWaitlist();
        }
      },
      error: (error: any) => {
        this.notificationService.showError('Some Error occured');
      },
    })
  }
  moveWaitlist(id:any,moveUp: boolean){
    let data: any = {id: id};
    if(moveUp){
      data.move_up = true;
    }
    else{
      data.move_down = true;
    }
    this.providerService.updateWaitList(data).subscribe({
      next: (res: any) => {
        if(this.searchTxt.length){
          this.waitlistSearch(this.searchTxt);
        }
        else{
          this.getUserWaitlist();
        }
      },
      error: (error: any) => {
        this.notificationService.showError('Some Error occured');
      },
    })
  }
  waitlistSearch(search: any){
    this.providerService.waitlistSearch(this.provider_id,this.category_id,search).subscribe({
      next: (res: any) => {
        this.waitList = res.data;
        this.waitList.data.map((item: any)=>{
          item.user = item;
        })
      },
      error: (error: any) => {
      },
    })
  }
  messageUser(user: any){
    this.messengerService.user = user?.user?.parent_1;
    this.messengerService.user.user_account_id = user?.parent1_account_id;

    if(user?.user?.child?.id){
    this.messengerService.childArr = [user?.user?.child?.id];
  }
    this.router.navigate(['/providerSettings/provider-message-center'])
  }
  requestApplications(item: any,request_status: any){
    let obj = {
      parent_1: item.user.parent_1.id,
      parent_2: item?.user?.parent_2?.id,
      provider: this.provider_id,
      provider_category: this.category_id,
      child: item.user.child.id,
      request_status: request_status,
      isDeleted: false
    }
    this.providerService.requestApplications(obj).subscribe({
      next: (res: any) => {
        this.openInviteSuccessDialog(item, res.data.request_status.split(' ')[2]);
        this.getUserWaitlist();
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

  openInvitationDialog(item: any, invitationFor: string) {
    if (item.user.request_status === 'Invited To ' + invitationFor) {
      const errMsg: string = `Invite to ${invitationFor.toLowerCase()} request for this child or pregnancy already exists`;
      this.notificationService.showError(errMsg);
      return
    }
    const dialogRef = this.dialog.open(InvitationDialogComponent, {
      maxHeight: 330,
      maxWidth: 600,
      panelClass: ['customisable-dialog', 'animate__animated', 'animate__fadeInDownBig', 'animate__faster'],
      data: {
        name: item?.user?.parent_1?.first_name + ' ' + item?.user?.parent_1?.last_name,
        invitationFor: invitationFor.toLowerCase()
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.requestApplications(item, 'Invited To ' + invitationFor)
      }
    });
  }

  openInviteSuccessDialog (item: any, invitedTo: string) {
    const data = {
      name: item?.user?.parent_1?.first_name + ' ' + item?.user?.parent_1?.last_name,
      invitedTo: invitedTo.toLowerCase()
    }

    const template = `You've invited <span class="fw-bold">${data.name}</span> to ${invitedTo.toLowerCase()}`;
    this.dialog.open(AlertDialogComponent, {
      maxHeight: 330,
      maxWidth: 550,
      panelClass: ['customisable-dialog', 'animate__animated', 'animate__fadeInDownBig', 'animate__faster'],
        data: { template },
    });
  }

  async scheduleATour(item: any) {
    let dates: Moment[] = await this.getProviderAvailability();
    let t = '';
    dates.map((date: Moment) => {
      t = t + '\n' + date.format('dddd, MMMM D [at] h:mm A')
    });
    const message = 'Hello! We would like to invite you to take a tour of our facility.'
      + '\nHere are some dates and times we have available:'
      + t
      +'\n\nPlease let us know if any of those work for you.'
      + '\nWe look forward to seeing you soon!'
    await this.router.navigateByUrl('/providerSettings/provider-message-center', {
      state: {
        data: item,
        message
      }
    })
  }

  getProviderAvailability(): Promise<Moment[]> {
    return new Promise((resolve) => {
      this.providerService.getProviderBasicInfo().subscribe(e => {
        const schedule = e.data.schedule[0];
        schedule.tuesday = true;
        let weekDays = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        let providerAvailability: Moment[] = [];
        weekDays.forEach((e: string) => {
          if (schedule[e.toLowerCase()]) {
            const d = this.getNextScheduleDateAndTime(e, schedule.start_time);
            providerAvailability.push(d);
          }
        });
        resolve(providerAvailability.sort((a, b) => a.valueOf() - b.valueOf()))
      })
    })
  }

  getNextScheduleDateAndTime(day: string, startTime: string) {
    let weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    function rotate(arr: string[], count: number) {
      return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
    }

    function getDaysToAdd(temp: string) {
      if (weekDays.indexOf(temp) === 0) {
        return 0;
      } else {
        return weekDays.indexOf(temp);
      }
    }

    function setStartTime(date: any) {
      let time = moment(startTime, 'HH:mm:ss');
      date.set({
        hour: time.get('hour'),
        minute: time.get('minute'),
        second: time.get('second'),
      });
    }

    let currentDay = moment();
    weekDays = rotate(weekDays, -(7 - weekDays.indexOf(currentDay.format('dddd'))));
    const daysToAdd = getDaysToAdd(day);

    const date = moment(currentDay).add(daysToAdd, 'day');

    if (daysToAdd === 0) { // schedule is on same day
      const duration = moment.duration(moment(startTime, 'HH:mm:ss').diff(currentDay));
      const hours = duration.asHours();
      if (parseInt(String(hours)) > 0) {
        setStartTime(date);
      } else {
        date.add(1, 'week');
        setStartTime(date);
      }
    } else {
      setStartTime(date);
    }
    return date
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
