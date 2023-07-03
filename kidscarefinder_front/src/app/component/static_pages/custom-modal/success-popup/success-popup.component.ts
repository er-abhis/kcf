import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss']
})
export class SuccessPopupComponent implements OnInit {
  showLoader: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.dialog.closeAll();
  }

}
