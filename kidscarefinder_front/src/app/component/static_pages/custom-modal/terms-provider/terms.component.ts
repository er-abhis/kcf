import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TermsUSer } from '../terms-signup/terms.component';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsProvider implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<TermsProvider>
  ) { }

  ngOnInit(): void {
  }
  onSubmitReason = new EventEmitter();
    submitUserReason(choice:boolean): void {
        if(choice == true){
          this.onSubmitReason.emit('accept');
        }
        else{
          this.onSubmitReason.emit('reject');
        }
        // this.dialog.getDialogById('')?.close();
        this.dialogRef.close();
    }

    openSignupTerms(event: any) {
      const dialogRef = this.dialog.open(TermsUSer, {
        width: '50%',
        panelClass: 'signupTermsPop',
        hasBackdrop: false,
        autoFocus:false,
        data: {
          modalType: event,
        },
      });
    }
  closeModal() {
    this.dialog.closeAll();
  }

  modalClose() {
    this.dialogRef.close();
  }

  openModal(){
    this.dialog.closeAll();
    this.router.navigate(['provider/step/1']);
  }
}
