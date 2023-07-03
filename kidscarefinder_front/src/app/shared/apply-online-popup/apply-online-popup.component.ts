import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  AbstractControl,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
@Component({
  selector: 'app-apply-online-popup',
  templateUrl: './apply-online-popup.component.html',
  styleUrls: ['./apply-online-popup.component.scss']
})
export class ApplyOnlinePopupComponent implements OnInit {
  applyForm: any = FormGroup;
  ParentForm: any = FormGroup;
  GuardianForm: any = FormGroup;
  ChildForm: any = FormGroup;
  Familydescription: any = FormGroup;
  children: any;
  guardianInfo: any;
  provider: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private userservice: UserService,
    private localstorageService: LocalstorageService,
  ) { }
    getProviderInfo() {
    this.userservice.getProviderInfo({}, this.localstorageService.getUser().provider_id).subscribe({
      next: (data: any) => {
        this.provider = data?.data;
        let dataToPopulate = this.provider;

        this.applyForm.patchValue({
          providerInfo: {
            first_name:
              dataToPopulate.first_name + ' ' + dataToPopulate.last_name,
              desired_start_date: this.data?.Others[0]?.desired_start_date,
              program_applying: this.data?.Others[0]?.program_applying,
              enrollment_documentation: this.data?.Others[0]?.provider.enrollment_documentation == true?'true':'false'
          },
        });
      },
    });
  }

  ngOnInit(): void {
    this.initApplyOnlineForm();
    this.getProviderInfo()
    this.applyForm.patchValue({
      ParentForm: this.data.parent_1,
      GuardianForm: this.data?.Others[0]?.parent_2,
      ChildForm: this.data?.Others[0]?.child,
      Familydescription: this.data.parent_1.userDetails,
    })
    this.applyForm.patchValue({
      ParentForm: this.data.parent_1.userDetails
    })
    this.applyForm.controls.ParentForm.controls.address.patchValue(this.data.parent_1.address.street_address)
    this.applyForm.controls.ChildForm.controls.address.patchValue(this.data?.Others[0]?.child.address.street_address)
    this.applyForm.disable();
  }
  closeModal() {
    this.dialog.closeAll();
  }
  initApplyOnlineForm() {
    this.applyForm = new FormGroup({
      ParentForm: new FormGroup({
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        email: new FormControl(''),
        contact: new FormControl(''),
        address: new FormControl(''),
        occupation: new FormControl(''),
        employer_name: new FormControl(''),
        employer_address: new FormControl(''),
        employee_phone: new FormControl(''),
        gross_income: new FormControl(''),
      }),
      GuardianForm: new FormGroup({
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        email: new FormControl(''),
        phone_number: new FormControl(''),
        address: new FormControl(''),
        occupation: new FormControl(''),
        employer_name: new FormControl(''),
        employer_address: new FormControl(''),
        employee_phone: new FormControl(''),
        gross_income: new FormControl(''),
      }),
      ChildForm: new FormGroup({
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        date_of_birth: new FormControl(''),
        contact: new FormControl(''),
        address: new FormControl(''),
        tell_us_about_child: new FormControl(''),
        additional_info: new FormControl(''),
      }),
      Familydescription: new FormGroup({
        family_description: new FormControl(''),
      }),
      providerInfo: new FormGroup({
        first_name: new FormControl(''),
        desired_start_date: new FormControl(''),
        program_applying: new FormControl(''),
        enrollment_documentation: new FormControl(''),
      }),
    });
  }

}
