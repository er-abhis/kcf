import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { SignInComponent } from '../../sign-in/sign-in.component';

import { ReviewFormComponent } from './review-pages/review-form/review-form.component';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
@Component({
  selector: 'kcf-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() data: any;
  addReview: boolean = false;
  @Input() reviewList: any;
  Array = Array;
  Math = Math;
  Number = Number;
  avgRating: any;
  @Output() public ratingUpdated = new EventEmitter();
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

  constructor(
    private localstorage: LocalstorageService,
    private notification: NotificationService,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {}

  isLoggedIn() {
    let isLoggedIn = this.localstorage.getUser();
    if (!isLoggedIn.user_type) {
      this.notification.showWarning(CustomAlertMessage.addFav[1].message);
      this.openLoginModal('signIn');
    } else if (isLoggedIn.user_type == 'PROVIDER') {
      this.notification.showWarning(CustomAlertMessage.addFav[2].message);
      this.openLoginModal('signIn');
    } else {
      this.addReview = true;
      // this.openModal();
    }
  }
  ngOnChanges() {
    if (this.reviewList.length) {
      this.getAvgRating();
    }
  }

  getAvgRating() {
    let ratings: any = this.reviewList.map((item: any) => item.rating);
    const average = (ratings: any[]) =>
      ratings.reduce((a, b) => a + b) / ratings.length;
    this.avgRating = average(ratings);
  }
  openLoginModal(event: any) {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      hasBackdrop: false,
      data: {
        modalType: event,
        returnUrl: '/preschool/' + this.data?.provider.id,
      },
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      width: '80vw',
      maxWidth: '80vw',
      panelClass: 'ReviewModal',
      backdropClass: 'cdk-overlay-transparent-backdrop',
      data: this.data,
    });
    const subscribeDialog = dialogRef.componentInstance.ratingUpdated.subscribe(
      (data) => {
        if (data) {
          this.ratingUpdated.emit('updated');
        }
      }
    );
  }
  reviewChange(event: any) {
    this.addReview = false;
    this.ratingUpdated.emit('updated');
  }

  ngOnInit(): void {}

  onImgError(event: any) {
    event.target.src = '../../../../assets/images/placeholder.jpg';
  }
}
