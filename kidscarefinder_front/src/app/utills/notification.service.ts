import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmboxComponent } from 'src/app/shared/confirmbox/confirmbox.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService,private dialog : MatDialog) { }

  showSuccess(message:any){
      this.toastr.success(message,'',{toastClass:"success-custom"})
  }

  showError(message:any){
      this.toastr.error(message,'',{toastClass:"error-custom", enableHtml: true} )
  }

  showInfo(message:any){
      this.toastr.info(message, '',{toastClass:"info-custom"})
  }

  showWarning(message:any){
      this.toastr.warning(message,'',{toastClass:"warn-custom"})
  }

  showPopup(type: string,heading: string,confirmMsg: string,confirmButtonText: string,cancelBtnText: string,callBackFn: string){
    var popupPanelClass = type + 'popupbox';
    const dialogRef = this.dialog.open(ConfirmboxComponent, {
      panelClass: popupPanelClass,
      data: {
      heading : heading,
        confirmMsg: confirmMsg,
        confirmBtnText : confirmButtonText,
        cancelBtnText : cancelBtnText
      },
      });
      dialogRef.afterClosed().subscribe(res => {
        if(res == 'yes'){
          if(typeof callBackFn === "function"){
            // callBackFn();
          }
        }
      });
  }
}
