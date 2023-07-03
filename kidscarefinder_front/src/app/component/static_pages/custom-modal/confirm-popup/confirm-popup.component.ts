import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {
  @Output() public action = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef <ConfirmPopupComponent>,
  private dialog: MatDialog,
  
  ) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.dialogRef.close();
  }
  onAction(){
    this.action.emit(this.data.id);
    this.dialogRef.close();
  }


}
