import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SignInComponent } from 'src/app/component/sign-in/sign-in.component';
import { ProviderService } from 'src/app/services/rest-services/provider.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  preSchoolGroup!: FormGroup;
  licensedGroup!: FormGroup;
  basicInfoLicensedGroup!: FormGroup;
  licenseInfoGroup!: FormGroup;
  licenseWebGroup!: FormGroup;
  description!: FormGroup;
  mainSteppeGroup: any = FormGroup;
  provider: any;
  StepDetailPhoto: string[] = ['Yes', 'No'];

  constructor(
    private providerService: ProviderService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.initProviderForm();
  }

  ngOnInit(): void {
    this.getBasicInfoRecords();
  }

  initProviderForm() {
    this.mainSteppeGroup = this._formBuilder.group({
      first_name: [this.provider?.first_name],
      last_name: [this.provider?.last_name],
      email: [''],
      phone: [''],
      provider_type: [this.provider?.providercategory?.providercategory],
      organization_name: [this.provider?.organization_name],
      description: [''],
      website_link: [
        this.provider?.is_website
          ? this.provider?.website_link
          : 'Not Available',
      ],
      is_license: [''],
      ein: [this.provider?.license.ein],
      license_no: [this.provider?.license.license_no],
      issuing_agency: [this.provider?.license.issuing_agency],
      license_type: [this.provider?.license.license_type],
      cds_code: [this.provider?.license.cds_code],
      checkArray: [],
      address: [''],
    });
  }
  getBasicInfoRecords() {
    this.providerService.getProviderBasicInfo().subscribe({
      next: (data) => {
        this.provider = data.data;
        this.initProviderForm();

        if (data?.code && data?.code == 200 && data?.data) {
          this.preSchoolGroup.patchValue({
            organization_name: data?.data?.organization_name,
          });
          this.basicInfoLicensedGroup.patchValue({
            licensedInfo: data?.data?.is_license ? 'Yes' : 'No',
          });
          this.licenseInfoGroup.patchValue({
            license_id: data?.data?.license?.id,
          });
          this.licenseWebGroup.patchValue({
            website_link:
              data?.data?.website_link == 'False'
                ? ''
                : data?.data?.website_link,
            is_website: data?.data?.is_website ? 'Yes' : 'No',
          });
          this.description = data?.data?.description;
        }
      },
      error: (error: any) => {
      },
    });
  }
  changePassword() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '80vw',
      maxWidth: '900px',
      panelClass: 'CustomModal',
      data: {
        modalType: 'changePassword',
      },
    });
  }
}
