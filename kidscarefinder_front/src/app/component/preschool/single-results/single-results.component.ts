import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/rest-services/user.service';
import { AddWaitlistComponent } from '../../static_pages/custom-modal/single-result/add-waitlist/add-waitlist.component';
import { AvailabilityComponent } from '../../static_pages/custom-modal/single-result/availability/availability.component';
import { MessageProviderComponent } from '../../static_pages/custom-modal/single-result/message-provider/message-provider.component';
import { RequestEnrollmentComponent } from '../../static_pages/custom-modal/single-result/request-enrollment/request-enrollment.component';
import { ApplyOnlineComponent } from '../../static_pages/custom-modal/single-result/apply-online/apply-online.component';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignInComponent } from '../../sign-in/sign-in.component';
import {
  FormBuilder,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TutionFeeComponent } from '../../static_pages/custom-modal/tution-fee/tution-fee.component';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { ModalTooltipComponent } from '../../static_pages/custom-modal/modal-tooltip/modal-tooltip.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { LicenceModalTooltipComponent } from '../../static_pages/custom-modal/licence-modal-tooltip/licence-modal-tooltip.component';
import { Location } from '@angular/common';
import { ConfirmPopupComponent } from '../../static_pages/custom-modal/confirm-popup/confirm-popup.component';

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}
@Component({
  selector: 'app-single-results',
  templateUrl: './single-results.component.html',
  styleUrls: ['./single-results.component.scss'],
})
export class SingleResultsComponent implements OnInit {
  [x: string]: any;
  providerSelectedData: any;
  return_text: any;
  children: any = [];
  provider_id: any;
  picture: boolean = false;
  break: boolean = false;
  applyForm: any = FormGroup;
  provider: any;
  dataLength: boolean = false;
  videoSrc: any;
  @ViewChild('btn1', { static: false }) public btn1!: ElementRef
  @ViewChild('btn2', { static: false }) public btn2!: ElementRef
  @ViewChild('btn3', { static: false }) public btn3!: ElementRef
  @ViewChild('licenseBtn', { static: false }) public licenseBtn!: ElementRef


  desserts: Dessert[] = [
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    {
      name: 'Ice cream sandwich',
      calories: 237,
      fat: 9,
      carbs: 37,
      protein: 4,
    },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  ];

  sortedData: Dessert[];
  dataSource = new MatTableDataSource();
  urlRegex =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  reviewList: any = [];

