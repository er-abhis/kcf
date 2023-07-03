import { Router } from '@angular/router';
import { UserService } from 'src/app/services/rest-services/user.service';
import { Subscription, noop } from 'rxjs';
import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
//import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplyOnlineComponent } from '../../static_pages/custom-modal/single-result/apply-online/apply-online.component';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { RequestEnrollmentComponent } from '../../static_pages/custom-modal/single-result/request-enrollment/request-enrollment.component';
import { AddWaitlistComponent } from '../../static_pages/custom-modal/single-result/add-waitlist/add-waitlist.component';
import { MessageProviderComponent } from '../../static_pages/custom-modal/single-result/message-provider/message-provider.component';
import { TutionFeeComponent } from '../../static_pages/custom-modal/tution-fee/tution-fee.component';
import { ModalTooltipComponent } from '../../static_pages/custom-modal/modal-tooltip/modal-tooltip.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { LicenceModalTooltipComponent } from '../../static_pages/custom-modal/licence-modal-tooltip/licence-modal-tooltip.component';
import { ConfirmPopupComponent } from '../../static_pages/custom-modal/confirm-popup/confirm-popup.component';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  query = '';
  Array = Array;
  Math = Math;
  Number = Number;
  newData: any;
  showLoader: boolean = false;
  length: any = 0;
  @ViewChildren('btn1') btn1!: QueryList<any>;
  @ViewChildren('btn2') btn2!: QueryList<any>;
  @ViewChildren('btn3') btn3!: QueryList<any>;
  @ViewChildren('licenseBtn') licenseBtn!: QueryList<any>;
  applyOnline: boolean = false;
  @ViewChild(MatSort)
  private sort!: MatSort;
  displayedColumns: string[] = [
    'first_name',
    'distance',
    'schoolhrs',
    'beforeafterhrs',
    'providermeals',
    'snacks',
    'naptime',
    'spaceavailable',
    'progavail',
    'expectavail',
    'teacherchildratio',
    'minimum_age_years',
    'is_potty_trained',
    'additionlang',
    'religiousaffi',
    'fullparttime',
    'offersprivate',
    'tuition',
  ];
  dataSource = new MatTableDataSource();
  filters: any = {};
  errorMessage: any;
  children: any = [];
  constructor(
    private elementRef: ElementRef,
    private _liveAnnouncer: LiveAnnouncer,
    private providerservice: ProviderService,
    private userservice: UserService,
    public dialog: MatDialog,
    private router: Router,
    private notification: NotificationService,
    private localstorage: LocalstorageService,
    private messengerService: MessengerService
  ) { }
  serialize(obj: any) {
    var str = [];
    for (var p in obj)
      if (
        obj.hasOwnProperty(p) &&
        obj[p].length &&
        p != 'formatted_address' &&
        p != 'religion' &&
        p != 'language'
      ) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      } else if (
        obj.hasOwnProperty(p) &&
        obj[p].length &&
        (p == 'religion' || p == 'language')
      ) {
        obj[p].forEach((item: any) =>
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item.id))
        );
      }
    return str.join('&');
  }
  getFilters() {
    this.userservice.filter.subscribe((response) => {
      this.filters = response;
    });
  }
  goToMyProviderPage(id: any){
    this.localstorage.saveKey('provider_return_text','results')
    this.router.navigate(['/preschool',id]);
  }
  ngOnInit(): void {
    this.showLoader = true;
    // this.getFilters();
    if (this.localstorage.getKey('filters'))
      this.filters = this.localstorage.getKey('filters');

    this.searchData();
    this.getChild();
  }
  getFilterTextStep2() {
    if (this.filters.radius && !this.filters.formatted_address) {
      let r = Number(this.filters.radius);
      let preText = r == 25 ? 'Greater than' : 'Within';
      return `${preText} ${this.filters.radius} miles`;
    }
    if (!this.filters.radius && this.filters.formatted_address) {
      return `${this.filters.formatted_address.split(',')[0]}`;
    }
    if (this.filters.radius && this.filters.formatted_address) {
      let r = Number(this.filters.radius);
      let preText = r == 25 ? 'Greater than' : 'Within';
      return `${preText} ${this.filters.radius} miles of ${this.filters.formatted_address.split(',')[0]
        }`;
    }
    return ``;
  }
  getFilterTextStep3() {
    let str: any = [];
    if (this.filters.availability_now) {
      str.push('Immediately');
    }
    if (this.filters.availability_in_3_months) {
      str.push('Within 3 Months');
    }
    if (this.filters.availability_in_6_months) {
      str.push('Within 6 Months');
    }
    if (this.filters.availability_in_12_months) {
      str.push('Within 12 Months');
    }
    if (str.length) {
      return `${str.join(', ')}`;
    } else return ``;
  }
  editFilters() {
    this.userservice.filters = {};
    this.localstorage
    this.router.navigate(['/preschool']);
    this.localstorage.delKey('filters');
  }

  getFilterTextStep4() {
    let str: any = [];
    let txt = '';
    if (this.filters.is_full_time) {
      str.push(`Full Time`);
    }
    if (this.filters.is_part_time) {
      str.push(`Part Time`);
    }
    if (this.filters.is_full_days) {
      str.push(`Full Days`);
    }
    if (this.filters.is_half_days) {
      str.push(`Half Days`);
    }
    if (str.length) return `${str.join(', ')}`;
    else return ``;
  }
  getFilterTextStep5() {
    let str = [];
    let tst = [];
    if (Object.keys(this.filters).length !== 0) {
      for (let p of Object.keys(this.filters)) {
        if (this.filters[p] && p == 'meals__is_meal_provided') {
          str.push('Provides meals');
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'is_tk12_program') {
          str.push('Offers Private school (K-12)');
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'is_minimum_age') {
          str.push('Accepts children under two years old');
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'is_potty_trained') {
          str.push('Potty training not required');
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'is_before_after_care') {
          str.push('Offers aftercare program');
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'religion') {
          str.push(
            `Religious affiliation: ${this.filters[p]
              .map((item: any) => item.name)
              .join(', ')}`
          );
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'language') {
          str.push(
            `Speaks additional language(s): ${this.filters[p]
              .map((item: any) => item.name)
              .join(', ')}`
          );
          tst[0] = 'Multiple Specifics';
        }
        if (this.filters[p] && p == 'is_license_verified') {
          str.push('Verified license');
          tst[0] = 'Multiple Specifics';
        }
      }
    }
    return str.join(', ');
  }
  getFilterTextStep1() {
    return 'Preschool';
  }

  getAvgRating(reviewList: any) {
    let ratings: any = reviewList.map((item: any) => item.rating);
    const average = (ratings: any[]) =>
      ratings.reduce((a, b) => a + b) / ratings.length;
    let avgRating = average(ratings);
    return avgRating;
    // return Array(Math.floor(avgRating))
  }

  TuitionDetails(type: any, data: any) {
    const dialogRef = this.dialog.open(TutionFeeComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: type,
        data: data,
      },
    });
  }

  openApplyOnlineModal(i: any, event: any) {
    let data = this.dataSource.filteredData[i];
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(ApplyOnlineComponent, {
      width: '100%',
      // height: 'auto',
      panelClass: 'CustomModal',
      data: {
        modalType: event,
      },
    });
  }

  openModalTooltip(type: any, i: any) {
    let text = '';
    let btn: any;
    if (type == 1) {
      text = 'This provider is not allowing online applications at this time';
      btn = this.btn1.get(i);
    }
    if (type == 2) {
      text =
        'This provider does not have their waitlist turned on at this time';
      btn = this.btn2.get(i);
    }
    if (type == 3) {
      text = 'This provider is not allowing online enrollment requests at this time';
      btn = this.btn3.get(i);
    }
    const dialogRef = this.dialog.open(ModalTooltipComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      panelClass: 'modalTooltip',
      data: {
        positionRelativeToElement: btn,
        text: text,
      },
    });
  }
  openLicenseTooltip(i: any) {

    const dialogRef = this.dialog.open(LicenceModalTooltipComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      autoFocus: false,
      panelClass: 'modalTooltip',
      data: {
        positionRelativeToElement: this.licenseBtn.get(i),
      },
    });
  }

  searchData() {
    let queryParams;
    if (Object.keys(this.filters).length !== 0) {
      queryParams = this.serialize(this.filters);
    }
    this.userservice.searchDataWithParams(queryParams).subscribe({
      next: (data: any) => {
        let newData = data;
        this.updateUserActivity(data);
        this.errorMessage = data?.message;
        this.showLoader = false;

        this.length = newData.length;
        if (newData.length > 0) {
          this.dataSource = new MatTableDataSource(newData);
        }
      },
      error: (error: any) => { },
    });

  }
  sendNewData(data: any) {
    this.userservice.sendData(data);
  }
  select(data: any) {
    this.sendNewData(data);
    this.goToMyProviderPage(data.provider.id)
  }

  isFavourite(favourite: any) {
    let isFav: boolean = false;
    if (!favourite) {
      return isFav;
    } else if (!favourite.length) {
      return favourite?.add_to_favourite &&
        (favourite?.user_details?.id ==
          this.localstorage.getUser().userDetails_id ||
          favourite?.user_details == this.localstorage.getUser().userDetails_id)
        ? true
        : false;
    } else {
      for (let i = 0; i < favourite.length; i++) {
        if (
          favourite[i]?.add_to_favourite &&
          (favourite[i]?.user_details ==
            this.localstorage.getUser().userDetails_id ||
            favourite[i]?.user_details?.id ==
            this.localstorage.getUser().userDetails_id)
        ) {
          isFav = true;
          break;
        }
      }
      return isFav;
    }
  }
  isLoggedIn(type: any, event: any, index?: any) {
    let isLoggedIn = this.localstorage.getUser();
    if (!isLoggedIn.user_type) {
      this.notification.showWarning(CustomAlertMessage.addFav[1].message);
      this.openLoginModal('signIn', event);
    } else if (isLoggedIn.user_type == 'PROVIDER') {
      this.notification.showWarning(CustomAlertMessage.addFav[2].message);
      this.openLoginModal('signIn', event);
    } else {
      if (type == 'openMessageProvider') {
        if(this.children.length){
          this.messageProvider(event);
          this.openMessageProvider(type, event);
        }
        else
        this.completeProfilePopup();
      }
      if (type == 'addtoWaitlist') {
        this.addtoWaitlist(event, type);
      }
      if (type == 'requestEnroll') {
        this.requestEnroll(event, type);
      }
      if (type == 'openApplyOnlineModal') {
        this.openApplyOnlineModal(event, type);
      }
      if (type == 'favourite') {
        let param = {
          user_details: this.localstorage.getUser()?.userDetails_id,
          provider: event?.provider?.id,
          provider_category: event?.provider?.providercategory?.id,
          add_to_favourite: !this.isFavourite(event.favourite),
        };
        this.providerservice.updatefavourite(param).subscribe({
          next: (res: any) => {
            if (index != null) {
              if (!res.data.length) {
                event.favourite = [res.data];
              } else event.favourite = res.data;
              this.dataSource.filteredData[index] = event;
            }
            if (param.add_to_favourite)
              this.notification.showSuccess(CustomAlertMessage.addFav[0].message);
            else this.notification.showInfo(CustomAlertMessage.addFav[3].message);

            // this.showLoader = true;
            // this.searchData();
          },
          error: (error: any) => {
            this.notification.showInfo('Processing request');
          },
        });
      }
    }
  }
  completeProfilePopup(){
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      width: '80vw',
      panelClass: 'CustomModal',
      data: {
        text1: `You need to complete your user profile and add your child(ren) before`,
        name:   `Messaging provider`,
        action: `Complete user profile now`,
        id: this.localstorage.getToken()
      }
    });
    const subscribeDialog = dialogRef.componentInstance.action.subscribe(
      (data: any) => {
        if (data) {
          this.router.navigateByUrl('/user/profile');
        }
      }
    );
  }
  getChild() {
    let token = this.localstorage.getToken();
    if(token)
    this.userservice.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
      },
    });
  }

  openMessageProvider(event: any, i: any) {
    let data = this.dataSource.filteredData[i];
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(MessageProviderComponent, {
      width: '80vw',
      maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: event,
      },
    });
  }

  addtoWaitlist(i: any, event: any) {
    let data = this.dataSource.filteredData[i];
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(AddWaitlistComponent, {
      width: '80vw',
      maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: event,
      },
    });
  }
  requestEnroll(i: any, event: any) {
    let data = this.dataSource.filteredData[i];
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(RequestEnrollmentComponent, {
      width: '80vw',
      maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: event,
      },
    });
  }
  openLoginModal(event: any, $event: any) {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      hasBackdrop: false,
      data: {
        modalType: event,
        returnUrl: '/preschool/result',
      },
    });
  }

  isScheduleRegular(arr: []) {
    let regular = arr.filter((i: any) => {
      return i.schedule_type == 'Regular';
    });
    return regular.length;
  }
  isNapTime(arr: []) {
    let nap = arr.filter((i: any) => {
      return i.is_nap_time == true;
    });
    return nap.length;
  }
  isSpaceAvailable(arr: []) {
    let nap = arr.filter((i: any) => {
      return i.available_seats == true;
    });
    return nap.length;
  }
  isPresent(arr: []) {
    let p = arr.filter((i: any) => {
      return i.is_present == true;
    });
    return p.length;
  }
  isRatio(arr: []) {
    let r = arr.filter((i: any) => {
      return i.teacher_to_child_ratio;
    });
    return r.length;
  }
  getLanguages(arr: any) {
    return arr.map((i: any) => i.language).join();
  }
  getReligion(arr: any) {
    return arr.map((i: any) => i.religion).join();
  }

  tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      time[3] = '';
    }
    return time.join(''); // return adjusted time or original string
  }

  messageProvider(user: any) {
    this.messengerService.user = user;
    // this.router.navigate(['/user/message-center']);
  }

  private updateUserActivity(data: any) {
    const obj = {unique_provider_id: data.map((e: any) => e.provider.unique_provider_id)}
    this.userservice.updateUserActivity(obj).subscribe(_ => {});
  }
}
