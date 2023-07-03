import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { message } from 'src/app/utills/constant/message.constants';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-application-perfrences',
  templateUrl: './application-perfrences.component.html',
  styleUrls: ['./application-perfrences.component.scss']
})
export class ApplicationPerfrencesComponent implements OnInit {

  optionalForm!: FormGroup;
  constructor(private dialog: MatDialog, public _formBuilder: FormBuilder, private providerService: ProviderService,
    private notificationService: NotificationService,
    private localStrService: LocalstorageService
  ) { }

  ngOnInit(): void {
    this.getBasicInfo();
    this.initOptionalForm();

  }

  closeModal() {
    this.dialog.closeAll();
  }
  submitData() {
    let providerId = this.localStrService.getProviderId();

    this.providerService.saveProviderWebsiteInfo(this.optionalForm.value, providerId).subscribe({
      next: (data: any) => {

      }
    });
    this.closeModal();
  }
  initOptionalForm() {
    this.optionalForm = this._formBuilder.group({
      tell_us_about_family: [],
      tell_us_about_child: [],
      any_special_needs: [],
      occupation: [],
      employer_name: [],
      employer_address: [],
      employer_phone: [],
      annual_gross_income: [],
    });
  }
  getBasicInfo() {
    this.providerService.getProviderBasicInfo().subscribe((data) => {
      const dataInfo = data?.data;
      this.optionalForm.patchValue(dataInfo);
      // this.reviewForm.disable();
    })
  }
  // hideSidebar() {
  //   let leftPanel: any = document.getElementsByClassName('preferencePopup')[0];
  //   leftPanel.style.display = 'none';
  // }

}
