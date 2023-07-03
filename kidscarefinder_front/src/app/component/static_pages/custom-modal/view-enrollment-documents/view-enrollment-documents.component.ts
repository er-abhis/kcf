import { Dialog } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component,Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-enrollment-documents',
  templateUrl: './view-enrollment-documents.component.html',
  styleUrls: ['./view-enrollment-documents.component.scss']
})
export class ViewEnrollmentDocumentsComponent implements OnInit {

  constructor(
    private dialog: Dialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.dialog.closeAll();
  }

}
