import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { RestService } from 'src/app/utills/rest.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ProviderSettingsService } from 'src/app/services/rest-services/provider-settings.service';
import * as moment from 'moment';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
@Component({
  selector: 'app-my-children',
  templateUrl: './my-children.component.html',
  styleUrls: ['./my-children.component.scss'],
})
export class MyChildrenComponent implements OnInit {
  userSubmitted: boolean = false;
  pregnancySubmitted = false;
  childSubmitted = false;
  showChild = false;
  showPregnancy = false;
  isUserSubmitted = false;
  hasApiBeenCalled = false;
  signupSubmitted = false;
  updateEditChild = false;
  isChildValid: boolean = true;
  isPregnancy: boolean = true;
  //declarations
  user: any;
  gender: any;
  provider: any;
  children: any;
  pregnancy: any;
  childCount: any = 0;
  url: any;
  msg = '';
  reader: any;
  latitudedata: any = '';
  longitudedata: any = '';
  profilePhoto: any;
  updateChildData: any;
  updateChildId: any;
  selected_provider: any = [];
  dobMaxDate = new Date();

  //Form Group
  addChildForm: any = FormGroup;
  addPregnancyForm: any = FormGroup;

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  imageUrl = '../../../../assets/images/dummy.png';
  radioItems = ['Male', 'Female', 'Non-Binary', 'Decline to answer'];

  providerTypeArray: any[] = [];
  selectedProvider: any[] = [];

