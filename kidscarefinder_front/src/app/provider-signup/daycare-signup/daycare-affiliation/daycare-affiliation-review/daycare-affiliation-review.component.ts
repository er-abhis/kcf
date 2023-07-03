import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-daycare-affiliation-review',
  templateUrl: './daycare-affiliation-review.component.html',
  styleUrls: ['./daycare-affiliation-review.component.scss'],
})
export class DaycareAffiliationReviewComponent implements OnInit {
  stepCount: number = 0;
  is_religion_affliliation: boolean = false;
  is_other_language: boolean = false;
  is_tk12_program: boolean = false;
  is_affiliated_provider: boolean = false;
  stepsReligiousDetailsForm!: FormGroup;

  toppingListReligious: any = [];

  toppingListlanguage: any = [];
  affiliatedProvidersList: any = [];

  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificatioService: NotificationService
  ) {}

  ngOnInit(): void {
    this.stepsReligiousDetailsForm = this._formBuilder.group({
      religiousDrop: [],
      religious: [''],
      language: [''],
      languageDrop: [''],
      affiliatedProvider: [''],
      affiliatedProviderType: [''],
    });
    this.getReligions();
    this.getLanguages();
    this.getAffiliatedProvider();
    this.getAffiliation();
  }

  getReligions() {
    this.providerService.getReligions().subscribe((response: any) => {
      this.toppingListReligious = response.data;
    });
  }
  getAffiliatedProvider() {
    this.providerService
      .getAffiliatedprovider(localStorage.getItem('provider_id'))
      .subscribe({
        next: (res: any) => {
          res.data = res.data.map((item: any) => item.affiliated_provider);
          this.affiliatedProvidersList = res.data;
        },
        error: (error: any) => {},
      });
  }
  getLanguages() {
    this.providerService.getLanguages().subscribe((response: any) => {
      this.toppingListlanguage = response.data;
    });
  }

  getAffiliation() {
    this.providerService.saveAffiliation().subscribe({
      next: (data: any) => {
        this.is_religion_affliliation = data.data.is_religion_affliliation;
        this.is_other_language = data.data.is_other_language;
        this.is_tk12_program = data.data.is_tk12_program;
        this.is_affiliated_provider = data.data.is_affiliated_provider;

        let selectBoxVal = data.data.religion.map((x: any) => x.id);
        let selectBoxVal1 = data.data.language.map((x: any) => x.id);
        this.stepsReligiousDetailsForm.patchValue({
          religiousDrop: selectBoxVal,
          languageDrop: selectBoxVal1,
        });
      },
    });
  }
}
