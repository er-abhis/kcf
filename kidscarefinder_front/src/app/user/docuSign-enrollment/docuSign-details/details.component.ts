import { Component, Input, OnInit } from '@angular/core';
import { CustomisableDialogComponent } from "../../../component/customisable-dialog/customisable-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../../../services/rest-services/user.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public selectedVal = 1;
  stepCount: number = 0;
  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;
    if (this.selectedVal == 1) {
      this.getUserPreference();
    }
  }
  get selectedCurrentIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 1) {
      this.stepCount = + value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {
  }

  async ngOnInit() {

  }

  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference('show_enrollment_detail_notification');
    if (preference) {
      this.openDialog();
    }
  }

  // check validity of form on next click
  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0: return callback(true)
    }
  }
  postData() {
    let enrolledData = this.userService.getEnrolledItem();

    let dataToSend = {
      parent_1: enrolledData.parent_1.id,
      provider: enrolledData.provider.id,
      provider_category: enrolledData.provider_category.id,
      child: enrolledData.child.id,
      request_status: "Enrollment Started",
      isDeleted: "false"
    }
    this.userService.postApply(dataToSend).subscribe({
      next: (data) => {

      }
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      maxHeight: 675,
      maxWidth: 630,
      panelClass: ['customisable-dialog'],
      data: {
        title: 'Watch this short tutorial video on our online enrollment process for an overview of how to quickly and easily enroll electronically via Kids Care Finder',
        titleClass: 'centered-bold',
        content: 'type2',
        videoSrc: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userService.userUpdate({ show_enrollment_detail_notification: false });
      }
    })
  }

}

