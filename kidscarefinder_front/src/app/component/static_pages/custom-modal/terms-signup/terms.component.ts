import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignInComponent } from 'src/app/component/sign-in/sign-in.component';
import { TermsProvider } from '../terms-provider/terms.component';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsUSer implements OnInit {

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef <SignInComponent>
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

  closeModal() {
    this.dialogRef.close();
  }

  openProviderTerms(event : any) {
    const dialogRef = this.dialog.open(TermsProvider, {
        width: '60vw',
        maxWidth: '600px',
        maxHeight: '800px',
        panelClass: 'CustomModal',
        hasBackdrop: false,
        autoFocus:false,
        data: {
            modalType: event
        }
    });
  }
}
