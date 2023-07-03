import { Component, OnInit } from '@angular/core';
import { CustomisableDialogComponent } from "../../component/customisable-dialog/customisable-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../../services/rest-services/user.service";
import { NotificationService } from "../../utills/notification.service";

@Component({
  selector: 'app-enrollment-details',
  templateUrl: './enrollment-details.component.html',
  styleUrls: ['./enrollment-details.component.scss']
})
export class EnrollmentDetailsComponent implements OnInit {

  constructor(
    private userService: UserService,
    private notification: NotificationService,
    public dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    await this.getUserPreference();
  }

  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference('show_enrollment_detail_notification');
    if (preference) {
      this.openDialog();
    }
  }



  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      // maxHeight: 675,
      // maxWidth: 630,
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
        this.userService.userUpdate({ show_enrollment_detail_notification: false }).subscribe({
          next: (data: any) => {
            this.notification.showSuccess('Preferences saved Successfully');
          },
          error: (error: any) => {
            this.notification.showError('Failed to save preference.');
          },
        });
      }
    })
  }
}
