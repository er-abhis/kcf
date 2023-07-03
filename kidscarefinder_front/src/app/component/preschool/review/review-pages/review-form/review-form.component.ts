
import { Component, Inject, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatSnackBar }
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ReviewFormComponent implements OnInit {
  @Input('rating') public rating: number = 0;
  @Input('starCount') public starCount: number = 5;
  @Input('color') public color: string = 'accent';
  @Output() public ratingUpdated = new EventEmitter();
  @Input('data') public data: any;

  public snackBarDuration: number = 2000;
  public ratingArr: any = [];
  constructor(private formBuilder: FormBuilder,
    private providerService: ProviderService,
    private localstorageService: LocalstorageService,
    private notification: NotificationService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    // private dialog: MatDialog,
  ) { }
  reviewForm = this.formBuilder.group({
    review: ['', Validators.required],
    rating: [0, Validators.required]

  });
  submitted: boolean = false;
  get r(): { [key: string]: AbstractControl } {
    return this.reviewForm.controls;
  }

  ngOnInit(): void {
    for (let i = 0; i < this.starCount; i++) {
      this.ratingArr.push(i);
    }
  }
  cancleModal() {
    this.ratingUpdated.emit('close');
    // this.dialog.closeAll();
  }
  postReeview() {
    this.submitted = true;
    if (!this.reviewForm.valid) {
      return
    }
    let obj = {
      "user": this.localstorageService.getUser()?.userDetails_id,
      "provider": this.data?.provider.id,
      "provider_category": this.data?.provider?.providercategory?.id,
      "rating": this.reviewForm.value?.rating,
      "review": this.reviewForm.value?.review,
      is_delete: false
    }
    this.providerService.postReview(obj).subscribe({
      next: (res: any) => {
        this.notification.showSuccess(CustomAlertMessage.addReview[0].message);
        this.ratingUpdated.emit('updated');
        // this.dialog.closeAll();
      },
      error: (error: any) => {
        if (error.error.errors?.non_field_errors[0]) {
          this.notification.showError(CustomAlertMessage.addReview[2].message)
        }
        else
          this.notification.showError('Some error occured')
        this.ratingUpdated.emit('error');
        // this.dialog.closeAll();
      },
    })
    // this.dialog.closeAll();

  }

  onClick(index: any, rating: number) {
    this.reviewForm.controls.rating.patchValue(rating);
    this.rating = rating;
    // this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
    //   duration: this.snackBarDuration
    // });
    setTimeout(() => {
      let currentInd = rating - 1


      if (this.rating >= index - 1) {
        return 'star';
      } else {
        // this.showIcon('star_border')
        return 'star_border';
      }
    }, 1500);


    // this.ratingUpdated.emit(rating);

    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }

  }

}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
