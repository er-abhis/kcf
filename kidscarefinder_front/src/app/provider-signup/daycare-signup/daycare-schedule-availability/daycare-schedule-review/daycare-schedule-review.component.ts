import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { daysArray, hourArray, minuteArray, formatArray, scheduleTypes } from 'src/app/utills/constant/global.constants';

@Component({
  selector: 'app-daycare-schedule-review',
  templateUrl: './daycare-schedule-review.component.html',
  styleUrls: ['./daycare-schedule-review.component.scss']
})
export class DaycareScheduleReviewComponent implements OnInit {
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
  fileUrl: string = '';


  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.initializeReviewScheduleForm();
    this.getScheuleReview();
  }
  getProgramsOffered(){
    return this.programsOffers.filter((item: any) => item != this.INFANT )?.join('/ ')
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
      morning_start_hour: null,
      morning_start_minute: null,
      morning_start_format: null,
      morning_end_hour: null,
      morning_end_minute: null,
      morning_end_format: null,
      afternoon_start_hour: null,
      afternoon_start_minute: null,
      afternoon_start_format: null,
      afternoon_end_hour: null,
      afternoon_end_minute: null,
      afternoon_end_format: null,
      start_time_hour: null,
      start_time_minute: null,
      start_time_format: null,
      end_time_hour: null,
      end_time_minute: null,
      end_time_format: null,
      observed_holiday_web_link: '',
      next_availability: [],
      ageGroup: this._formBuilder.array([]),
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
          observed_holiday_web_link: this.scheduleData?.observed_holiday_web_link
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

          this.scheduleReviewFormGroup.patchValue(this.patchNapData(infantData, toddlerData));
        }
      }, error: (error: any) => {
      }
    });
  }

  getCommaSeperatedString(data: any) {
    data.forEach((obj: any) => {
      let objData = this.getKeyByValue(obj);
      objData.forEach((item: any, index: number) => {
       item =  item == 'thrusday'? 'thursday': item;
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

  patchNapData(infantData: any, toddlerData: any) {
    let resp: any = {
      is_infant: infantData.is_nap_time ? true : false,
      is_toddler: toddlerData.is_nap_time ? true : false,
      not_applicable: (infantData.morning_nap_start_time != null || toddlerData.morning_nap_start_time !=null) && !infantData.is_nap_time && !toddlerData.is_nap_time ? true : false,      
    }
    if(infantData.is_nap_time){
      resp.morning_start_hour = infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'hour') : null;
      resp.morning_start_minute = infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'minutes') : null;
      resp.morning_start_format = infantData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_start_time, 'format') : null;
      resp.morning_end_hour = infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'hour') : null;
      resp.morning_end_minute = infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'minutes') : null;
      resp.morning_end_format =infantData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.morning_nap_end_time, 'format') : null;
      resp.afternoon_start_hour = infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'hour') : null;
      resp.afternoon_start_minute = infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'minutes') : null;
      resp.afternoon_start_format = infantData.afternoon_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_start_time, 'format') : null;
      resp.afternoon_end_hour = infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'hour') : null;
      resp.afternoon_end_minute = infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'minutes') : null;
      resp.afternoon_end_format = infantData.afternoon_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(infantData.afternoon_nap_end_time, 'format') : null;
    }
    if(toddlerData.is_nap_time){
      resp.start_time_hour = toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'hour') : null;
      resp.start_time_minute = toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'minutes') : null;
      resp.start_time_format = toddlerData.morning_nap_start_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_start_time, 'format') : null;
      resp.end_time_hour = toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'hour') : null;
      resp.end_time_minute = toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'minutes') : null;
      resp.end_time_format = toddlerData.morning_nap_end_time ? this.providerService.twelveHourFormatFromTwentyFour(toddlerData.morning_nap_end_time, 'format') : null;
    }

    return resp;
  }
}