  constructor(
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private userservice: UserService,
    private _location: Location,
    private providerservice: ProviderService,
    private localstorage: LocalstorageService,
    private notification: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private messengerService: MessengerService
  ) {
    this.sortedData = this.desserts.slice();
  }
  goToLink(url: string) {
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
  }
    window.open(url);
  }
  return() {
    if(this.return_text == 'provider portal'){
      this.router.navigate(['/providerSettings/user-activity'])
      this.localstorage.delKey('provider_return_text')
    }
    else{
    this.localstorage.delKey('provider_return_text')
    this._location.back();
    }
  }
  isFavourite(favourite: any) {
    let isFav: boolean = false;
    if (!favourite) {
      return isFav;
    }
    else if (!favourite.length) {
      return (favourite?.add_to_favourite && ((favourite?.user_details?.id == this.localstorage.getUser().userDetails_id) || (favourite?.user_details == this.localstorage.getUser().userDetails_id))) ? true : false;
    }
    else {
      for (let i = 0; i < favourite.length; i++) {
        if (favourite[i]?.add_to_favourite && ((favourite[i]?.user_details == this.localstorage.getUser().userDetails_id) || (favourite[i]?.user_details?.id == this.localstorage.getUser().userDetails_id))) {
          isFav = true;
          break;
        }
      }
      return isFav;
    }
  }

  getReviews() {
    this.providerservice
      .reviews(
        this.providerSelectedData?.provider?.id,

        this.providerSelectedData?.provider?.providercategory?.id
      )
      .subscribe({
        next: (res: any) => {
          this.reviewList = res.data;
        },
        error: (error: any) => { },
      });
  }
  openLicenseTooltip() {

    const dialogRef = this.dialog.open(LicenceModalTooltipComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      autoFocus: false,
      panelClass: 'modalTooltip',
      data: {
        positionRelativeToElement: this.licenseBtn,
      },
    });
  }

  openModalTooltip(type: any, elementRef: any) {
    let text = "";
    let btn: any;
    if (type == 1) {
      text = 'This provider is not allowing online applications at this time'
      btn = this.btn1
    }
    if (type == 2) {
      text = 'This provider does not have their waitlist turned on at this time'
      btn = this.btn2

    }
    if (type == 3) {
      text = 'This provider is not allowing online enrollment requests at this time'
      btn = this.btn3

    }
    const dialogRef = this.dialog.open(ModalTooltipComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: true,
      panelClass: 'modalTooltip',
      // hasBackdrop: false,
      data: {
        positionRelativeToElement: btn,
        text: text
      },
    });

  }
  searchDetails() {
    this.providerservice.searchDetails(this.provider_id).subscribe((response) => {

      if (response.data[0]?.provider?.profile_photo != null) {
        this.picture = true

      } else {
        this.picture = false
      }

      this.providerSelectedData = response.data[0]
      this.dataLength = this.providerSelectedData.agegroup[this.providerSelectedData.agegroup.length - 1];
      if (this.providerSelectedData?.provider?.video_url)
        this.youtubeUrlChecker(this.providerSelectedData?.provider?.video_url);
      // if (this.localstorage.getUser().id) {
      this.getReviews();
      // }
    })
  }
  isScheduleRegular(arr: []) {
    let regular = arr.filter((i: any) => {
      return i.schedule_type == 'Regular';
    });
    return regular.length;
  }
  getDayRange(item: any = {}) {
    let range: any = {
      monday: 'M',
      tuesday: 'T',
      wednesday: 'W',
      thrusday: 'R',
      friday: 'F',
      saturday: 'S',
      sunday: 'U',
    };
    let arr: any= [];
    for (let r of Object.keys(range)) {
      if (item[r]) {
        arr.push(range[r])
      }
    }
    return arr.join('');
  }
  isNapTime(arr: []) {
    let nap = arr.filter((i: any) => {
      return i.is_nap_time == true;
    });
    return nap.length;
  }
  childRatioFilter(arr: []){
    let filterArr: any = arr.filter((i: any) => {
      return i.teacher_to_child_ratio ;
    });
    return filterArr;
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
    return arr.map((i: any) => i.language).join(', ');
  }
  getPrograms(arr: any) {
    arr = arr.filter((i: any) => {
      return i.is_present;
    });
    return arr.map((i: any) => i.agegroupcategory?.agegroupcategory).join(', ');
  }
  getReligion(arr: any) {
    return arr.map((i: any) => i.religion).join(', ');
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
  slides = [
    {
      id: 1,
      img: '../../../assets/images/Special-needs-programs.jpg',
      alt: 'Special needs programs',
      title: 'Special needs programs',
    },
    {
      id: 2,
      img: '../../../assets/images/Private-school.jpg',
      alt: 'Private school',
      title: 'Private school',
    },
    {
      id: 3,
      img: '../../../assets/images/Babysitter.jpg',
      alt: 'Babysitter',
      title: 'Babysitter',
    },
    {
      id: 4,
      img: '../../../assets/images/Nanny-share.jpg',
      alt: 'Nanny share',
      title: 'Nanny share',
    },
    {
      id: 5,
      img: '../../../assets/images/Daycare-center.jpg',
      alt: 'Daycare center',
      title: 'Daycare center',
    },
    {
      id: 6,
      img: '../../../assets/images/Beforeafter-school-care.jpg',
      alt: 'Before/after school care',
      title: 'Before/after school care',
    },
    {
      id: 7,
      img: '../../../assets/images/Sports&recreation.jpg',
      alt: 'Sports & recreation',
      title: 'Sports & recreation',
    },
  ];

  ngOnInit(): void {
    this.getChild();
    if (this.localstorage.getKey('provider_return_text'))
      this.return_text = this.localstorage.getKey('provider_return_text');
    this.route.params.subscribe(params => {
      // this.navigate();
      this.provider_id = params['id'];
      this.searchDetails();

    });
  }

  onImgError(event: any) {
    event.target.src = '../../../../assets/images/placeholder.jpg';
  }
  navigate() {
    if (
      this.providerSelectedData == '' ||
      !this.providerSelectedData.provider
    ) {
      this.router.navigateByUrl('/preschool/result');
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

  sortData(sort: Sort) {
    const data = this.desserts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'calories':
          return compare(a.calories, b.calories, isAsc);
        case 'fat':
          return compare(a.fat, b.fat, isAsc);
        case 'carbs':
          return compare(a.carbs, b.carbs, isAsc);
        case 'protein':
          return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
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
        returnUrl: '/preschool/' + $event?.provider?.id,
      },
    });
  }

  isLoggedIn(type: any, event: any) {
    let isLoggedIn = this.localstorage.getUser();
    if (!isLoggedIn.user_type) {
      this.notification.showWarning(CustomAlertMessage.addFav[1].message);
      this.openLoginModal('signIn', event);
    }
    else if (isLoggedIn.user_type == 'PROVIDER') {
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
      if (type == 'favourite') {
        let param = {
          user_details: this.localstorage.getUser()?.userDetails_id,
          provider: event?.provider?.id,
          provider_category: event?.provider?.providercategory?.id,
          add_to_favourite: !this.isFavourite(event.favourite),
        };
        this.providerservice.updatefavourite(param).subscribe({
          next: (res: any) => {
            if (!res.data.length) {
              this.providerSelectedData.favourite = [res.data];
            }
            else
              this.providerSelectedData.favourite = res.data;

            if (param.add_to_favourite)
              this.notification.showSuccess(CustomAlertMessage.addFav[0].message);
            if (!param.add_to_favourite)
              this.notification.showSuccess(CustomAlertMessage.addFav[3].message);
          },
          error: (error: any) => {
            this.notification.showInfo(
              'Processing request'
            );
          },
        });
      }
      if (type == 'availablity') {
        this.Availablity(type);
      }
      if (type == 'openApplyOnlineModal') {
        this.openApplyOnlineModal(event, type);
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

  // Modal Section Start

  openApplyOnlineModal(i: any, event: any) {
    let data = this.providerSelectedData;
    this.userservice.setApplyOnlineData(data);
    const dialogRef = this.dialog.open(ApplyOnlineComponent, {
      width: '100% !important',
      // height: 'auto',
      panelClass: 'CustomModal',
      data: {
        modalType: event,
      },
    });
  }
  openMessageProvider(event: any, $event: any) {
    this.userservice.setApplyOnlineData($event);
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
    let data = this.providerSelectedData;
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
    let data = this.providerSelectedData;
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
  youtubeUrlChecker(url: any) {
    var match = url.match(this.urlRegex);
    let src: any = url;
    if (match && match[2].length == 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
      src = 'https://www.youtube.com/embed/' + match[2];
      src = this.sanitizer.bypassSecurityTrustResourceUrl(src);
      this.videoSrc = src;
    }
  }
  messageProvider(user: any) {
    this.messengerService.user = user;
    // this.router.navigate(['/user/message-center']);
  }

  Availablity(type: any) {
    const dialogRef = this.dialog.open(AvailabilityComponent, {
      width: '80vw',
      maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: type,
        data: this.providerSelectedData,
      },
    });
  }
  TuitionDetails(type: any) {
    const dialogRef = this.dialog.open(TutionFeeComponent, {
      // width: '80vw',
      // maxWidth: '700px',
      panelClass: 'CustomModal',
      // hasBackdrop: false,
      data: {
        modalType: type,
        data: this.providerSelectedData,
      },
    });
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
