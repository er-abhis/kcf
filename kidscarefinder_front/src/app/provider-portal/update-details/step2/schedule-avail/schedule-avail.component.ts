import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { daysArray, hourArray, minuteArray, formatArray, scheduleTypes } from 'src/app/utills/constant/global.constants';

@Component({
  selector: 'app-schedule-avail',
  templateUrl: './schedule-avail.component.html',
  styleUrls: ['./schedule-avail.component.scss']
})
export class ScheduleAvailComponent implements OnInit {

  @Output() public moveToStep = new EventEmitter();
  pdfData: any;
  showYesBeforeCare: boolean = true;
  beforeAfterYesNextDet = ['3 Months', '6 Months', '12 Months'];
  beforeAfterYesDet: any[] = [{ key: true, value: 'Yes' }, { key: false, value: 'No' }];
  regularReviewData: any = [];
  afterCareReviewData: any = [];
  scheduleReviewFormGroup!: FormGroup;
  scheduleData: any;
  hourArray: any = hourArray;
  minuteArray: any = minuteArray;
  formatArray: any = formatArray;
  ageGroupCategories :any = [];
  scheduleTypes: any = scheduleTypes;
  public readonly INFANT = 'Infant';
  public readonly TODDLER = 'Toddler';
  public readonly PREK = 'Pre-K';
  public readonly PRESCHOOL = 'Preschool';
  programsOffers: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.initializeReviewScheduleForm();
    this.getScheuleReview();
  }

  initializeReviewScheduleForm() {
    this.scheduleReviewFormGroup = this._formBuilder.group({
      is_before_after_care: false,
      availability_now: false,
      is_full_time: false,
      is_part_time: false,
      is_full_days: false,
      is_half_days: false,
      not_applicable: false,
      is_infant: false,
      is_toddler: false,
      is_preschool: false,
      is_prek: false,
      morning_start_hour: '00',
      morning_start_minute: '00',
      morning_start_format: 'am',
      morning_end_hour: '00',
      morning_end_minute: '00',
      morning_end_format: 'am',
      afternoon_start_hour: '00',
      afternoon_start_minute: '00',
      afternoon_start_format: 'am',
      afternoon_end_hour: '00',
      afternoon_end_minute: '00',
      afternoon_end_format: 'am',
      start_time_hour: '00',
      start_time_minute: '00',
      start_time_format: 'am',
      end_time_hour: '00',
      end_time_minute: '00',
      end_time_format: 'am',
      observed_holiday_link: '',
      next_availability: [],
      ageGroup: this._formBuilder.array([]),
      prek_start_time_hour: '00',
      prek_start_time_minute: '00',
      prek_start_time_format: 'am',
      prek_end_time_hour: '00',
      prek_end_time_minute: '00',
      prek_end_time_format: 'am',

      preschool_start_time_hour: '00',
      preschool_start_time_minute: '00',
      preschool_start_time_format: 'am',
      preschool_end_time_hour: '00',
      preschool_end_time_minute: '00',
      preschool_end_time_format: 'am'
    })
  }


  handleUpload(fileInput: any) {
    fileInput.click();
  }

  handle(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file && file.name) {
        this.pdfData = file;
      }
    }
  }

  editSchedule(step: number) {
    this.moveToStep.emit(step);
  }

  getScheuleReview() {
    this.getSchedulesData();
    this.providerService.getProviderBasicInfo().subscribe({
      next: (data) => {
        this.scheduleData = data?.data;
        this.scheduleReviewFormGroup.patchValue({
          is_before_after_care: this.scheduleData?.is_before_after_care,
          availability_now: this.scheduleData?.availability_now,
          is_full_time: this.scheduleData?.is_full_time,
          is_part_time: this.scheduleData?.is_part_time,
          is_full_days: this.scheduleData?.is_full_days,
          is_half_days: this.scheduleData?.is_half_days,
          observed_holiday_link: this.scheduleData?.observed_holiday_link
        })
        this.showYesBeforeCare = this.scheduleData?.is_before_after_care;
        let availability = '';
        if (this.scheduleData?.availability_in_3_months) {
          availability = this.beforeAfterYesNextDet[0];
        } else if (this.scheduleData?.availability_in_6_months) {
          availability = this.beforeAfterYesNextDet[1];
        } else if (this.scheduleData?.availability_in_12_months) {
          availability = this.beforeAfterYesNextDet[2];
        }
        this.scheduleReviewFormGroup.patchValue({
          next_availability: availability
        });
      }
    });
    this.getAgeGroups();
  }

  getSchedulesData() {
    this.providerService.getProviderSchedule().subscribe((data: any) => {
      if (data && data?.data && data?.code == 200) {
        let regularRData = data?.data.filter((x: any) => x.schedule_type == 'Regular');
        const afterCare = data?.data.filter((x: any) => x.schedule_type != 'Regular');
        this.regularReviewData = this.getCommaSeperatedString(regularRData);
        this.afterCareReviewData = this.getCommaSeperatedString(afterCare);
      }
    });
  }

  getAgeGroups() {
    this.providerService.getProviderAgeGroups().subscribe({
      next: (data) => {
        if (data && data?.data && data?.code == 200) {
          // this.ageGroupCategories = data?.data.filter((x: any) => x?.agegroupcategory?.agegroupcategory == this.TODDLER || x?.agegroupcategory?.agegroupcategory == this.INFANT);
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

          this.scheduleReviewFormGroup.patchValue(this.patchNapData(infantData, toddlerData,prekData,preschoolData));
        }
      }, error: (error: any) => {
      }
    });
  }

  getCommaSeperatedString(data: any) {
    data.forEach((obj: any) => {
      let objData = this.getKeyByValue(obj);
      objData.forEach((item: any, index: number) => {
        objData[index] = item.replace(item[0], item[0].toUpperCase());
      });
      obj.daysString = objData.join(', ');
      obj.start_time_slot = this.providerService.twelveHourFormatFromTwentyFour(obj.start_time, 'all');
      obj.end_time_slot = this.providerService.twelveHourFormatFromTwentyFour(obj.end_time, 'all')
    });
    return data;
  }

  getKeyByValue(object: any) {
    return Object.keys(object).filter((key: string) => {
      if (daysArray.includes(key)) {
        return object[key] === true
      }
      return;
    });
  }

  getObjectByKey(key: string) {
    let resp: any = this.ageGroupCategories.find((x: any) => x?.agegroupcategory?.agegroupcategory == key);
    if (resp && Object.keys(resp).length !== 0) {
      return resp;
    }
    return null;
  }

  removeSchedule(scheduleType: string, id: number) {
    let type = scheduleTypes.find((x: any) => x.schedule_type == scheduleType);
    if (type && type.id) {
      this.providerService.deleteSchedule(type.id, id).subscribe((x: any) => {
        this.getSchedulesData();
      })
    }
  }

  patchNapData(infantData: any, toddlerData: any,prekData: any, preschoolData: any) {
    let resp = {
      is_infant: infantData.is_nap_time ? true : false,
      is_toddler: toddlerData.is_nap_time ? true : false,
      is_prek: prekData.is_nap_time ? true : false,
      is_preschool: preschoolData.is_nap_time ? true : false,
      not_applicable: !infantData.is_nap_time && !toddlerData.is_nap_time ? true : false,
      morning_start_hour: infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'hour') : null,
      morning_start_minute: infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'minutes') : null,
      morning_start_format: infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'format') : null,
      morning_end_hour: infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'hour') : null,
      morning_end_minute: infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'minutes') : null,
      morning_end_format: infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'format') : null,
      afternoon_start_hour: infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'hour') : null,
      afternoon_start_minute: infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'minutes') : null,
      afternoon_start_format: infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'format') : null,
      afternoon_end_hour: infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'hour') : null,
      afternoon_end_minute: infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'minutes') : null,
      afternoon_end_format: infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'format') : null,
      start_time_hour: toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'hour') : null,
      start_time_minute: toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'minutes') : null,
      start_time_format: toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'format') : null,
      end_time_hour: toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'hour') : null,
      end_time_minute: toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'minutes') : null,
      end_time_format: toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'format') : null,

      prek_start_time_hour: prekData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_start_time, 'hour') : null,
      prek_start_time_minute: prekData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_start_time, 'minutes') : null,
      prek_start_time_format: prekData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_start_time, 'format') : null,
      prek_end_time_hour: prekData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_end_time, 'hour') : null,
      prek_end_time_minute: prekData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_end_time, 'minutes') : null,
      prek_end_time_format: prekData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(prekData.morning_nap_end_time, 'format') : null,

      preschool_start_time_hour: preschoolData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_start_time, 'hour') : null,
      preschool_start_time_minute: preschoolData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_start_time, 'minutes') : null,
      preschool_start_time_format: preschoolData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_start_time, 'format') : null,
      preschool_end_time_hour: preschoolData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_end_time, 'hour') : null,
      preschool_end_time_minute: preschoolData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_end_time, 'minutes') : null,
      preschool_end_time_format: preschoolData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(preschoolData.morning_nap_end_time, 'format') : null,

    }

    return resp;
  }


}
