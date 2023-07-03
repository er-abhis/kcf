import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { API } from 'src/app/utills/constant/api.constant';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-teacher-child',
  templateUrl: './teacher-child.component.html',
  styleUrls: ['./teacher-child.component.scss']
})
export class TeacherChildComponent implements OnInit {
  isAgegroupcategory: number = 0;
  isId: number = 0;
  stepCount: number = 0;
  // teacher_to_child_ratio = new FormControl('');
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

  // toppingList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  toppingList = [...Array(40).keys()].map((i) => {
    return i < 10 ? '0' + (i + 1) : i + 1;
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

  ngOnInit(): void {
    this.getProviderAgeGroup();
    this.getAgeGroup();
  }

  stepsChildMeslsDetailsForm = this._formBuilder.group({
    agegroupcategory: [],
    infant_teacher_to_child_ratio: [],
    toddler_teacher_to_child_ratio: [],
    preschool_teacher_to_child_ratio: [],
    prek_teacher_to_child_ratio: [],
  });

  getAgeGroup() {
    this.providerService.getAddressDetails().subscribe({
      next: (data: any) => {
        for (let i = 0; i <= data.length - 1; i++) {
          if (data[i].agegroupcategory.agegroupcategory == 'Preschool') {
            this.preSchoolId = data[i].id;
            this.preSchoolcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Infant') {
            this.infantId = data[i].id;
            this.infantcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Toddler') {
            this.toddlerlId = data[i].id;
            this.toddlerlcatId = data[i].agegroupcategory.id;
          } else if (data[i].agegroupcategory.agegroupcategory == 'Pre-k') {
            this.pre_kId = data[i].id;
            this.pre_kcatId = data[i].agegroupcategory.id;
          }
        }
      },
    });
  }
  getObjectByKey(key: string) {
    let resp: any = this.ageGroupCategories.find((x: any) => x?.agegroupcategory?.agegroupcategory == key);
    if (resp && !this.isEmpty(resp)) {
      return resp;
    }
    return null;
  }
  isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
  }

  getProviderAgeGroup() {
    this.providerService.getProviderAgeGroups().subscribe({
      next: (data) => {
        this.ageGroupCategories = data?.data;
        let toddlerData = this.getObjectByKey(this.TODDLER);
        let infantData = this.getObjectByKey(this.INFANT);
        let preschoolData = this.getObjectByKey(this.PRESCHOOL);
        let prekData = this.getObjectByKey(this.PREK);
        this.programsOffers = [];
        if(toddlerData?.is_present){
          this.programsOffers.push(this.TODDLER)
        }
        if(infantData?.is_present){
          this.programsOffers.push(this.INFANT)
        }
        if(preschoolData?.is_present){
          this.programsOffers.push(this.PRESCHOOL)
        }
        if(prekData?.is_present){
          this.programsOffers.push(this.PREK)
        }
      },
    });
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (
          !this.stepsChildMeslsDetailsForm.value
            .infant_teacher_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value
            .toddler_teacher_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value
            .preschool_teacher_to_child_ratio &&
          !this.stepsChildMeslsDetailsForm.value.prek_teacher_to_child_ratio
        ) {
          this.notificationService.showWarning('Please Select option');
          return callback(false);
        }
        let dataToSend = [
          {
            teacher_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'infant_teacher_to_child_ratio'
            )?.value,
            id: this.infantId,
            agegroupcategory: this.infantcatId,
            provider: localStorage.getItem('provider_id'),
          },
          {
            teacher_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'toddler_teacher_to_child_ratio'
            )?.value,
            id: this.toddlerlId,
            agegroupcategory: this.toddlerlcatId,
            provider: localStorage.getItem('provider_id'),
          },
          {
            teacher_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'prek_teacher_to_child_ratio'
            )?.value,
            id: this.pre_kId,
            agegroupcategory: this.pre_kcatId,
            provider: localStorage.getItem('provider_id'),
          },
          {
            teacher_to_child_ratio: this.stepsChildMeslsDetailsForm.get(
              'preschool_teacher_to_child_ratio'
            )?.value,
            id: this.preSchoolId,
            agegroupcategory: this.preSchoolcatId,
            provider: localStorage.getItem('provider_id'),
          },
        ];

        try {
          this.providerService.teacherChild(dataToSend).subscribe({
            next: (data: any) => {
              const resData: any = data;
              if (this.stepsChildMeslsDetailsForm.invalid) {
                this.notificationService.showWarning('Kindly select first');
                return callback(false);
              } else if (this.stepsChildMeslsDetailsForm.valid) {
                // this.notificationService.showSuccess(
                //   'Update Successfully ' + resData.status
                // );
              }
            },
            error: (error: any) => {
              if (error?.error.errors) {
                // this.notificationService.showWarning(error?.error.errors);
                this.notificationService.showSuccess('Successfully Updated');
                return callback(false);
              }
            },
          });
        } catch (error) {
          this.notificationService.showWarning(
            'Some error Occoured in saving data. Please try after some time'
          );
        }
        return callback(true);
    }
  }

}
