import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";

export interface DialogData {
  title?: string;
  titleClass?: 'centered-bold'
  content: string;
  videoSrc: string;
}

@Component({
  selector: 'app-customisable-dialog',
  templateUrl: './customisable-dialog.component.html',
  styleUrls: ['./customisable-dialog.component.scss']
})
export class CustomisableDialogComponent implements OnInit {

  checked = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }
}
