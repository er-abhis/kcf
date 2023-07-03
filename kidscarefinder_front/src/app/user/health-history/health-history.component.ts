import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import {
  monthNameArray,
  hourArray,
  minuteArray,
  formatArray,
  monthArray,
  daysArray,
  yearArray,
} from 'src/app/utills/constant/global.constants';
import { NotificationService } from 'src/app/utills/notification.service';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { MatRadioChange } from '@angular/material/radio';

import { Router } from '@angular/router';
import { CustomisableDialogComponent } from "../../component/customisable-dialog/customisable-dialog.component";
import { updateSlaveControlValidation } from './health-history-validation-helper';
import {UtilitiesService} from "../../utills/utilities.service";

@Component({
  selector: 'app-health-history',
  templateUrl: './health-history.component.html',
  styleUrls: ['./health-history.component.scss'],
})
export class HealthHistoryComponent implements OnInit {
  currentDate = new Date();
  childId: any;
  frequentCold: string[] = ['Yes', 'No'];
  sleep_during_day: string[] = ['Yes', 'No'];
  is_toilet: string[] = ['Yes', 'No'];
  underCareData: string[] = ['Yes', 'No'];
  bowelData: string[] = ['Yes', 'No'];
  prescribeData: string[] = ['Yes', 'No'];
  deviceData: string[] = ['Yes', 'No'];
  toiletData: string[] = ['Yes', 'No'];
  deviceHomeData: string[] = ['Yes', 'No'];

  public selectedValue: string | undefined;
  pastSelect: boolean = false;
  dobMaxDate = new Date(new Date().getFullYear(), 11, 31);

