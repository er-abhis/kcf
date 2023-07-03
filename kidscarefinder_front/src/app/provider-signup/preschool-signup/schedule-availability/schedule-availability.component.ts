import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Output, OnInit, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { hourArray, minuteArray, formatArray } from 'src/app/utills/constant/global.constants';
import { message } from 'src/app/utills/constant/message.constants';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'provider-step-two-component',
  templateUrl: './schedule-availability.component.html',
  styleUrls: ['./schedule-availability.component.scss']
})
export class ScheduleAvailabilityComponent implements OnInit {
  @Output() public moveToNextStep = new EventEmitter();
  stepCount: number = 0;
  Message = message;
  fileUrl: any = null;
  daysObj:any = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thrusday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
  }
  spaceAvailableINPUT: boolean = false;
  spaceAvailableThreeMonths: boolean = false;
  spaceAvailableSixMonths: boolean = false;
  spaceAvailableTwelveMonths: boolean = false;
  hourArray: any = hourArray;
  endHourArray: any = hourArray;
  minuteArray: any = minuteArray;
  formatArray: any = formatArray;
  hourArrayAfterBefore: any = [this.hourArray];
  amPmAfterBefore: any = [['am','pm']];
  disableAddBtn: boolean = false;
  providerId: number = 0;
  public selectedVal = 2;
  scheduleTypes = ['After', 'Before'];
  ageGroupCategories = [];
  availableNowYes: string[] = ['Yes', 'No'];
  beforeAfterYes: string[] = ['Yes', 'No'];
  daysDuplicate: any = [];
  beforeAfterCare: boolean = false;
  beforeAfterCareGroup!: FormGroup;
  availabileNowFormGroup!: FormGroup;
  observedHolidayFormGroup!: FormGroup;
  scheduleAvailable!: FormGroup;
  napFormGroup!: FormGroup;
  timeFormGroup!: FormGroup;
  ageGroupCategory: any = [];
  programsOffers: any = [];
  formSubmitted: boolean = false;
  step5Submitted: boolean = false;
  pdfData: any;
  observed_holiday_pdf_link = '';
  urlRegex="^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
  public readonly INFANT = 'Infant';
  public readonly TODDLER = 'Toddler';
  public readonly PREK = 'Pre-K';
  public readonly PRESCHOOL = 'Preschool';
  scheduleData: any;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 2) {
      this.stepCount = + value;
      this.getRecordForSteps(value);
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }


  constructor(
    private _formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef, private http: HttpClient, private providerService: ProviderService, private notificationService: NotificationService,
    private localStrService: LocalstorageService
  ) { }


  ngOnInit(): void {
    this.providerId = this.localStrService.getUser()?.provider_id;
    this.intializeScheuleForm();
    this.initializeTimeForm();
    this.intializeNapForm();
    this.intializeObservedHolidayForm();
  }

  getProgramsOffered(){
    return this.programsOffers.filter((item: any) => item != this.INFANT )?.join('/ ')
  }

  intializeNapForm() {
    this.napFormGroup = this._formBuilder.group({
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
      observed_holiday_pdf_link: '',
    })
  }

  initializeTimeForm() {
    this.timeFormGroup = this._formBuilder.group({
      is_full_time: false,
      is_part_time: false,
      is_full_days: false,
      is_half_days: false
    });
  }

  intializeAvailableForm() {
    this.availabileNowFormGroup = this._formBuilder.group({
      availability_now: [null,Validators.required],
      availability_in_3_months: [null],
      availability_in_6_months: [null],
      availability_in_12_months: [null],
      ageGroup: this._formBuilder.array([])
    });
  }

  intializeBeforeAfterCareForm() {
    this.beforeAfterCareGroup = this._formBuilder.group({
      scheduleAvailability: this._formBuilder.array([]),
      is_before_after_care: ['', Validators.required]
    });
    this.addPreschoolAvailable(true);
  }

  intializeScheuleForm() {
    this.scheduleAvailable = this._formBuilder.group({
      scheduleAvailability: this._formBuilder.array([]),
    });
    this.addPreschoolAvailable();
  }
  intializeObservedHolidayForm() {
    this.observedHolidayFormGroup = this._formBuilder.group({
      observed_holiday_web_link: ['',Validators.pattern(new RegExp(this.urlRegex,"i"))],
    });
  }

  get o(): { [key: string]: AbstractControl } {
    return this.observedHolidayFormGroup.controls;
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

  availableNowChange(event: MatRadioChange) {
    if (event.value === 'Yes') {
      this.spaceAvailableINPUT = true;
      this.spaceAvailableThreeMonths = false;
      this.spaceAvailableSixMonths = false;
      this.spaceAvailableTwelveMonths = false;
      this.availabileNowFormGroup.controls['availability_in_3_months'].setValidators(null)
      this.availabileNowFormGroup.controls['availability_in_3_months'].updateValueAndValidity();
      this.availabileNowFormGroup.controls['availability_in_6_months'].setValidators(null)
      this.availabileNowFormGroup.controls['availability_in_6_months'].updateValueAndValidity();
      this.availabileNowFormGroup.controls['availability_in_12_months'].setValidators(null)
      this.availabileNowFormGroup.controls['availability_in_12_months'].updateValueAndValidity();

    } else {
      this.spaceAvailableINPUT = false;
      this.availabileNowFormGroup.controls['availability_in_3_months'].setValidators(Validators.required)
      this.availabileNowFormGroup.controls['availability_in_3_months'].updateValueAndValidity();
      this.spaceAvailableThreeMonths = true;
    }
  }

  radioChange(event: MatRadioChange, data: any) {
    if (data === 'Yes')
      this.beforeAfterCare = true;
    else
      this.beforeAfterCare = false;
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0: {
        let { isValid, message, data } = this.checkValidityAndFormatData(this.scheduleAvailable.value.scheduleAvailability);
        if (!isValid) {
          this.notificationService.showError(CustomAlertMessage.startEndTime[0].message);
          return callback(false);
        }
        let schedule = <FormArray>this.scheduleAvailable.controls['scheduleAvailability'];
        schedule.value.map((control:any) => {
          let keys = Object.keys(this.daysObj);
          keys.map((key: any)=>{
            if(control[key]== true)
            this.daysObj[key]++
          })
        })
        if(Object.values(this.daysObj).some((el: any) => el > 1))
        {
          this.notificationService.showError(this.Message.scheduleExits)
          Object.keys(this.daysObj).forEach(v => this.daysObj[v] = 0)
          return callback(false);
        }
        Object.keys(this.daysObj).forEach(v => this.daysObj[v] = 0)

        return this.providerService.addProviderSchedule(data).subscribe({
          next: (data) => {
            if (data?.code && data?.code == 200) {
              callback(true);
            } else {
              callback(false);
            }
          }, error: (error: any) => {
            // this.notificationService.showError(error?.error?.errors?.error)
            this.notificationService.showError(CustomAlertMessage.startEndTime[1].message);
            callback(false);
          }
        });
      }
      case 1:
        if(!this.beforeAfterCareGroup.value.is_before_after_care){
          this.notificationService.showWarning('Please select one option')
          return               callback(false);
        }
        if (this.beforeAfterCareGroup.value.is_before_after_care == 'Yes') {
          let { isValid, message, data } = this.checkValidityAndFormatData(this.beforeAfterCareGroup.value.scheduleAvailability);
          if (!isValid) {
            this.notificationService.showError(CustomAlertMessage.startEndTime[0].message);

            return callback(false);
          }
          let schedule = <FormArray>this.beforeAfterCareGroup.controls['scheduleAvailability'];
          schedule.value.map((control:any) => {
            let keys = Object.keys(this.daysObj);
            keys.map((key: any)=>{
              if(control[key]== true)
              this.daysObj[key]++
            })
          })
          if(Object.values(this.daysObj).some((el: any) => el > 1))
          {
            this.notificationService.showError(this.Message.scheduleExits)
            Object.keys(this.daysObj).forEach(v => this.daysObj[v] = 0)
            return callback(false);
          }
          Object.keys(this.daysObj).forEach(v => this.daysObj[v] = 0)

          return this.providerService.addProviderSchedule(data).subscribe({
            next: (data) => {
              if (data?.code && data?.code == 200) {
                this.providerService.saveProviderWebsiteInfo({ is_before_after_care: this.beforeAfterCareGroup.value.is_before_after_care == 'Yes' ? true : false }, this.providerId).subscribe((x) => {
                  callback(true);
                })
              } else {
                callback(false);
              }
            }, error: (error: any) => {
              // this.notificationService.showError(error?.error?.errors?.error)
              this.notificationService.showError(CustomAlertMessage.startEndTime[1].message);
              callback(false);
            }
          });
        }
        this.providerService.saveProviderWebsiteInfo({ is_before_after_care: this.beforeAfterCareGroup.value.is_before_after_care == 'Yes' ? true : false }, this.providerId).subscribe((x) => {
        })
        return callback(true);
        break;
      case 2:
        this.formSubmitted = true;
        if(this.spaceAvailableINPUT){
          let spaceAvailable : boolean = false;
          this.availabileNowFormGroup.value.ageGroup.forEach((el: any) => {
            if(el.available_seats && el.is_present){
              spaceAvailable = true;
            }
          });
          if(!spaceAvailable){
            this.notificationService.showWarning(CustomAlertMessage.availability[1].message)
            return callback(false);
          }
        }
        if (!this.availabileNowFormGroup.valid) {
          this.notificationService.showWarning(CustomAlertMessage.availability[0].message)

          return callback(false);
        }


        let sendata: any = {
          availability_now: this.availabileNowFormGroup?.value?.availability_now == 'Yes' ? true : false,
          availability_in_3_months: this.availabileNowFormGroup?.value?.availability_in_3_months == 'Yes' ? true : false,
          availability_in_6_months: this.availabileNowFormGroup?.value?.availability_in_6_months == 'Yes' ? true : false,
          availability_in_12_months: this.availabileNowFormGroup?.value?.availability_in_12_months == 'Yes' ? true : false
        }
        this.saveProviderInfo(sendata, this.providerId);

        return this.providerService.saveProviderAgeGroup(true, this.availabileNowFormGroup.value.ageGroup).subscribe({
          next: (data) => {
            if (data?.code && data?.code == 200) {
              callback(true);
            } else {
              callback(false);
            }
          }, error: (error: any) => {
            this.notificationService.showError(error?.error?.errors?.error)

            callback(false);
          }
        })
        break;
      case 3:
          if(!Object.values(this.timeFormGroup.value).includes(true)){
            this.notificationService.showWarning(CustomAlertMessage.scheduleOffer[0].message)
            return callback(false)
          }
        this.saveProviderInfo(this.timeFormGroup.value, this.providerId);
        break;
      case 4: {
        let { isValid, message, sendData } = this.formatNapTimeValue(this.napFormGroup.value);
        if (!isValid) {
          this.notificationService.showError(CustomAlertMessage.scheduleOffer[1].message);

          return callback(false)
        }

        return this.providerService.saveProviderAgeGroup(true, sendData).subscribe({
          next: (data) => {
            if (data?.code && data?.code == 200) {
              callback(true);
            } else {
              callback(false);
            }
          }, error: (error: any) => {
            this.notificationService.showError(error?.error?.errors?.error)
            callback(false);
          }
        })
      }
      case 5:
        this.step5Submitted = true;
        if(this.observedHolidayFormGroup.invalid){
          return callback(false);
        }
        let obj : any = {
          observed_holiday_pdf_link : null,
          observed_holiday_web_link : null
        }
        if(this.pdfData){
          return this.providerService.photo(this.pdfData).subscribe({next:(data: any) => {
            if (data && data.data && data.code == 200) {
              this.fileUrl = data?.data?.upload_file;
              if(this.observedHolidayFormGroup.value?.observed_holiday_web_link){
                obj.observed_holiday_web_link = this.observedHolidayFormGroup.value?.observed_holiday_web_link;
              }
              if(this.fileUrl){
                obj.observed_holiday_pdf_link = this.fileUrl;
              }
              this.providerService.saveProviderWebsiteInfo(obj, this.providerId).subscribe({next:(x) => {
                return callback(true);
              },
            error: (error: any)=>{
              return callback(false);
            }})
            }
          },
          error: (error: any)=>{
            if(error?.error?.errors){
              this.notificationService.showError(error?.error.errors)
              }
              return callback(false);
          }
        })
        }
        if(this.observedHolidayFormGroup.value?.observed_holiday_web_link){
          obj.observed_holiday_web_link = this.observedHolidayFormGroup.value?.observed_holiday_web_link;
        }
        if(this.fileUrl){
          obj.observed_holiday_pdf_link = this.fileUrl;
        }
        return this.providerService.saveProviderWebsiteInfo(obj, this.providerId).subscribe((x) => {
          return callback(true);
        })
      default:
        break;
    }
    setTimeout(() => {
      return callback(true);
    }, 100);
  }

  addPreschoolAvailable(isbeforeAfter = false) {
    let schedule = !isbeforeAfter ? <FormArray>this.scheduleAvailable.controls['scheduleAvailability'] : <FormArray>this.beforeAfterCareGroup.controls['scheduleAvailability'];
    this.disableAddBtn = schedule && schedule.controls.length > 4 ? true : false;
    schedule.push(this._formBuilder.group({
      startHour: 0,
      startMinute: 0,
      startFormat: '',
      endHour: 0,
      endMinute: 0,
      endFormat: '',
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: false,
      sunday: false,
      schedule_type: ''
    }));
  }

  get scheduleAForm() {
    return (<FormArray>(this.scheduleAvailable.get('scheduleAvailability'))).controls;
  }

  get scheduleAfterBeforeForm() {
    return (<FormArray>(this.beforeAfterCareGroup.get('scheduleAvailability'))).controls;
  }

  removeSchedule(index: number) {
    let formGrp = (<FormArray>(this.scheduleAvailable.get('scheduleAvailability')));
    formGrp.removeAt(index);
  }

  checkValidityAndFormatData(data: any) {
    let newData = data.map((a: any) => ({ ...a }));
    let finalArray: any = [];
    if (newData.length) {
      for (let i = 0; i < newData.length; i++) {
        let newObj: any = {};
        if (newData[i].startHour == 0 || newData[i].endHour == 0) {
          return {
            isValid: false,
            message: message.invalidDateTime,
            data: []
          }
        }
        if (newData[i].monday == false && newData[i].tuesday == false && newData[i].wednesday == false && newData[i].thrusday == false && newData[i].friday == false && newData[i].saturday == false && newData[i].sunday == false) {
          return {
            isValid: false,
            message: message.selectDay,
            data: []
          }
        }

        newObj.start_time = this.convertStartAndEndTime(newData[i].startHour, newData[i].startMinute, newData[i].startFormat);
        newObj.end_time = this.convertStartAndEndTime(newData[i].endHour, newData[i].endMinute, newData[i].endFormat);

        let cmpDate = this.dateCompare(newObj.start_time, newObj.end_time);
        if (cmpDate != -1 && cmpDate) {
          return {
            isValid: false,
            message: message.invalidDateTime,
            data: []
          }
        }
        newObj.monday = newData[i].monday;
        newObj.tuesday = newData[i].tuesday;
        newObj.wednesday = newData[i].wednesday;
        newObj.thrusday = newData[i].thrusday;
        newObj.friday = newData[i].friday;
        newObj.saturday = newData[i].saturday;
        newObj.sunday = newData[i].sunday;
        newObj.schedule_type = this.stepCount == 0 ? "Regular": "Before";
        newObj.provider = this.providerId;
        finalArray.push(newObj);
      }
    }
    return {
      isValid: true,
      message: '',
      data: finalArray
    }
  }

  convertStartAndEndTime(hours: number, minutes: number, format: string) {
    if (!hours) {
      hours = 0;
    }
    if (!minutes) {
      minutes = 0;
    }
    if (format == "pm" && hours < 12) hours = + hours + 12;
    if (format == "am" && hours == 12) hours = + hours - 12;
    var sHours, sMinutes;
    if (typeof hours == 'number') {
      if (hours < 10) {
        sHours = '0' + hours;
      } else {
        sHours = hours.toString();
      }
    } else {
      sHours = hours;
    }
    if (typeof minutes == 'number') {
      if (minutes < 10) {
        sMinutes = '0' + minutes;
      } else {
        sMinutes = minutes.toString();
      }
    } else {
      sMinutes = minutes;
    }
    let time = sHours + ":" + sMinutes + ":00";
    return time;
  }

  getRecordForSteps(stepNumber: number) {
    switch (stepNumber) {
      case 0:
        this.providerService.getProviderSchedule(1).subscribe((data: any) => {
          if (data && data?.data && data?.code == 200) {
            this.addFormControlsWithData(data?.data)
          }
        })
        break;
      case 1:
        this.intializeBeforeAfterCareForm();
        this.providerService.getProviderBasicInfo().subscribe({
          next: (data) => {
            if (data?.data?.is_before_after_care != null)
            this.beforeAfterCareGroup.patchValue({
              is_before_after_care: data?.data?.is_before_after_care ? 'Yes' : 'No'
            })
            if (data?.data?.is_before_after_care) {
              this.beforeAfterCare = true;
            }
          }
        });
        this.providerService.getProviderSchedule().subscribe((data: any) => {
          if (data && data?.data && data?.code == 200) {
            let beforeAfter = data.data.filter((x: any) => x.schedule_type != 'Regular')
            if (beforeAfter.length) {
              this.addFormControlsWithData(beforeAfter, true);
            }
          }
        })
        break;
      case 2:
        this.intializeAvailableForm();
        let availGrp = <FormArray>this.availabileNowFormGroup.controls['ageGroup'];
        availGrp.clear();
        this.providerService.getProviderAgeGroups().subscribe({
          next: (data) => {
            if (data && data?.data && data?.code == 200) {
              this.ageGroupCategory = data?.data;
              this.ageGroupCategory.forEach(((x: any) => {
                availGrp.push(this._formBuilder.group({
                  id: x.id,
                  available_seats: x.available_seats ? x.available_seats : 0,
                  is_present: x.is_present
                }))
              }))
            }
          }, error: (error: any) => {
          }
        });
        this.getBasicInfo();
        break;
      case 3:
        this.getBasicInfo(3);
        break;
      case 4:
        this.getAgeGroups()
        break;
      case 5:
        this.getBasicInfo(5);
        break;
      default:
        break;
    }
  }



  getObjectByKey(key: string) {
    let resp: any = this.ageGroupCategories.find((x: any) => x?.agegroupcategory?.agegroupcategory == key);
    if (resp && !this.isEmpty(resp)) {
      return resp;
    }
    return null;
  }

  getAgeGroups() {
    this.providerService.getProviderAgeGroups().subscribe({
      next: (data) => {
        if (data && data?.data && data?.code == 200) {
          this.ageGroupCategories = data?.data;
          // this.ageGroupCategories = data?.data.filter((x: any) => x?.agegroupcategory?.agegroupcategory == this.TODDLER || x?.agegroupcategory?.agegroupcategory == this.INFANT);
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
          this.napFormGroup.patchValue(this.patchNapData(infantData, toddlerData))
        }
      }, error: (error: any) => {
      }
    });
  }

  getBasicInfo(step: number = 2) {
    this.providerService.getProviderBasicInfo().subscribe({
      next: (data) => {
        if (step == 2) {
          if(data?.data?.availability_now != null){
            this.availabileNowFormGroup.patchValue({
              availability_now: this.setYesNo(data?.data?.availability_now),
            })
          }
          if(data?.data?.availability_in_3_months != null){
            this.availabileNowFormGroup.patchValue({
              availability_in_3_months: this.setYesNo(data?.data?.availability_in_3_months),
            })
          }
          if(data?.data?.availability_in_12_months != null){
            this.availabileNowFormGroup.patchValue({
              availability_in_12_months: this.setYesNo(data?.data?.availability_in_12_months),
            })
          }
          if(data?.data?.availability_in_6_months != null){
            this.availabileNowFormGroup.patchValue({
              availability_in_6_months: this.setYesNo(data?.data?.availability_in_6_months)
            })
          }

          if (data?.data?.availability_now) {
            this.spaceAvailableINPUT = true;
          } else {
            if (data?.data?.availability_in_3_months) {
              this.spaceAvailableThreeMonths = true;
            } else if (data?.data?.availability_in_6_months) {
              this.spaceAvailableSixMonths = true;
            } else if (data?.data?.availability_in_12_months) {
              this.spaceAvailableTwelveMonths = true;
            } else if(data?.data?.availability_now !=null &&
               data?.data?.availability_in_3_months != null &&
               data?.data?.availability_in_6_months != null &&
               data?.data?.availability_in_12_months !=null) {
              this.spaceAvailableTwelveMonths = true;
            }
          }
        } else if (step == 3) {
          this.timeFormGroup.patchValue({
            is_full_time: data?.data?.is_full_time,
            is_part_time: data?.data?.is_part_time,
            is_full_days: data?.data?.is_full_days,
            is_half_days: data?.data?.is_half_days
          })
        } else {
          this.scheduleData = data?.data;
          this.fileUrl = data?.data?.observed_holiday_pdf_link;
          this.observedHolidayFormGroup.patchValue({observed_holiday_web_link: data?.data?.observed_holiday_web_link});
        }
      }, error: (error: any) => {
      }
    });
  }

  addFormControlsWithData(data: any, beforeAfter = false) {
    let schedule = !beforeAfter ? <FormArray>this.scheduleAvailable.controls['scheduleAvailability'] : <FormArray>this.beforeAfterCareGroup.controls['scheduleAvailability'];
    schedule.clear();
    data.forEach((scheduleData: any, index: number) => {
      if (scheduleData.schedule_type != 'Regular') {
        this.onScheduleChange({ value: scheduleData.schedule_type }, index);
      }
      schedule.push(this._formBuilder.group({
        startHour: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.start_time, 'hour'),
        startMinute: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.start_time, 'minutes'),
        startFormat: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.start_time, 'format'),
        endHour: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.end_time, 'hour'),
        endMinute: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.end_time, 'minutes'),
        endFormat: this.providerService.twelveHourFormatFromTwentyFour(scheduleData.end_time, 'format'),
        monday: scheduleData.monday,
        tuesday: scheduleData.tuesday,
        wednesday: scheduleData.wednesday,
        thrusday: scheduleData.thrusday,
        friday: scheduleData.friday,
        saturday: scheduleData.saturday,
        sunday: scheduleData.sunday,
        schedule_type: scheduleData.schedule_type
      }));
    })
  }

  dateCompare(time1: string, time2: string) {
    let t1 = new Date();
    let parts: any = time1.split(":");
    t1.setHours(parts[0], parts[1], parts[2], 0);
    let t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0], parts[1], parts[2], 0);

    if (t1.getTime() > t2.getTime()) return 1;
    if (t1.getTime() < t2.getTime()) return -1;
    return 0;
  }

  dayAdded(ev: any, nindex: number) {
    if (ev.checked) {
      if (ev.source.value) {
        let str = ev.source.value.toLowerCase();
        let schedule = <FormArray>this.scheduleAvailable.controls['scheduleAvailability'];
        let newData = schedule?.value?.map((a: any) => ({ ...a }));
        if (newData && newData.length) {
          let fndIndex = schedule.value.findIndex((x: any, index: number) => (x[str] == true && index !== nindex));
          if (fndIndex > -1) {
            this.daysDuplicate[fndIndex] = true;
            this.notificationService.showError(message.scheduleExits)
          }
        }
      }
    }
  }
  BeforeAfterdayAdded(ev: any, nindex: number) {
    if (ev.checked) {
      if (ev.source.value) {
        let str = ev.source.value.toLowerCase();
        let schedule = <FormArray>this.beforeAfterCareGroup.controls['scheduleAvailability'];
        let newData = schedule?.value?.map((a: any) => ({ ...a }));
        if (newData && newData.length) {
          let fndIndex = schedule.value.findIndex((x: any, index: number) => (x[str] == true && index !== nindex));
          if (fndIndex > -1) {
            this.daysDuplicate[fndIndex] = true;
            this.notificationService.showError(message.scheduleExits)
          }
        }
      }
    }
  }

  onScheduleChange(event: any, i: number) {
    if (event.value == 'After') {
      this.hourArrayAfterBefore[i] = this.hourArray;
      this.amPmAfterBefore[i] = ['am','pm']
    } else {
      this.hourArrayAfterBefore[i] = this.hourArray;
      this.amPmAfterBefore[i] = ['am','pm']
    }
  }

  removeAfterSchedule(index: number) {
    let formGrp = (<FormArray>(this.beforeAfterCareGroup.get('scheduleAvailability')));
    formGrp.removeAt(index);
  }

  availChange(event: any, months: number) {
    if (months == 3) {
      if (event == 'No') {
        this.availabileNowFormGroup.patchValue({
          availability_in_3_months: false
        })
      }
      this.spaceAvailableThreeMonths = event == 'Yes' ? true : false;
      this.spaceAvailableSixMonths = event == 'Yes' ? false : true;
      if(this.spaceAvailableSixMonths){
        this.availabileNowFormGroup.controls['availability_in_6_months'].setValidators(Validators.required)
        this.availabileNowFormGroup.controls['availability_in_6_months'].updateValueAndValidity();
      }
    } else if (months == 6) {
      if (event == 'No') {
        this.availabileNowFormGroup.patchValue({
          availability_in_6_months: false
        })
      }
      this.spaceAvailableSixMonths = event == 'Yes' ? true : false;
      this.spaceAvailableTwelveMonths = event == 'Yes' ? false : true;
      if(this.spaceAvailableTwelveMonths){
        this.availabileNowFormGroup.controls['availability_in_12_months'].setValidators(Validators.required)
        this.availabileNowFormGroup.controls['availability_in_12_months'].updateValueAndValidity();
      }
    } else if (months == 12) {
      this.spaceAvailableTwelveMonths = true;
    }
  }

  setYesNo(value: boolean) {
    if (value) return 'Yes';
    else return 'No'
  }

  saveProviderInfo(data: any, id: number) {
    this.providerService.saveProviderWebsiteInfo(data, id).subscribe((x) => {
    })
  }

  skipStep() {
    // this.moveToNextStep.emit();
    this.providerService.clickedFromSideBar.next({stepNumber: 1, fromSideBar: true});
  }

  formatNapTimeValue(data: any) {
    if (!data?.not_applicable) {
      if (data?.is_infant) {
        if (data?.morning_start_hour == null || data?.morning_end_hour == null || data?.afternoon_end_hour == null || data?.afternoon_start_hour == null) {
          return {
            isValid: false,
            message: message.enterValidTime,
            sendData: []
          }
        }
      }

      if (data?.is_toddler) {
        if (data?.start_time_hour == null || data?.end_time_hour == null) {
          return {
            isValid: false,
            message: message.enterValidTimeMorning,
            sendData: []
          }
        }
      }

      if (!data?.is_toddler && !data?.is_infant && !data?.not_applicable) {
        return {
          isValid: false,
          message: message.selectOption,
          sendData: []
        }
      }
    }
    let respData: any = [];
    if(this.programsOffers.includes(this.INFANT))
    respData.push(this.getArrayByKey(this.INFANT, data));
    if(this.programsOffers.includes(this.TODDLER) || this.programsOffers.includes(this.PREK) || this.programsOffers.includes(this.PRESCHOOL) )
    respData.push(this.getArrayByKey(this.TODDLER, data, true));
    if(this.programsOffers.includes(this.PREK) )
    respData.push(this.getArrayByKey(this.PREK, data, true));
    if(this.programsOffers.includes(this.PRESCHOOL) )
    respData.push(this.getArrayByKey(this.PRESCHOOL, data, true));
    return { isValid: true, message: '', sendData: respData }
  }

  getArrayByKey(key: string, data: any, onlyMorning: boolean = false) {
    let newCategories = this.ageGroupCategories.map((a: any) => ({ ...a }));
    let resp: any = newCategories.find((x: any) => x?.agegroupcategory?.agegroupcategory == key);
    if (resp && !this.isEmpty(resp)) {
      if (onlyMorning) {
        if(key == this.TODDLER || key == this.PREK || key == this.PRESCHOOL){
          resp.is_nap_time = data?.is_toddler
          resp.morning_nap_start_time = this.convertStartAndEndTime(data?.start_time_hour, data?.start_time_minute, data?.start_time_format);
          resp.morning_nap_end_time = this.convertStartAndEndTime(data?.end_time_hour, data?.end_time_minute, data?.end_time_format);
        }
      } else {
        resp.is_nap_time = data?.is_infant
        resp.morning_nap_start_time = this.convertStartAndEndTime(data?.morning_start_hour, data?.morning_start_minute, data?.morning_start_format);
        resp.morning_nap_end_time = this.convertStartAndEndTime(data?.morning_end_hour, data?.morning_end_minute, data?.morning_end_format);
        resp.afternoon_nap_start_time = this.convertStartAndEndTime(data?.afternoon_start_hour, data?.afternoon_start_minute, data?.afternoon_start_format);
        resp.afternoon_nap_end_time = this.convertStartAndEndTime(data?.afternoon_end_hour, data?.afternoon_end_minute, data?.afternoon_end_format);
      }

      delete resp.agegroupcategory;
      delete resp.available_seats;
      delete resp.max_seats;
    }
    return resp;
  }

  isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
  }

  moveToStep(step: number) {
    this.moveToNextStep.emit(step);
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

  changeControlSelect(ev: any, fromAgeGrp = false) {
    if (ev.checked) {
      if (fromAgeGrp) {
        this.napFormGroup.patchValue({
          not_applicable: false
        })
      } else {
        this.napFormGroup.patchValue({
          is_infant: false,
          is_toddler: false,
        })
      }
    }
  }
  clearAll() {
    this.scheduleData.observed_holiday_pdf_link = null;
    this.scheduleData.observed_holiday_web_link = "";
    this.observedHolidayFormGroup.reset();
		this.pdfData = null;
    this.fileUrl = null;
	}
}
