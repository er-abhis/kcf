import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-modal-tooltip',
  templateUrl: './modal-tooltip.component.html',
  styleUrls: ['./modal-tooltip.component.scss']
})
export class ModalTooltipComponent implements OnInit {
  private positionRelativeToElement!: ElementRef
  text: any;

  constructor(    @Inject(MAT_DIALOG_DATA) public options: { text: any, positionRelativeToElement: ElementRef },
  private dialog: MatDialog,
  private dialogRef: MatDialogRef<any>,
  private localStrService: LocalstorageService,
) { 

}
  ngOnInit(): void {
    this.positionRelativeToElement = this.options.positionRelativeToElement
    this.text = this.options.text
    const matDialogConfig = new MatDialogConfig()
    const rect: DOMRect = this.positionRelativeToElement.nativeElement.getBoundingClientRect()
    matDialogConfig.position = { left: `${rect.left}px`, bottom: `${rect.bottom}px`, right: `${rect.right}px`, top: `${rect.top}px` }
    this.dialogRef.updatePosition(matDialogConfig.position)
  }
  closeModal() {
    this.dialog.closeAll();
  }


}