  stage1: any = false;
  stage2: any = false;
  // is_under_doctor_care: any = false;
  is_prescribe_medi: any = false;
  stage3: any = false;
  stage4: any = false;
  stage5: any = false;
  stage6: any = false;
  healthHistoryForm!: FormGroup;
  isChecked: any = [];
  isCheckedIllness: any = [];
  illnessTypes: any = [];
  selected_illness: any = [];
  getValue: any = [];
  unique: any = [];
  categoryAgeGroups: any = [];
  illnessData: any[] = [];
  selectedProvider: any = [];
  illness: any;
  showFrequentColds = false;
  showSleepDuringDay = false;
  children: any;
  monthArray: any = monthArray;
  hourArray: any = hourArray;
  minuteArray: any = minuteArray;
  formatArray: any = formatArray;
  monthNameArray: any = monthNameArray;
  daysArray: any = daysArray;
  range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  yearArray: number[] = this.range(2000, (new Date()).getFullYear(), 1);
  does_frequent_cold: any;
  does_sleep_during_day: any;
  is_toilet_trained: any;
  are_bowels_regular: any;
  is_under_doctor_care: any;
  does_prescribed_medicine: any;
  does_special_device: any;
  does_special_device_home: any;
  healthSubmitted = false;
  illessSelected: any = [];
  lastUpdatedOn: string = '';
  childCount: any;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private router: Router,
    private utilitiesService: UtilitiesService
  ) { }

  // visibility(type: any) {
  //   switch (type) {
  //     case 'stage1':
  //       this.stage1 = true;
  //       break;
  //     case 'stage2':
  //       this.stage2 = true;
  //       break;
  //     case 'stage3':
  //       this.stage3 = true;
  //       break;
  //     case 'stage4':
  //       this.stage4 = true;
  //       break;
  //     case 'stage5':
  //       this.stage5 = true;
  //       break;
  //     case 'stage6':
  //       this.stage6 = true;
  //       break;
  //
  //     default:
  //       break;
  //   }
  // }

  initHealthForm() {
    this.healthHistoryForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      father_domestic_partner_name: [],
      is_father_domestic_partner_live_with_child: [''],
      mother_domestic_partner_name: [],
      is_mother_domestic_partner_live_with_child: [''],
      is_under_supervision_physician: new FormControl('', [
        Validators.required,
      ]),
      last_med_exam: ['', [Validators.required]],
      other_illness_accident: ['', [Validators.required]],
      cold_last_year: ['', [Validators.required]],
      child_getup_time: ['', [Validators.required]],
      child_sleep_time: ['', [Validators.required]],
      does_sleep_well: ['', [Validators.required]],
      allergies: [],
      child_daysleep_time: [''],
      breakfast: ['', [Validators.required]],
      breakfast_time: ['', [Validators.required]],
      lunch: ['', [Validators.required]],
      lunch_time: ['', [Validators.required]],
      dinner: ['', [Validators.required]],
      dinner_time: ['', [Validators.required]],
      food_dislikes: ['', [Validators.required]],
      eating_problems: ['', [Validators.required]],
      toilet_trained_stage: [''],
      bowel_movement_stage: [''],
      word_for_bowel: ['', [Validators.required]],
      word_for_urination: ['', [Validators.required]],
      parent_eval_health: ['', [Validators.required]],
      parent_eval_personality: ['', [Validators.required]],
      get_along: ['', [Validators.required]],
      group_play_experience: ['', [Validators.required]],
      any_special_prob: ['', [Validators.required]],
      care_plan_for_illness: ['', [Validators.required]],
      reason_for_day_care: ['', [Validators.required]],
      doctor_care_stage: [''],
      special_device_stage: [''],
      special_device_home_stage: [''],
      prescribed_medicine_stage: [''],

      does_frequent_cold: ['', [Validators.required]],
      does_sleep_during_day: ['', [Validators.required, updateSlaveControlValidation('child_daysleep_time', 'Yes')]],
      is_toilet_trained: ['', [Validators.required, updateSlaveControlValidation('toilet_trained_stage', 'Yes')]],
      are_bowels_regular: ['', [Validators.required, updateSlaveControlValidation('bowel_movement_stage', 'Yes')]],
      is_under_doctor_care: ['', [Validators.required, updateSlaveControlValidation('doctor_care_stage', 'Yes')]],
      does_prescribed_medicine: ['', [Validators.required, updateSlaveControlValidation('prescribed_medicine_stage', 'Yes')]],
      does_special_device: ['', [Validators.required, updateSlaveControlValidation('special_device_stage', 'Yes')]],
      does_special_device_home: ['', [Validators.required, updateSlaveControlValidation('special_device_home_stage', 'Yes')]],

      //dropdown field
      walked_at: ['', [Validators.required]],
      talked_at: ['', [Validators.required]],
      toilet_training_started_at: ['', [Validators.required]],
      day_sleep_length: ['', [Validators.required]],

      pastillness: this.formBuilder.array([
        this.formBuilder.group({
          illness: [],
          month: [],
          year: [],
        }),
      ]),
    });
  }
  get u(): { [key: string]: AbstractControl } {
    return this.healthHistoryForm.controls;
  }

  ngOnInit(): void {
    this.initHealthForm();
    let token = this.localServ.getToken();
    // this.userService.getChild(token).subscribe({
    //   next: (data: any) => {
    //     this.children = data.data;
    //     let showChilds = false
    //     this.children.map((obj: { expected_due_date: any, date_of_birth: any }) => {
    //       if (obj.expected_due_date ) {
    //         showChilds = false;
    //       } if (obj.date_of_birth) {
    //         showChilds = true;
    //       }
    //     });
    //     if (!showChilds) {
    //       this.notification.showWarning('Add child first');
    //       setTimeout(() => {
    //         this.router.navigate(['user/profile']);
    //       }, 100);
    //     }
    //   },
    // });
    this.userService.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
        var childCount = 0;
        data.data.forEach((eml:any) => {
          if(eml.date_of_birth!=null){
            //pragenancy is present
            childCount++;
          }
        });

        if(childCount==0){
          this.notification.showWarning('Add child first');
          this.router.navigate(['user/profile']);
        }
      },
    });
    this.childDetails();
    this.getIllnessData();
    this.getUserPreference();
  }

  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference('show_health_history_notification');
    if (preference) {
      this.openDialog();
    }
  }

  pastSelectChange(evt: any) {
    this.pastSelect = evt.currentTarget.checked;
  }
  call(value: any) {

    this.initHealthForm();
    this.childId = value.split('|')[1];
    this.updateData(value.split('|')[0]);
  }
  childDetails() {
    let token = this.localServ.getToken();
    this.userService.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
      },
    });
  }
  getIllnessData() {
    this.userService.getData().subscribe({
      next: (data: any) => {
        this.illness = data;
        this.illnessData = this.illness.data;
        let newData = this.illnessData;
        this.getValue = newData.map((obj: { id: any }) => obj.id);
      },
    });
  }
  onSelected(item: any, event: any, type: any): void {
    // this.initHealthForm();
    // this.getCheckBoxStatus();

    if (
      this.illnessTypes.filter((e: { illness: any }) => e.illness === item.id)
        .length > 0
    ) {
      for (let i = 0; i <= this.illnessTypes.length - 1; i++) {
        if (this.illnessTypes[i].illness == item.id) {
          this.illnessTypes[i][type] = event.target.value;
        }
      }
    } else {
      this.illnessTypes.push({
        illness: item.id,
        childpregnancydetails: this.childId,
      });
    }

    if (event.target.checked == true) {
      this.isChecked.push(event.target.checked);
      this.selectedProvider.push(item.id);
    } else if (event.target.checked == false) {
      const index = this.selectedProvider.indexOf(item.id);
      if (index > -1) {
        this.selectedProvider.splice(index, 1);
      }
    }
  }
  async SubmitData() {
    this.healthSubmitted = true;
    if (this.healthHistoryForm.invalid) {
      this.notification.showError('Please fill all the mandatory fields.');
      return;
    }
    if (
      this.healthHistoryForm?.value?.mother_domestic_partner_name == '' ||
      this.healthHistoryForm?.value?.father_domestic_partner_name == ''
    ) {
      this.notification.showWarning('Please enter either parent details');
      return;
    }
    this.postHealth();
    // this.postIlness();

    // this.healthSubmitted = true;
    // if (
    //   this.healthHistoryForm?.value?.mother_domestic_partner_name == '' ||
    //   this.healthHistoryForm?.value?.father_domestic_partner_name == ''
    // ) {
    //   this.notification.showWarning('Please enter either parent details');
    //   return;
    // } else if (this.healthHistoryForm.invalid) {
    //   return;

    //   // this.notification.showSuccess(CustomAlertMessage.healthHistory[0].message);
    // } else {
    //
    //
    //
    //
    // }
  }

  updateData(index: any) {
    this.userService.getChild(this.healthHistoryForm).subscribe({
      next: (data) => {

        this.illessSelected = data.data[index].illness;

        if (data?.code && data?.code == 200) {
          if (data && data?.data) {
            let dataToPopulate = data?.data[index];
            this.lastUpdatedOn = moment(dataToPopulate.updated_at).format('MM/DD/YYYY');
            let newData = dataToPopulate.illness;

            this.selected_illness = newData.map(
              (obj: { illness: any }) => obj.illness
            );

            this.getCheckBoxStatus();

            this.healthHistoryForm.patchValue({
              first_name: dataToPopulate?.first_name,
              gender: dataToPopulate.gender,
              date_of_birth: dataToPopulate.date_of_birth,
              father_domestic_partner_name:
                dataToPopulate.father_domestic_partner_name
                  ? dataToPopulate.father_domestic_partner_name
                  : '',
              is_father_domestic_partner_live_with_child:
                dataToPopulate.is_father_domestic_partner_live_with_child,
              mother_domestic_partner_name:
                dataToPopulate.mother_domestic_partner_name,
              is_mother_domestic_partner_live_with_child:
                dataToPopulate.is_mother_domestic_partner_live_with_child,
              is_under_supervision_physician:
                dataToPopulate.is_under_supervision_physician,

              last_med_exam: dataToPopulate.last_med_exam,
              other_illness_accident: dataToPopulate.other_illness_accident,
              cold_last_year: dataToPopulate.cold_last_year,
              child_getup_time: dataToPopulate.child_getup_time,
              child_sleep_time: dataToPopulate.child_sleep_time,
              does_sleep_well: dataToPopulate.does_sleep_well,
              allergies: dataToPopulate.allergies,
              child_daysleep_time: dataToPopulate.child_daysleep_time,
              breakfast: dataToPopulate.breakfast,
              breakfast_time: dataToPopulate.breakfast_time,
              lunch: dataToPopulate.lunch,
              lunch_time: dataToPopulate.lunch,
              dinner: dataToPopulate.dinner,
              dinner_time: dataToPopulate.dinner_time,
              food_dislikes: dataToPopulate.food_dislikes,
              eating_problems: dataToPopulate.eating_problems,
              toilet_trained_stage: dataToPopulate.toilet_trained_stage,
              bowel_movement_stage: dataToPopulate.bowel_movement_stage,
              word_for_bowel: dataToPopulate.word_for_bowel,
              word_for_urination: dataToPopulate.word_for_urination,
              parent_eval_health: dataToPopulate.parent_eval_health,
              parent_eval_personality: dataToPopulate.parent_eval_personality,
              get_along: dataToPopulate.get_along,
              group_play_experience: dataToPopulate.group_play_experience,
              any_special_prob: dataToPopulate.any_special_prob,
              care_plan_for_illness: dataToPopulate.care_plan_for_illness,
              reason_for_day_care: dataToPopulate.reason_for_day_care,
              doctor_care_stage: dataToPopulate.doctor_care_stage,
              special_device_stage: dataToPopulate.special_device_stage,
              special_device_home_stage:
                dataToPopulate.special_device_home_stage,

              does_frequent_cold:
                dataToPopulate.does_frequent_cold == true ? 'Yes' : 'No',
              does_sleep_during_day:
                dataToPopulate.does_sleep_during_day == true ? 'Yes' : 'No',
              is_toilet_trained:
                dataToPopulate.is_toilet_trained == true ? 'Yes' : 'No',
              are_bowels_regular:
                dataToPopulate.are_bowels_regular == true ? 'Yes' : 'No',
              is_under_doctor_care:
                dataToPopulate.is_under_doctor_care == true ? 'Yes' : 'No',
              does_prescribed_medicine:
                dataToPopulate.does_prescribed_medicine == true ? 'Yes' : 'No',
              does_special_device:
                dataToPopulate.does_special_device == true ? 'Yes' : 'No',
              does_special_device_home:
                dataToPopulate.does_special_device_home == true ? 'Yes' : 'No',

              walked_at: dataToPopulate.walked_at,
              talked_at: dataToPopulate.talked_at,
              toilet_training_started_at:
                dataToPopulate.toilet_training_started_at,
              day_sleep_length: dataToPopulate.day_sleep_length,
              illness: this.selected_illness,
            });
          }
        }
      },
      error: (error: any) => { },
    });
  }
  getCheckBoxStatus() {
    var array: any = [];
    var idIndices = this.selected_illness;
    var newIllnessData = this.illnessData.filter(function (data) {
      if (idIndices.includes(data.id)) {
        return data;
      }
    });
    newIllnessData.forEach(function (item, index, arr) {
      array.push(item.id);
    });
    this.illnessData = this.illnessData.map(function (data) {
      if (array.includes(data.id)) {
        data.checked = true;
      }
      return data;
    });

    this.illessSelected.filter((e: any, i: any) => {
      if (e.month != '' && e.month != null) {
        this.illnessData[i].month = e.month;
        this.illnessData[i].year = e.year;
        this.illnessTypes.push({
          illness: e.illness,
          childpregnancydetails: this.childId,
          month: e.month,
          year: e.year,
        });
      } else {
        this.illnessData[i].checked = false;
      }
    });
  }
  postHealth() {
    let dataToSend = {
      id: this.childId,
      first_name: this.healthHistoryForm?.value?.first_name,
      gender: this.healthHistoryForm?.value?.gender,
      date_of_birth: moment(
        this.healthHistoryForm?.value?.date_of_birth
      ).format('MM-DD-YYYY'),
      father_domestic_partner_name:
        this.healthHistoryForm?.value?.father_domestic_partner_name,
      is_father_domestic_partner_live_with_child:
        this.healthHistoryForm?.value
          ?.is_father_domestic_partner_live_with_child,
      mother_domestic_partner_name:
        this.healthHistoryForm?.value?.mother_domestic_partner_name,
      is_mother_domestic_partner_live_with_child:
        this.healthHistoryForm?.value
          ?.is_mother_domestic_partner_live_with_child,
      is_under_supervision_physician:
        this.healthHistoryForm?.value?.is_under_supervision_physician,
      last_med_exam: moment(
        this.healthHistoryForm?.value?.last_med_exam
      ).format('MM-DD-YYYY'),
      other_illness_accident:
        this.healthHistoryForm?.value?.other_illness_accident,
      cold_last_year: this.healthHistoryForm?.value?.cold_last_year,
      child_getup_time: this.healthHistoryForm?.value?.child_getup_time,
      child_sleep_time: this.healthHistoryForm?.value?.child_sleep_time,
      does_sleep_well: this.healthHistoryForm?.value?.does_sleep_well,

      walked_at: this.healthHistoryForm?.value?.walked_at,
      toilet_training_started_at:
        this.healthHistoryForm?.value?.toilet_training_started_at,
      day_sleep_length: this.healthHistoryForm?.value?.day_sleep_length,
      talked_at: this.healthHistoryForm?.value?.talked_at,
      allergies: this.healthHistoryForm?.value?.allergies,

      child_daysleep_time: this.healthHistoryForm?.value?.child_daysleep_time,
      breakfast: this.healthHistoryForm?.value?.breakfast,
      breakfast_time: this.healthHistoryForm?.value?.breakfast_time,
      lunch: this.healthHistoryForm?.value?.lunch,
      lunch_time: this.healthHistoryForm?.value?.lunch_time,
      dinner: this.healthHistoryForm?.value?.dinner,
      dinner_time: this.healthHistoryForm?.value?.dinner_time,
      food_dislikes: this.healthHistoryForm?.value?.food_dislikes,
      eating_problems: this.healthHistoryForm?.value?.eating_problems,
      toilet_trained_stage: this.healthHistoryForm?.value?.toilet_trained_stage,
      bowel_movement_stage: this.healthHistoryForm?.value?.bowel_movement_stage,
      word_for_bowel: this.healthHistoryForm?.value?.word_for_bowel,
      word_for_urination: this.healthHistoryForm?.value?.word_for_urination,
      parent_eval_health: this.healthHistoryForm?.value?.parent_eval_health,

      parent_eval_personality:
        this.healthHistoryForm?.value?.parent_eval_personality,
      get_along: this.healthHistoryForm?.value?.get_along,
      group_play_experience:
        this.healthHistoryForm?.value?.group_play_experience,
      any_special_prob: this.healthHistoryForm?.value?.any_special_prob,
      care_plan_for_illness:
        this.healthHistoryForm?.value?.care_plan_for_illness,
      reason_for_day_care: this.healthHistoryForm?.value?.reason_for_day_care,
      doctor_care_stage: this.healthHistoryForm?.value?.doctor_care_stage,
      special_device_stage: this.healthHistoryForm?.value?.special_device_stage,
      special_device_home_stage:
        this.healthHistoryForm?.value?.special_device_home_stage,

      does_frequent_cold:
        this.healthHistoryForm?.value?.does_frequent_cold === 'Yes'
          ? true
          : false,
      does_sleep_during_day:
        this.healthHistoryForm?.value?.does_sleep_during_day === 'Yes'
          ? true
          : false,
      is_toilet_trained:
        this.healthHistoryForm?.value?.is_toilet_trained === 'Yes'
          ? true
          : false,
      are_bowels_regular:
        this.healthHistoryForm?.value?.are_bowels_regular == 'Yes'
          ? true
          : false,
      is_under_doctor_care:
        this.healthHistoryForm?.value?.is_under_doctor_care == 'Yes'
          ? true
          : false,
      does_prescribed_medicine:
        this.healthHistoryForm?.value?.does_prescribed_medicine == 'Yes'
          ? true
          : false,
      does_special_device:
        this.healthHistoryForm?.value?.does_special_device == 'Yes'
          ? true
          : false,
      does_special_device_home:
        this.healthHistoryForm?.value?.does_special_device_home == 'Yes'
          ? true
          : false,
    };
    let requestObj = this.prepareRequestObject();
    requestObj = {id: this.childId, ...requestObj, illness: this.illnessTypes};
    delete requestObj.pastillness;
    this.userService.postHealthHistory(requestObj).subscribe({
      next: (data) => {
        this.router.navigateByUrl('/user/profile').then(() => {});
      },
    });
  }

  postIlness() {
    this.userService.sendIllnessData(this.illnessTypes).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess('Success');
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      panelClass: ['customisable-dialog', ],
      data: {
        title: 'A health history needs to be completed for each child separately. Select the child you are completing enrollment for now and fill out the health history accordingly.',
        titleClass: 'centered-bold',
        content: 'type1',
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userService.userUpdate({ show_health_history_notification: false }).subscribe({
          next: (data: any) => {
            this.notification.showSuccess('Preferences saved Successfully');
          },
          error: (error: any) => {
            this.notification.showError('Failed to save preference.');
          },
        });
      }
    })
  }

  getCtrl(name: string): FormControl {
    const ctrl = this.healthHistoryForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  prepareRequestObject () {
    const requestObj = Object.assign({}, this.healthHistoryForm.value);
    requestObj.date_of_birth = this.utilitiesService.getFormattedDate(requestObj.date_of_birth, 'MM-DD-YYYY');
    requestObj.last_med_exam = this.utilitiesService.getFormattedDate(requestObj.last_med_exam, 'MM-DD-YYYY');
    requestObj.does_frequent_cold = requestObj.does_frequent_cold === 'Yes';
    requestObj.does_sleep_during_day = requestObj.does_sleep_during_day === 'Yes';
    requestObj.is_toilet_trained = requestObj.is_toilet_trained === 'Yes';
    requestObj.are_bowels_regular = requestObj.are_bowels_regular === 'Yes';
    requestObj.is_under_doctor_care = requestObj.is_under_doctor_care === 'Yes';
    requestObj.does_prescribed_medicine = requestObj.does_prescribed_medicine === 'Yes';
    requestObj.does_special_device = requestObj.does_special_device === 'Yes';
    requestObj.does_special_device_home = requestObj.does_special_device_home === 'Yes';
    return requestObj;
  }

  returnString(value: string) {

  }

  subString(str:any,start:number,last:number){
    return str.substring(start,last)
   }
   usLast(str:any){
     return this.subString(str,0,1).toUpperCase();
   }
   ucFirst(str:any){
     return str.substring(0,1).toUpperCase()+ str.substring(1,str.length).toLowerCase()
   }
}
