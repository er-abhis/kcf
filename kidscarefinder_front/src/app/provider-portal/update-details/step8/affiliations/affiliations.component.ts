import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';


@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliations.component.html',
  styleUrls: ['./affiliations.component.scss']
})
export class AffiliationsComponent implements OnInit {

  stepCount: number = 0;
  is_religion_affliliation:boolean = false;
  is_other_language:boolean = false;
  is_tk12_program:boolean = false;
  is_affiliated_provider:boolean = false;
  stepsReligiousDetailsForm!: FormGroup;

  toppingListReligious = [
    { id: 5, value: 'Buddhist' },
    { id: 1, value: 'Catholic' },
    { id: 6, value: 'Islamic' },
    { id: 2, value: 'Lutheran' },
    { id: 3, value: 'Methodist' },
    { id: 4, value: 'Unorthodox' },
  ]

  toppingListlanguage = [
    { id: 1, value: 'Spanish' },
    { id: 2, value: 'French' },
    { id: 3, value: 'Russian' },
    { id: 4, value: 'Cantonese' },
    { id: 5, value: 'Mandrain' },
    { id: 6, value: 'Korean' },
  ];


  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificatioService: NotificationService
  ) { }

  ngOnInit(): void {
    this.stepsReligiousDetailsForm = this._formBuilder.group({
      religiousDrop: [],
      religious : [''],
      language : [''],
      languageDrop : [''],
      affiliatedProvider : [''],
      affiliatedProviderType : [''],
    });
    this.getAffiliation();
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
        })
      },
    });
  }

}
