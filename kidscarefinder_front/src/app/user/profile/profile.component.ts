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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // Family description length check
  maxChars = 300;
  role = '';
  chars = 0;

  //booleans
  toggleSidebar = true;
  userSubmitted: boolean = false;
  pregnancySubmitted = false;
  childSubmitted = false;
  showChild = false;
  showPregnancy = false;
  isUserSubmitted = false;
  signupSubmitted = false;
  updateEditChild = false;

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
  dobMaxDate = new Date(new Date().getFullYear(), 11, 31);

  //Form Group
  basicInfoForm: any = FormGroup;
  removeProfilePhoto: any = FormGroup;
  descriptionForm: any = FormGroup;

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
  dataToSend: any;
  dataDone: any;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private userService: UserService,
    private dialog: MatDialog,
    private localServ: LocalstorageService,
    private restserv: RestService,
    private router: Router,
    private providerSettingService: ProviderSettingsService
  ) {
    this.initUserForm();
    this.initDescriptionForm();
  }

  ngOnInit(): void {
    this.getParent();
    this.getAuthPerson();
    this.getUserDetails();
    this.getProviderDetail();
    this.getDescription();
    this.getDentist();
    this.getPediatrican();
  }

  profile_photoForm = this.formBuilder.group({
    profile_photo: [],
    profile_photos: [],
  });

  // controls
  get f(): { [key: string]: AbstractControl } {
    return this.basicInfoForm.controls;
  }

  get g(): { [key: string]: AbstractControl } {
    return this.descriptionForm.controls;
  }

  initDescriptionForm() {
    this.descriptionForm = this.formBuilder.group({
      interested_provider_type: new FormControl(),
      family_description: [this.user?.userDetails?.family_description, [Validators.required, Validators.maxLength(300)]],
    });
  }

  initUserForm() {
    this.removeProfilePhoto = this.formBuilder.group({
      profile_photo: [this.profilePhoto],
    });
    this.basicInfoForm = this.formBuilder.group({
      first_name: [
        this.user?.userDetails?.first_name,
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      middle_name: [this.user?.userDetails?.middle_name],
      last_name: [
        this.user?.userDetails?.last_name,
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      email: [
        this.user?.email,
        [Validators.required, Validators.pattern(this.emailRegex)],
      ],
      contact: [this.user?.contact ? this.user?.contact : '', [Validators.required, Validators.minLength(10)]],
      address: [this.user?.address?.street_address, [Validators.required]],
      latitude: [''],
      longitude: [''],
    });
  }

  public AddressChange(address: any) {
    this.formattedaddress = address.formatted_address;
    this.latitudedata = address.geometry.location.lat();
    this.longitudedata = address.geometry.location.lng();
  }

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
  getUserDetails() {
    let id = this.localServ.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user = data.data[0];
        this.url = this.user.profile_photo;
        if (this.user.userDetails?.family_description == null || this.user.userDetails?.family_description == undefined) {
          this.chars = 0;
        } else {
          this.chars = this.user.userDetails?.family_description?.length;
          this.role = this.user.userDetails?.family_description;
        }
        let newData = this.user.userDetails.interested_provider_type;
        this.selected_provider = newData.map((obj: { id: any }) => obj.id);
        this.initUserForm();
        this.initDescriptionForm();
      },
      error: (error: any) => { },
    });
  }

  getDescription() {
    let id = this.localServ.getUser().id;
    this.userService.getChild(id).subscribe({
      next: (data: any) => {
        this.user = data.data[0];
        // this.initDescriptionForm();
      },
    });
  }

  onSelectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;
    if (event.target.files[0]) {
      this.profilePhoto = event.target.files[0];
      this.uploadPic();
    }
    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    this.reader = new FileReader();
    this.reader.readAsDataURL(event.target.files[0]);

    this.reader.onload = (_event: any) => {
      this.msg = '';
      this.url = this.reader.result;
    };
  }

  public delete() {
    this.url = '';
    this.reader = '';
    this.profilePhoto = null;
    this.notification.showWarning(CustomAlertMessage.photoUpdate[1].message);
    this.userService.userBasic(this.removeProfilePhoto.value).subscribe({
      next: (data: any) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (error: any) => { },
    });
  }

  uploadPic() {
    return this.userService.photo(this.profilePhoto).subscribe({
      next: (data: any) => {
        const resData: any = data;
        if (resData && resData.data && resData?.data?.upload_file) {
          this.photoUploadUrlUpdate(resData?.data?.upload_file);
        }
      },
      error: (error: any) => {
        if(error?.error?.errors){
          this.notification.showError(error?.error.errors)
          }
       },
    });
  }
  photoUploadUrlUpdate(imageUrl: string) {
    this.url = imageUrl;
    return this.providerSettingService
      .profilePicUpload(this.profilePhoto, this.localServ.getUser()?.id)
      .subscribe({
        next: (data: any) => {
          this.profilePhoto = null;
          this.notification.showSuccess(
            CustomAlertMessage.photoUpdate[0].message
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error: any) => { },
      });
  }

  updateUserDetails() {
    let dataToSend = {
      first_name: this.basicInfoForm?.value?.first_name,
      last_name: this.basicInfoForm?.value?.last_name,
      family_description: this.descriptionForm?.value?.family_description,
      interested_provider_type: this.selected_provider,
    };
    this.userService.userUpdate(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
      },
    });
  }



  basicInfoUpdate() {
    this.userService.userBasic(this.basicInfoForm.value).subscribe({
      next: (data: any) => {
        const resData: any = data;
        // this.notification.showSuccess('Basic information update successfully ');
      },
      error: (error: any) => {
        this.isUserSubmitted = true;
      },
    });
  }
  formatAdress() {
    if (this.formattedaddress != '') {
      this.basicInfoForm.get('latitude')?.setValue(this.latitudedata);
      this.basicInfoForm.get('longitude')?.setValue(this.longitudedata);
      this.basicInfoForm.get('address')?.setValue(this.formattedaddress);
    }
  }
  getParent() {
    this.userService.getParent().subscribe({
      next: (data: any) => {

      },
    });
  }
  getAuthPerson() {
    this.userService.getAuthPerson().subscribe({
      next: (data: any) => {
      },

    });
  }
  getDentist() {
    this.userService.getDentist().subscribe({
      next: (data: any) => {
      },

    });
  }
  getPediatrican() {
    this.userService.getPedia().subscribe({
      next: (data: any) => {
      },

    });
  }

  onSelected(item: any, event: any): void {
    if (event.target.checked == true) {
      this.selected_provider.push(item.id);
    } else if (event.target.checked == false) {
      const index = this.selected_provider.indexOf(item.id);
      if (index > -1) {
        this.selected_provider.splice(index, 1);
      }
    }
  }

  SubmitData() {
    if (this.basicInfoForm.controls.address.value.trim().length == 0) {
      this.notification.showWarning(CustomAlertMessage.location[2].message);
      return;
    }
    if (this.basicInfoForm.invalid) {
      this.notification.showError("Enter valid details!")
    }
    else {
      this.formatAdress();
      this.updateUserDetails();
      this.basicInfoUpdate();
      this.router.navigateByUrl('/user/account-setting');
    }


    // this.addDescription();

  }
  getProviderDetail() {
    this.userService.getProvider().subscribe({
      next: (data: any) => {
        this.provider = data;
        this.providerTypeArray = this.provider.data;
      },
      error: (error: any) => { },
    });
  }

  showUserSidebar() {
    // this.toggleSidebar  = !this.toggleSidebar;
    this.toggleSidebar = true;
    // let lefPanel: any = document.getElementsByClassName('sidebarleft');
    // lefPanel.style.width = '100%';
  }

}
