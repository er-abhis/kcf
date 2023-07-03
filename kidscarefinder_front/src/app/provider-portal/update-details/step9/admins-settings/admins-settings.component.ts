import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';

@Component({
  selector: 'app-admins-settings',
  templateUrl: './admins-settings.component.html',
  styleUrls: ['./admins-settings.component.scss']
})
export class AdminsSettingsComponent implements OnInit {

  @Output() public moveToStep = new EventEmitter();
  administratorList: any = [];
  reviewForm!: FormGroup;
  onOfRadioBtns: any[] = [{ key: true, value: 'On' }, { key: false, value: 'Off' }];
  yesNoBtns: any[]= [{ key: true, value: 'Yes' }, { key: false, value: 'No' }];

  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.getAllProviders();
    this.getBasicInfo();
    this.initReviewForm();
  }

  initReviewForm() {
    this.reviewForm = this._formBuilder.group({
      waitlist_functionality: [],
      apply_online: [],
      online_template: [],
      enrollment_documentation: [],
      own_online_template_url: [],
      tell_us_about_family : [],
      tell_us_about_child: [],
      any_special_needs : [],
      occupation : [],
      employer_name: [],
      employer_address : [],
      employer_phone: [],
      annual_gross_income : []
    })
  }

  getAllProviders() {
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          this.administratorList = data?.data?.administrator;
        }
      }, error: (error: any) => {
      }
    });
  }

  getBasicInfo() {
    this.providerService.getProviderBasicInfo().subscribe((data) => {
      const dataInfo = data?.data;
      this.reviewForm.patchValue(dataInfo);
    })
  }

  addAdministrator() {
    this.moveToStep.emit(1);
  }


}
