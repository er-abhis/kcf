import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmbox',
  templateUrl: './confirmbox.component.html',
  styleUrls: ['./confirmbox.component.scss']
})
export class ConfirmboxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmboxComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  confirm() {
    this.dialogRef.close('yes');
  }

  cancel() {
      this.dialogRef.close('no');
  }

  ngOnInit(): void {
  }

}
