import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tution-fee',
  templateUrl: './tution-fee.component.html',
  styleUrls: ['./tution-fee.component.scss']
})
export class TutionFeeComponent implements OnInit {

  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  private dialog: MatDialog,
) { }

  ngOnInit(): void {
  }
  goToLink(url: string){
    if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
}
    window.open(url);
}

  closeModal() {
    this.dialog.closeAll();
  }
}
