import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-daycare-teacher-to-adult',
  templateUrl: './daycare-teacher-to-adult.component.html',
  styleUrls: ['./daycare-teacher-to-adult.component.scss'],
})
export class DaycareTeacherToAdultComponent implements OnInit {
  isAgegroupcategory: number = 0;
  isId: number = 0;
  stepCount: number = 0;
  isTeacherChild: any;
  preSchoolId: any;
  selectedVal = 6;
  pre_kId: any;
  infantId: any;
  toddlerlId: any;
  pre_kcatId: any;
  toddlerlcatId: any;
  infantcatId: any;
  preSchoolcatId: any;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }
  ageGroupCategories = [];
  programsOffers: any = [];

  public readonly INFANT = 'Infant';
  public readonly TODDLER = 'Toddler';
  public readonly PREK = 'Pre-K';
  public readonly PRESCHOOL = 'Preschool';

  toppingList = [...Array(40).keys()].map((i) => {
    return i + 1;
  });
  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 6) {
      this.stepCount = +value;
      this.getProviderAgeGroup();
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  stepsChildMeslsDetailsForm = this._formBuilder.group({
    agegroupcategory: [],
    infant_adult_to_child_ratio: [],
    toddler_adult_to_child_ratio: [],
    preschool_adult_to_child_ratio: [],
    prek_adult_to_child_ratio: [],
  });

  getObjectByKey(key: string) {
    let resp: any = this.ageGroupCategories.find(
      (x: any) => x?.agegroupcategory?.agegroupcategory == key
    );
    if (resp && !this.isEmpty(resp)) {
      return resp;
    }
    return null;
  }
  isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
  }

  getProviderAgeGroup() {
    this.providerService.getdaycareteachersAdult().subscribe({
      next: (res) => {
        console.log('called', res);
        let data = res.data;
        for (let i = 0; i <= data.length - 1; i++) {
          let tcr = null;
          if (data[i].adult_to_child_ratio != null) {
            tcr = data[i].adult_to_child_ratio;
          }
          if (data[i].agegroupcategory.agegroupcategory == 'Preschool') {
            this.preSchoolId = data[i].id;
            if (data[i].is_present)
              this.stepsChildMeslsDetailsForm.controls.preschool_adult_to_child_ratio.patchValue(
                tcr
              );
            this.preSchoolcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Infant') {
            this.infantId = data[i].id;
            if (data[i].is_present)
              this.stepsChildMeslsDetailsForm.controls.infant_adult_to_child_ratio.patchValue(
                tcr
              );
            this.infantcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Toddler') {
            this.toddlerlId = data[i].id;
            if (data[i].is_present)
              this.stepsChildMeslsDetailsForm.controls.toddler_adult_to_child_ratio.patchValue(
                tcr
              );
            this.toddlerlcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Pre-K') {
            this.pre_kId = data[i].id;
            if (data[i].is_present)
              this.stepsChildMeslsDetailsForm.controls.prek_adult_to_child_ratio.patchValue(
                tcr
              );
            this.pre_kcatId = data[i].agegroupcategory.id;
          }
        }
        this.ageGroupCategories = data;
        let toddlerData = this.getObjectByKey(this.TODDLER);
        let infantData = this.getObjectByKey(this.INFANT);
        let preschoolData = this.getObjectByKey(this.PRESCHOOL);
        let prekData = this.getObjectByKey(this.PREK);
        this.programsOffers = [];
        if (toddlerData?.is_present) {
          this.programsOffers.push(this.TODDLER);
        }
        if (infantData?.is_present) {
          this.programsOffers.push(this.INFANT);
        }
        if (preschoolData?.is_present) {
          this.programsOffers.push(this.PRESCHOOL);
        }
        if (prekData?.is_present) {
          this.programsOffers.push(this.PREK);
        }
      },
    });
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (
          !this.stepsChildMeslsDetailsForm.value.infant_adult_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value.toddler_adult_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value
            .preschool_adult_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value.prek_adult_to_child_ratio
        ) {
          this.notificationService.showError(
            CustomAlertMessage.ratio[0].message
          );
          return callback(false);
        }
        let dataToSend = [
          {
            adult_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'infant_adult_to_child_ratio'
            )?.value,
            id: this.infantId,
            agegroupcategory: this.infantcatId,
            daycarecenter: localStorage.getItem('provider_id'),
          },
          {
            adult_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'toddler_adult_to_child_ratio'
            )?.value,
            id: this.toddlerlId,
            agegroupcategory: this.toddlerlcatId,
            daycarecenter: localStorage.getItem('provider_id'),
          },
          {
            adult_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'prek_adult_to_child_ratio'
            )?.value,
            id: this.pre_kId,
            agegroupcategory: this.pre_kcatId,
            daycarecenter: localStorage.getItem('provider_id'),
          },
          {
            adult_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'preschool_adult_to_child_ratio'
            )?.value,
            id: this.preSchoolId,
            agegroupcategory: this.preSchoolcatId,
            daycarecenter: localStorage.getItem('provider_id'),
          },
        ];
        if (this.stepsChildMeslsDetailsForm.invalid) {
          this.notificationService.showWarning('Kindly select first');
          return callback(false);
        }
        return this.providerService.daycareteachersAdult(dataToSend).subscribe({
          next: (data: any) => {
            const resData: any = data;
            return callback(true);
          },
          error: (error: any) => {
            if (error?.error.errors) {
              return callback(false);
            }
          },
        });
      default:
        return callback(true);
    }
  }
}