  // For Address google location
  formattedaddress = '';
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };
  minDate = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private userService: UserService,
    private dialog: MatDialog,
    private localServ: LocalstorageService,
    private restserv: RestService,
    private router: Router,
    private providerSettingService: ProviderSettingsService
  ) { }

  ngOnInit(): void {
    this.getChildDetails();
    this.initAddChild();
    this.initPregnancy();
  }
  initAddChild() {
    this.addChildForm = this.formBuilder.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)],
      ],
      middle_name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.pattern(/^\S+/)]],
      latitude: [],
      longitude: [],
      gender: ['', Validators.required],
      date_of_birth: [, Validators.required],
    });
  }

  profile_photoForm = this.formBuilder.group({
    profile_photo: [],
    profile_photos: [],
  });

  onKeyDown(event: KeyboardEvent) {
    var RegExpression = new RegExp(/^[a-zA-Z\s]*$/);
    const input = event.target as HTMLInputElement;
    let trimmed = input.value.replace(/\s+/g, '');
    if (!RegExpression.test(event.key) || event.key == 'Backspace') {
      if (trimmed.length > 12) {
        trimmed = trimmed.substr(0, 12);
      }

      trimmed = trimmed.replace(/-/g, '');

      let numbers = [];
      numbers.push(trimmed.substr(0, 3));
      if (trimmed.substr(3, 3) !== '') numbers.push(trimmed.substr(3, 3));
      if (trimmed.substr(6, 4) != '') numbers.push(trimmed.substr(6, 4));
      input.value = numbers.join('-');
      return true;
    }
    return false;
  }


  initPregnancy() {
    this.addPregnancyForm = this.formBuilder.group({
      first_name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      middle_name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      last_name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      contact: ['', [Validators.minLength(10)]],
      address: [''],
      latitude: [''],
      longitude: [''],
      gender: [''],
      expected_due_date: ['', [Validators.required]],
    });
  }

  showHideChildForm(type: any) {
    if (type == true) {
      this.updateEditChild = false;
    }
    this.addChildForm.reset();
    this.showChild = type;
    this.childSubmitted = false;
    this.showPregnancy = false;
    this.latitudedata = '';
    this.longitudedata = '';
    this.formattedaddress = '';
  }

  showHidePregnancyForm(type: any) {
    if (type == true) {
      this.updateEditChild = false;
    }
    this.addPregnancyForm.reset();
    this.showPregnancy = type;
    this.pregnancySubmitted = false;
    this.showChild = false;
  }

  get u(): { [key: string]: AbstractControl } {
    return this.addChildForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.addPregnancyForm.controls;
  }

  public AddressChange(address: any) {
    this.formattedaddress = address.formatted_address;
    this.latitudedata = address.geometry.location.lat();
    this.longitudedata = address.geometry.location.lng();
  }

  getChildDetails() {
    let token = this.localServ.getToken();
    this.userService.getChild(token).subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        this.children = data.data;
        this.childCount = data.data.length;
      },
    });
  }

  userPreganancy() {
    this.pregnancySubmitted = true;
    if (this.formattedaddress != '') {
      this.addPregnancyForm.get('latitude')?.setValue(this.latitudedata);
      this.addPregnancyForm.get('longitude')?.setValue(this.longitudedata);
      this.addPregnancyForm.get('address')?.setValue(this.formattedaddress);
    }
    this.addPregnancy();
  }

  addChild() {
    this.childSubmitted = true;
    if (this.addChildForm.invalid) {
      return;
    }
    if (this.isChildValid) {
      this.isChildValid = false;
      if (
        this.addChildForm.get('address').value &&
        this.formattedaddress != ''
      ) {
        this.addChildForm.get('latitude')?.setValue(this.latitudedata);
        this.addChildForm.get('longitude')?.setValue(this.longitudedata);
        this.addChildForm.get('address')?.setValue(this.formattedaddress);
      } else {
        this.addChildForm.get('latitude')?.setValue('');
        this.addChildForm.get('longitude')?.setValue('');
      }

      let dataToSend = {
        first_name: this.addChildForm?.value?.first_name,
        middle_name: this.addChildForm?.value?.middle_name,
        last_name: this.addChildForm?.value?.last_name,
        contact: this.addChildForm?.value?.contact,
        address: this.addChildForm?.value?.address,
        latitude: this.addChildForm?.value?.latitude,
        longitude: this.addChildForm?.value?.longitude,
        gender: this.addChildForm?.value?.gender,
        date_of_birth: moment(this.addChildForm?.value?.date_of_birth).format(
          'MM-DD-YYYY'
        ),
      };
      this.userService.addChild(dataToSend).subscribe({
        next: (data) => {
          const resData: any = data;
          this.hasApiBeenCalled = true;
          this.notification.showSuccess(CustomAlertMessage.child[0].message);
          this.showHideChildForm(false);
          this.initPregnancy();
          this.initAddChild();
          this.addChildForm.reset();
          this.getChildDetails();
          this.childSubmitted = false;
          this.isChildValid = true;
        },
        error: (error: any) => {
          this.childSubmitted = false;
          this.isChildValid = true;
          this.notification.showError('Something went wrong');
        },
      });
    }
  }

  addPregnancy() {
    this.pregnancySubmitted = true;
    if (this.addPregnancyForm.invalid) {
      return;
    }
    if (this.isPregnancy) {
      this.isPregnancy = false;
      if (
        this.addPregnancyForm.get('address').value &&
        this.formattedaddress != ''
      ) {
        this.addPregnancyForm.get('latitude')?.setValue(this.latitudedata);
        this.addPregnancyForm.get('longitude')?.setValue(this.longitudedata);
        this.addPregnancyForm.get('address')?.setValue(this.formattedaddress);
      } else {
        this.addPregnancyForm.get('latitude')?.setValue('');
        this.addPregnancyForm.get('longitude')?.setValue('');
      }

      let dataToSend = {
        first_name: this.addPregnancyForm?.value?.first_name
          ? this.addPregnancyForm?.value?.first_name
          : '',
        middle_name: this.addPregnancyForm?.value?.middle_name
          ? this.addPregnancyForm?.value?.middle_name
          : '',
        last_name: this.addPregnancyForm?.value?.last_name
          ? this.addPregnancyForm?.value?.last_name
          : '',
        contact: this.addPregnancyForm?.value?.contact
          ? this.addPregnancyForm?.value?.contact
          : '',
        address: this.addPregnancyForm?.value?.address
          ? this.addPregnancyForm?.value?.address
          : '',
        latitude: this.addPregnancyForm?.value?.latitude
          ? this.addPregnancyForm?.value?.latitude
          : null,
        longitude: this.addPregnancyForm?.value?.longitude
          ? this.addPregnancyForm?.value?.longitude
          : null,
        gender: this.addPregnancyForm?.value?.gender
          ? this.addPregnancyForm?.value?.gender
          : '',
        expected_due_date: moment(
          this.addPregnancyForm?.value?.expected_due_date
        ).format('MM-DD-YYYY')
          ? moment(this.addPregnancyForm?.value?.expected_due_date).format(
            'MM-DD-YYYY'
          )
          : '',
      };

      this.userService.addPregnancy(dataToSend).subscribe({
        next: (data) => {
          this.isPregnancy = true;

          const resData: any = data;
          this.hasApiBeenCalled = true;
          this.initPregnancy();
          this.notification.showSuccess(
            CustomAlertMessage.Pregnancy[0].message
          );
          this.showHidePregnancyForm(false);
          this.addPregnancyForm.reset();
          this.getChildDetails();
        },
        error: (error: any) => {
          this.hasApiBeenCalled = true;
          this.isPregnancy = true;
          this.notification.showError('Something went wrong');
        },
      });
    }
  }

  childEdit(element: any) {
    if (element.date_of_birth) {
      this.showChild = true;
      this.pregnancySubmitted = false;
      this.showPregnancy = false;
      this.updateEditChild = true;
      this.gender = element.gender;

      this.addChildForm.controls.first_name.setValue('' + element.first_name);
      this.addChildForm.controls.middle_name.setValue(
        '' + element.middle_name ? element.middle_name : ''
      );
      this.addChildForm.controls.last_name.setValue('' + element.last_name);
      this.addChildForm.controls.address.setValue(
        '' + element.address.street_address
      );
      this.addChildForm.controls.gender.setValue('' + element.gender);
      this.addChildForm.controls.contact.setValue('' + element.contact);
      this.addChildForm.controls.date_of_birth.setValue(element.date_of_birth);
      this.addChildForm.controls.gender.setValue(element.gender);
    } else {
      this.showPregnancy = true;
      this.showChild = false;

      this.updateEditChild = true;

      this.gender = element.gender;

      this.addPregnancyForm.controls.first_name.setValue(
        '' + element.first_name
      );
      this.addPregnancyForm.controls.middle_name.setValue(
        '' + element.middle_name ? element.middle_name : ''
      );
      this.addPregnancyForm.controls.last_name.setValue('' + element.last_name);
      this.addPregnancyForm.controls.address.setValue(
        '' + element.address.street_address
      );
      this.addPregnancyForm.controls.gender.setValue('' + element.gender);
      this.addPregnancyForm.controls.contact.setValue('' + element.contact);
      this.addPregnancyForm.controls.expected_due_date.setValue(
        element.expected_due_date
      );
      this.addPregnancyForm.controls.gender.setValue(element.gender);
    }

    this.updateChildId = element.id;
  }
  pregUpdate() {
    this.pregnancySubmitted = true;
    if (this.addPregnancyForm.invalid) {
      return;
    }
    this.hasApiBeenCalled = false;
    if (this.formattedaddress != '') {
      this.addPregnancyForm.get('latitude')?.setValue(this.latitudedata);
      this.addPregnancyForm.get('longitude')?.setValue(this.longitudedata);
      this.addPregnancyForm.get('address')?.setValue(this.formattedaddress);
    }
    this.updateChildData = {
      id: this.updateChildId,
      first_name: this.addPregnancyForm?.value?.first_name,
      middle_name: this.addPregnancyForm?.value?.middle_name,
      last_name: this.addPregnancyForm?.value?.last_name,
      address: this.addPregnancyForm?.value?.address,
      contact: this.addPregnancyForm?.value?.contact,
      gender: this.addPregnancyForm?.value?.gender,
      expected_due_date: moment(
        this.addPregnancyForm?.value?.expected_due_date
      ).format('MM-DD-YYYY'),

      is_deleted: false,
    };

    this.userService
      .editChild(this.updateChildData, this.updateChildData.id)
      .subscribe({
        next: (data: any) => {
          const resData: any = data;
          this.hasApiBeenCalled = true;
          this.showPregnancy = false;
          this.addPregnancyForm.reset();
          this.getChildDetails();
          this.notification.showSuccess(
            CustomAlertMessage.Pregnancy[3].message
          );
        },
      });
  }
  childUpdate() {
    this.childSubmitted = true;
    if (this.addChildForm.invalid) {
      return;
    }
    this.childSubmitted = false;
    this.hasApiBeenCalled = false;
    if (this.formattedaddress != '') {
      this.addChildForm.get('latitude')?.setValue(this.latitudedata);
      this.addChildForm.get('longitude')?.setValue(this.longitudedata);
      this.addChildForm.get('address')?.setValue(this.formattedaddress);
    }
    this.updateChildData = {
      id: this.updateChildId,
      first_name: this.addChildForm?.value?.first_name,
      middle_name: this.addChildForm?.value?.middle_name,
      last_name: this.addChildForm?.value?.last_name,
      address: this.addChildForm?.value?.address,
      contact: this.addChildForm?.value?.contact,
      gender: this.addChildForm?.value?.gender,
      date_of_birth: moment(this.addChildForm?.value?.date_of_birth).format(
        'MM-DD-YYYY'
      ),

      is_deleted: false,
    };
    this.userService
      .editChild(this.updateChildData, this.updateChildData.id)
      .subscribe({
        next: (data: any) => {
          const resData: any = data;
          this.hasApiBeenCalled = true;
          this.showChild = false;
          this.addChildForm.reset();
          this.getChildDetails();
          this.notification.showSuccess(CustomAlertMessage.child[3].message);
        },
      });
  }

  childDelete(id: any) {
    localStorage.setItem('child_Id', id.id);
    let dataToSend = {
      isDeleted: true,
    };
    this.userService.deletechild(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.getChildDetails();
        if (id.expected_due_date) {
          this.notification.showWarning(
            CustomAlertMessage.Pregnancy[1].message
          );
        } else {
          this.notification.showWarning(CustomAlertMessage.child[1].message);
        }
      },
    });
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
