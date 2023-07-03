import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-provider-url',
  templateUrl: './provider-url.component.html',
  styleUrls: ['./provider-url.component.scss']
})
export class ProviderUrlComponent implements OnInit {
  providerUrl: string = '';
  providerId: any;
  addressDetails: any;
  organizationName: any;
  private positionRelativeToElement: ElementRef

  constructor(    @Inject(MAT_DIALOG_DATA) public options: { positionRelativeToElement: ElementRef,addressDetails: any,organizationName: any },
  private dialog: MatDialog,
  private dialogRef: MatDialogRef<any>,
  private localStrService: LocalstorageService,
) { 
  this.positionRelativeToElement = options.positionRelativeToElement
  this.addressDetails = options.addressDetails;
  this.organizationName = options.organizationName;
}
  ngOnInit(): void {
    const matDialogConfig = new MatDialogConfig()
    const rect: DOMRect = this.positionRelativeToElement.nativeElement.getBoundingClientRect()

    matDialogConfig.position = { left: `${rect.left}px`, bottom: `${rect.bottom}px`, right: `${rect.right}px`, top: `${rect.top}px` }
    this.dialogRef.updatePosition(matDialogConfig.position)
    this.providerId = this.localStrService.getUser()?.provider_id;
    this.providerUrl = `${window.origin.split('//')[1]}/preschool/${this.addressDetails.state?.replaceAll(' ','')}/${this.addressDetails.city?.replaceAll(' ','')}/${this.organizationName?.replaceAll(' ','')}/${this.providerId}`
  }
  closeModal() {
    this.dialog.closeAll();
  }
  urlCopy(){
    this.localStrService.saveKey('provider_return_text','provider portal')
  }

}
