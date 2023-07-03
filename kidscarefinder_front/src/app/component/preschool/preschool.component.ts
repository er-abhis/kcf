import { ProviderService } from 'src/app/services/rest-services/provider.service';
import {
  Component,
  OnInit,
  ElementRef,
  Inject,
  ViewChild,
  VERSION,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ReligiousComponent } from './religious/religious.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/utills/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, map, startWith } from 'rxjs';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

interface Bank {
  id: string;
  name: string;
}

interface Religious {
  id: string;
  name: string;
}

interface Languages {
  id: string;
  name: string;
}
export interface State {
  id: string;
  first_name: string;
  last_name: string;
  provider_type: string;
}

@Component({
  selector: 'app-preschool',
  templateUrl: './preschool.component.html',
  styleUrls: ['./preschool.component.scss'],
})
export class PreschoolComponent implements OnInit {
  // For Address google location
  PreschoolForm: any = FormGroup;
  filters: any = {};
  filterText = ['Preschool'];
  firstFormGroup: any = FormGroup;
  secondFormGroup: any = FormGroup;
  thirdFormGroup: any = FormGroup;
  fourthFormGroup: any = FormGroup;
  fullFormattedaddress: any;
  formattedaddress = '';
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };
  query = '';
  dataSource = new MatTableDataSource();
  showLoader: boolean = false;

  stateCtrl = new FormControl('');
  filteredStates!: Observable<State[]>;
  states: State[] = [];

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private doc: any,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private localstorage: LocalstorageService,
    private userservice: UserService,
    private providerService: ProviderService
  ) {
    this.PreschoolForm = new FormGroup({
      firstFormGroup: new FormGroup({
        user_location: new FormControl('', [Validators.required]),
        latitude: new FormControl(''),
        longitude: new FormControl(''),
        radius: new FormControl(''),
      }),
      secondFormGroup: new FormGroup({
        secondCtrl: new FormControl(''),
      }),
      thirdFormGroup: new FormGroup({
        duration1: new FormControl(false),
        duration2: new FormControl(false),
        timeLength: new FormControl(''),
      }),
      fourthFormGroup: new FormGroup({
        applyJob: new FormControl(''),
      }),
    });
  }

  checkboxClick($event: any) {
    $event.preventDefault();
  }

  private ngVersion: string = VERSION.full;
  MAX_STEP = 0;
  @ViewChild('stepper', { static: true })
  private stepper!: MatStepper;
  favoriteSeason: string[] = [];
  seasons: string[] = [
    'Immediately (Within the next 2 months)',
    'Within 3 Months',
    'Within 6 Months',
    'Within 12 Months',
  ];
  step2Filter: any = {
    'Immediately (Within the next 2 months)': false,
    'Within 3 Months': false,
    'Within 6 Months': false,
    'Within 12 Months': false,
  };
  step3Filter: any = {
    'Full Time (5 Days)': false,
    'Part Time (1-4 Days)': false,
    'Full Days': false,
    'Half Days': false,
  };
  DurationModal: string | undefined;
  durations: string[] = ['Full Time (5 Days)', 'Part Time (1-4 Days)'];
  TimeeModal: string | undefined;
  timeLens: string[] = ['Full Days', 'Half Days'];
  applyModal: string | undefined;
  applyLens: string[] = [
    'Provides meals',
    'Offers Private School (TK-12)',
    'Offers aftercare program',
    'Religious affiliation',
    'Accepts children under two years old',
    'Potty training not required',
    'Speaks additional language(s)',
    'Verified license',
  ];
  step4Filter: any = {
    'Provides meals': false,
    'Offers Private school (TK-12)': false,
    'Offers aftercare program': false,
    'Religious affiliation': false,
    'Accepts children under two years old': false,
    'Potty training not required': false,
    'Speaks additional language(s)': false,
    'Verified license': false,
  };

  step: number = 1;
  totalStep: number = 1;
  page: number = 0;
  isAtStart: boolean | undefined;
  isAtEnd: boolean | undefined;
  step1Completed = false;
  isLinear = false;
  selectedStreamList = [1, 2, 3, 4];
  pageType: string | undefined;

  latitudedata: any = '';
  longitudedata: any = '';
  religionId: any;
  languageId: any;

  firstFormSubmitted = false;

  private religious: Bank[] = [];

  private languages: Bank[] = [];

  get f(): { [key: string]: AbstractControl } {
    return this.PreschoolForm.controls?.firstFormGroup?.controls;
  }

  // For Google Loaction
  public AddressChange(address: any) {
    this.formattedaddress = address.name.trim();
    this.latitudedata = address.geometry.location.lat();
    this.longitudedata = address.geometry.location.lng();
    this.fullFormattedaddress = address.formatted_address

  }
  getReligions() {
    this.providerService.getReligions().subscribe((response: any) => {
      this.religious = [];
      response.data.forEach((element: any) => {
        this.religious.push({ id: element.id, name: element.religion });
      });
      // this.toppingListReligious = response.data;
    });
  }
  getLanguages() {
    this.providerService.getLanguages().subscribe((response: any) => {
      this.languages = [];
      response.data.forEach((element: any) => {
        this.languages.push({ id: element.id, name: element.language });
      });
      // this.toppingListlanguage = response.data;
    });
  }
  getCheckValue(event: any) {
    if (event.checked) {
      this.favoriteSeason.push(event.source.value);
    } else {
      this.favoriteSeason = this.favoriteSeason.filter(
        (item) => item !== event.source.value
      );
    }
  }
  radioChangeStep2(event: any) {
    this.step2Filter[event] = !this.step2Filter[event];
  }
  radioChangeStep3(event: any) {
    this.step3Filter[event] = !this.step3Filter[event];
  }

  radioChange(event: any, $event: any) {
    this.step4Filter[event] = !this.step4Filter[event];
    if (event === 'Religious affiliation' && this.step4Filter[event]) {
      const dialogRef = this.dialog.open(ReligiousComponent, {
        width: '40vw',
        maxWidth: '40vw',
        panelClass: 'selectModel',
        data: {
          placeholder: 'Select religious affiliation',
          label: 'Select religious affiliation',
          error: 'No religious found',
          selectArray: this.religious,
          MatTitle: 'What religious affiliation?',
        },
        // backdropClass: 'cdk-overlay-transparent-backdrop',
      });
      const subscribeDialog =
        dialogRef.componentInstance.onSubmitSelection.subscribe((data) => {
          this.religionId = data;
        });
    } else if (
      event === 'Speaks additional language(s)' &&
      this.step4Filter[event]
    ) {
      const dialogRef = this.dialog.open(ReligiousComponent, {
        width: '40vw',
        maxWidth: '40vw',
        panelClass: 'selectModel',
        data: {
          placeholder: 'Select additional language(s)',
          label: 'Select additional language(s)',
          error: 'No languages found',
          selectArray: this.languages,
          MatTitle: 'What additional language(s)?',
        },
        // backdropClass: 'cdk-overlay-transparent-backdrop',
      });
      const subscribeDialog =
        dialogRef.componentInstance.onSubmitSelection.subscribe((data) => {
          this.languageId = data;
        });
    }
  }

  goBack() {
    if (this.step > 0) {
      this.step--;
      this.stepper.previous();
    }
    this.rerender();
    this.makeHeaderActive();
  }

  skipStep() {
    // this.sendFilter(this.filters);
    this.userservice.filters = this.filters;
    this.router.navigate(['/preschool/result']);
  }

  getFilterTextStep2() {
    if (this.filters.radius && !this.filters.formatted_address) {
      let r = Number(this.filters.radius);
      let preText = r == 25 ? 'Greater than' : 'Within';
      return ` | ${preText} ${this.filters.radius} miles`;
    }
    if (!this.filters.radius && this.filters.formatted_address) {
      return ` |  ${this.filters.formatted_address}`;
    }
    if (this.filters.radius && this.filters.formatted_address) {
      let r = Number(this.filters.radius);
      let preText = r == 25 ? 'Greater than' : 'Within';
      return ` | ${preText} ${this.filters.radius} miles of ${this.filters.formatted_address}`;
    }
    return ``;
  }
  getFilterTextStep3() {
    let str: any = [];
    if (this.filters.availability_now) {
      str.push('Immediately');
    }
    if (this.filters.availability_in_3_months) {
      str.push('Within 3 Months');
    }
    if (this.filters.availability_in_6_months) {
      str.push('Within 6 Months');
    }
    if (this.filters.availability_in_12_months) {
      str.push('Within 12 Months');
    }
    if (str.length) {
      return ` | ${str.join(', ')}`;
    } else return ``;
  }
  getFilterTextStep4() {
    let str: any = [];
    let txt = '';
    if (this.filters.is_full_time) {
      str.push(`Full Time`);
    }
    if (this.filters.is_part_time) {
      str.push(`Part Time`);
    }
    if (this.filters.is_full_days) {
      str.push(`Full Days`);
    }
    if (this.filters.is_half_days) {
      str.push(`Half Days`);
    }
    if (str.length) return ` | ${str.join(', ')}`;
    else return ``;
  }
  getFilterTextStep5() {
    let str = [];
    let tst = [];
    for (let p of Object.keys(this.filters)) {
      if (this.filters[p] && p == 'meals__is_meal_provided') {
        str.push('Provides meals');
        tst[0] = 'Multiple Specifics';
      }
      if (this.filters[p] && p == 'is_tk12_program') {
        str.push('Offers Private school (K-12)');
        tst[0] = 'Multiple Specifics';
      }
      if (this.filters[p] && p == 'is_before_after_care') {
        str.push('Offers aftercare program');
        tst[0] = 'Multiple Specifics';
      }
      if (this.filters[p] && p == 'religion') {
        str.push('Religious affiliation');
        tst[0] = 'Multiple Specifics';
      }
      if (this.filters[p] && p == 'language') {
        str.push('Speaks additional language(s)');
        tst[0] = 'Multiple Specifics';
      }
      if (this.filters[p] && p == 'is_license_verified') {
        str.push('Verified license');
        tst[0] = 'Multiple Specifics';
      }
    }
    return tst.join(', ');
  }
  getFilterTextStep1() {
    return 'Preschool';
  }

  getFilterText(step: any) {
    if (step == 1) {
      return `${this.getFilterTextStep1()}`;
    }
    if (step == 2) {
      return `${this.getFilterTextStep1()}${this.getFilterTextStep2()}`;
    }
    if (step == 3) {
      return `${this.getFilterTextStep1()}${this.getFilterTextStep2()}${this.getFilterTextStep3()}`;
    }
    if (step == 4) {
      return `${this.getFilterTextStep1()}${this.getFilterTextStep2()}${this.getFilterTextStep3()}${this.getFilterTextStep4()}`;
    }
    if (step == 5) {
      return `${this.getFilterTextStep1()}${this.getFilterTextStep2()}${this.getFilterTextStep3()}${this.getFilterTextStep4()}${this.getFilterTextStep5()}`;
    }
    return `${this.getFilterTextStep1()}`;
  }

  getLastIndex(val: any, len: number) {
    return val.substring(len - 1, len);
  }
  goForward(type: any) {
    if (type == 1) {
      this.filters = {};
      this.localstorage.delKey('filters');

      // let userInputLastIndex = this.getLastIndex(this.f['user_location']?.value,this.f['user_location']?.value.length)

      // if(this.f['user_location']?.value.substring(0, 1)==" " || userInputLastIndex==" "){
      //   this.notification.showError("White space not allowed");
      //   return
      // }

      if (this.f['user_location']?.value == "") {
        this.notification.showError("Address can't blank");
        return
      }

      if (this.fullFormattedaddress == undefined) {
        this.notification.showError("Address can't blank");
        return
      }

      this.PreschoolForm.controls?.firstFormGroup?.patchValue(
        {
          "user_location": this.fullFormattedaddress?.trim()
        }
      )
      if (this.formattedaddress) {
        this.filters.formatted_address = this.formattedaddress.trim();
      }
      if (this.latitudedata) {
        this.filters.latitude = Number(this.latitudedata).toString();
      }
      if (this.longitudedata) {
        this.filters.longitude = Number(this.longitudedata).toString();
      }
      if (this.PreschoolForm.value?.firstFormGroup?.radius) {
        this.filters.radius = this.PreschoolForm.value?.firstFormGroup?.radius;
      }
    }
    if (this.stateCtrl.value || this.filters.first_name) {
      if (this.stateCtrl?.value?.split(' ')[0])
        this.filters.first_name = this.stateCtrl.value.split(' ')[0];
      if (this.stateCtrl?.value?.split(' ')[1])
        this.filters.last_name = this.stateCtrl.value.split(' ')[1];
    }
    if (this.filters.first_name) {
      this.stateCtrl.patchValue(
        `${this.filters.first_name}`
      );
      if (this.filters.first_name && this.filters.last_name) {
        this.stateCtrl.patchValue(
          `${this.filters.first_name} ${this.filters.last_name}`
        );
      }
    }

    if (type == 2) {
      if (this.step2Filter['Immediately (Within the next 2 months)']) {
        this.filters.availability_now = 'True';
      } else {
        delete this.filters.availability_now;
      }
      if (this.step2Filter['Within 3 Months']) {
        this.filters.availability_in_3_months = 'True';
      } else {
        delete this.filters.availability_in_3_months;
      }
      if (this.step2Filter['Within 6 Months']) {
        this.filters.availability_in_6_months = 'True';
      } else {
        delete this.filters.availability_in_6_months;
      }
      if (this.step2Filter['Within 12 Months']) {
        this.filters.availability_in_12_months = 'True';
      } else {
        delete this.filters.availability_in_12_months;
      }
    }
    if (type == 3) {
      if (this.step3Filter['Full Time (5 Days)']) {
        this.filters.is_full_time = 'True';
      } else {
        delete this.filters.is_full_time;
      }
      if (this.step3Filter['Part Time (1-4 Days)']) {
        this.filters.is_part_time = 'True';
      } else {
        delete this.filters.is_part_time;
      }
      if (this.step3Filter['Full Days']) {
        this.filters.is_full_days = 'True';
      } else {
        delete this.filters.is_full_days;
      }
      if (this.step3Filter['Half Days']) {
        this.filters.is_half_days = 'True';
      } else {
        delete this.filters.is_half_days;
      }
    }
    if (type == 4) {
      if (this.step4Filter['Provides meals']) {
        this.filters.meals__is_meal_provided = 'True';
      } else {
        delete this.filters.meals__is_meal_provided;
      }
      if (this.step4Filter['Offers Private school (TK-12)']) {
        this.filters.is_tk12_program = 'True';
      } else {
        delete this.filters.is_tk12_program;
      }
      if (this.step4Filter['Potty training not required']) {
        this.filters.is_potty_trained = 'True';
      } else {
        delete this.filters.is_potty_trained;
      }
      if (this.step4Filter['Offers aftercare program']) {
        this.filters.is_before_after_care = 'True';
      } else {
        delete this.filters.is_before_after_care;
      }
      if (this.step4Filter['Accepts children under two years old']) {
        this.filters.is_minimum_age = 'True';
      } else {
        delete this.filters.is_minimum_age;
      }
      if (this.step4Filter['Religious affiliation'] && this.religionId.length) {
        this.filters.religion = this.religionId;
      }
      if (
        this.step4Filter['Speaks additional language(s)'] &&
        this.languageId.length
      ) {
        this.filters.language = this.languageId;
      }
      if (this.step4Filter['Verified license']) {
        this.filters.is_license_verified = 'True';
      } else {
        delete this.filters.is_license_verified;
      }
    }
    if (type == 4) {
      this.getsearchData();
      // this.sendFilter(this.filters);
      this.userservice.filters = this.filters;
    }

    // this.firstFormSubmitted = true;
    if (this.PreschoolForm.controls?.firstFormGroup.invalid && type == 1) {
      this.notification.showWarning(CustomAlertMessage.location[2].message);
      return;
    }
    if (this.PreschoolForm.value.firstFormGroup.radius == '') {
      this.notification.showWarning(CustomAlertMessage.location[1].message);
      return;
    }

    // if (this.PreschoolForm.controls?.secondFormGroup.invalid && type == 2) {
    //   this.notification.showWarning('Select Atleast One Options');
    //   return;
    // }

    // if (this.PreschoolForm.controls?.thirdFormGroup.invalid && type == 3) {
    //   this.notification.showWarning('Select Atleast One Options');
    //   return;
    // }

    // if (this.PreschoolForm.controls?.fourthFormGroup.invalid && type == 4) {
    //   this.notification.showWarning('Select Atleast One Options');
    //   return;
    // }
    if (this.step < this.MAX_STEP) {
      this.step++;
      this.stepper.next();
    }
    this.rerender();
    this.makeHeaderActive();
  }
  sendFilter(data: any) {
    this.userservice.sendFilter(data);
  }
  async ngAfterViewInit() {
    this.totalStep = this.stepper._stepHeader.length;
    this.MAX_STEP = this.totalStep;
    this.makeHeaderActive();
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    this.providerService
      .searchProvBYProvidername(filterValue)
      .subscribe((data: any) => {
        this.states = data.data;
      });

    return this.states.filter((state) =>
      state.first_name.toLowerCase().includes(filterValue)
    );
  }

  async ngOnInit() {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filterStates(state) : this.states.slice()))
    );

    this.pageType = this.route.snapshot.paramMap.get('type')!;
    this.rerender();
    // this.getFilters();
    this.getLanguages();
    this.getReligions();
    if (this.localstorage.getKey('filters'))
      this.filters = this.localstorage.getKey('filters');
  }
  ngOnDestroy() {
    if (Object.keys(this.filters).length)
      this.localstorage.saveKey('filters', this.filters);
  }

  getFilters() {
    this.userservice.filter.subscribe((response) => {
      this.filters = response;
    });
  }

  private rerender() {
    let headers: any = document.getElementsByClassName('mat-step-header');
    let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
    for (let h of headers) {
      if (this.page === 0) {
        if (Number.parseInt(h.getAttribute('ng-reflect-index')) > 3) {
          h.style.display = 'none';
        } else {
          h.style.display = 'flex';
        }
      } else if (this.page === 1) {
        if (Number.parseInt(h.getAttribute('ng-reflect-index')) < 4) {
          h.style.display = 'none';
        } else {
          h.style.display = 'flex';
        }
      }
    }

    for (let i = 0; i < lines.length; i++) {
      if (this.page === 0) {
        if (i > 2) {
        } else {
        }
      } else if (this.page === 1) {
        if (i < 6) {
        } else {
        }
      }
    }
  }

  getsearchData() {
    // this.userservice.searchData(i: an).subscribe({
    //   next: (data: any) => {
    //     let newData = data;
    //     let data_length = newData.length;
    //     if (newData.length > 0) {
    //       this.dataSource = new MatTableDataSource(newData);
    //       this.showLoader = false;
    //     }
    //   },
    // });
    // this.providerservice.searchData().subscribe({
    //   next: (data: any) => {
    //     let length = data.length;
    //     let newData = data[0];
    //   },
    // });
  }

  private makeHeaderActive() {
    let headers: any = document.getElementsByClassName('mat-step-label-active');
    while (headers.length > 0) {
      if (headers.length) {
        headers[0]?.classList?.remove('mat-step-label-active');
      }
    }
    const headerDivs: any = document.getElementsByClassName('mat-step-header');
    for (let h of headerDivs) {
      if (+h.getAttribute('ng-reflect-index') < this.step) {
        const stepLabel = h.getElementsByClassName('mat-step-label');
        if (stepLabel.length) {
          stepLabel[0].classList.add('mat-step-label-active');
        }
      }
    }
  }
}
