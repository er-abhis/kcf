import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { PhoneNumberFormatPipe } from 'src/app/gaurds/pipes/phone-number-format.pipe';
import { notificationPermissions } from 'src/app/utills/constant/global.constants';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-daycare-admin-add',
  templateUrl: './daycare-admin-add.component.html',
  styleUrls: ['./daycare-admin-add.component.scss'],
})
export class DaycareAdminAddComponent implements OnInit {
  @Output() public isAddAdminOpen = new EventEmitter();
  adminAddForm!: FormGroup;
  isPrimaryPopup: boolean = false;
  @ViewChild('arrow') public arrow: any;
  @ViewChild('primaryAdminRef', { static: false })
  public primaryAdminRef!: ElementRef;
  primaryAdmin: string = '';
  @ViewChild('modalTemp', { static: true }) modelTemp!: TemplateRef<any>;
  submitted: boolean = false;
  addAdminister: boolean = false;
  administratorList: any = [];
  clickedId: number = 0;
  editAdminForm!: FormGroup;
  editSelectAllNotification: boolean = false;
  disableEditSelectAllNotification: boolean = false;
  permissionNotifs = notificationPermissions;
  editSubmitted: boolean = false;
  isRotate: boolean = false;
  slideOpen: boolean = true;
  isSaveText: boolean = false;

  constructor(
    public _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private providerService: ProviderService,
    private notificationService: NotificationService,
    private phoneNumberFormatPipe: PhoneNumberFormatPipe
  ) {}

  ngOnInit(): void {
    this.initAdminForm();
    this.getAllProviders();
    this.initAdminEditForm();
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

  initAdminEditForm() {
    this.editAdminForm = this._formBuilder.group({
      full_name: [
        '',
        [Validators.required, Validators.pattern(/^([a-z']+(-| )?)+$/i)],
      ],
      last_name: [
        '',
        [Validators.required, Validators.pattern(/^([a-z']+(-| )?)+$/i)],
      ],
      position: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/s),
        ],
      ],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      notifications: this._formBuilder.group({
        administrator: [],
        affiliated_provider_requests: [],
        enrollment_requests: [],
        id: [],
        marketing_from_KCF_affiliates: [],
        monthly_usage_summary: [],
        new_enrollment_packages: [],
        new_online_applications: [],
        provider: [],
        user_messages: [],
        waitlist_notifications: [],
      }),
    });
  }

  getAllProviders() {
    this.providerService.getAllProviders().subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          this.administratorList = data?.data?.administrator;
          let admin = this.administratorList.find(
            (x: any) => x.make_primary_admin == true
          );
          if (admin && admin.first_name) {
            this.primaryAdmin = admin.first_name + ' ' + admin.last_name;
          }
        }
      },
      error: (error: any) => {
        console.log('Error checking --->', error);
        if (error?.error?.errors?.email) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[0].message
          );
        }
        if (error?.error?.errors?.mobile) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[1].message
          );
        }
      },
    });
  }

  initAdminForm() {
    this.adminAddForm = this._formBuilder.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
      ],
      last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]],
      position: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/s),
        ],
      ],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      make_primary_admin: false,
      user_messages: false,
      waitlist_notifications: false,
      new_online_applications: false,
      enrollment_requests: false,
      new_enrollment_packages: false,
      monthly_usage_summary: false,
      affiliated_provider_requests: false,
      marketing_from_KCF_affiliates: false,
    });
  }

  isAdminClicked(toggle: boolean) {
    this.isAddAdminOpen.emit(toggle);
    this.addAdminister = toggle;
  }

  selectDeselectAll() {
    const controls = this.adminAddForm.controls;
    let selectAll = false;
    for (const name in controls) {
      if (
        name !== 'first_name' &&
        name !== 'last_name' &&
        name !== 'position' &&
        name !== 'email' &&
        name != 'mobile' &&
        name != 'make_primary_admin'
      ) {
        if (!controls[name].value) {
          selectAll = true;
        }
      }
    }
    this.adminAddForm.patchValue(this.patchedData(selectAll));
  }

  selectDeselectAllEdit() {
    if (this.disableEditSelectAllNotification) {
      return;
    }
    this.editSelectAllNotification = !this.editSelectAllNotification;
    this.editAdminForm.patchValue({
      notifications: this.patchedData(this.editSelectAllNotification),
    });
  }

  patchedData(selectAll: boolean) {
    return {
      user_messages: selectAll,
      waitlist_notifications: selectAll,
      new_online_applications: selectAll,
      enrollment_requests: selectAll,
      new_enrollment_packages: selectAll,
      monthly_usage_summary: selectAll,
      affiliated_provider_requests: selectAll,
      marketing_from_KCF_affiliates: selectAll,
    };
  }

  saveData() {
    this.submitted = true;
    if (!this.adminAddForm.valid) {
      return;
    }
    let sendData = this.adminAddForm.value;
    this.providerService.adminAddWithSettings(sendData).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          this.addAdminister = false;
          this.isAddAdminOpen.emit(false);
          this.submitted = false;
          this.adminAddForm.reset();
          this.getAllProviders();
        }
      },
      error: (error: any) => {
        if (error?.error?.errors?.email) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[0].message
          );
        }
        if (error?.error?.errors?.mobile) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[1].message
          );
        }
      },
    });
  }

  get accControls(): { [key: string]: AbstractControl } {
    return this.adminAddForm.controls;
  }

  get editForm(): { [key: string]: AbstractControl } {
    return this.editAdminForm.controls;
  }

  openDialog() {
    const rect: DOMRect =
      this.primaryAdminRef.nativeElement.getBoundingClientRect();
    let dialogRef = this.dialog.open(this.modelTemp, {
      width: '80vw',
      maxWidth: '500px',
      panelClass: 'modalLicense',
      disableClose: true,
    });
  }

  makeAdminPrimary() {
    if (this.adminAddForm?.value?.make_primary_admin) {
      this.isPrimaryPopup = true;
    }
  }

  changePrimaryOption(value: boolean) {
    this.adminAddForm.patchValue({
      make_primary_admin: value,
    });
    this.isPrimaryPopup = false;
  }

  openCloseDiv(id: number) {
    let arroId = 'arrow_' + id;
    console.log(arroId);

    if (
      (<HTMLInputElement>document.getElementById(arroId)).className ==
      'rotate90'
    ) {
      (<HTMLInputElement>document.getElementById(arroId)).classList.remove(
        'rotate90'
      );
    } else {
      (<HTMLInputElement>document.getElementById(arroId)).classList.add(
        'rotate90'
      );
    }

    if (this.clickedId == id) {
      this.clickedId = 0;
    } else {
      this.clickedId = id;
      this.editAdminForm.disable();
      this.disableEditSelectAllNotification = true;
      this.getParticularAdmin(id);
    }
  }

  editAdmin(id: number) {
    if (this.editAdminForm.disabled) {
      this.editAdminForm.enable();
      this.isSaveText = true;
      this.disableEditSelectAllNotification = false;
      return;
    }
    if (this.isSaveText) {
      this.isSaveText = false;
    }
    this.editSubmitted = true;
    if (!this.editAdminForm.valid) return;
    let fullName = this.editAdminForm.value.full_name.split(' ');
    let dataToSend = {
      first_name: this.editAdminForm.value.full_name,
      last_name: this.editAdminForm.value.last_name,
      position: this.editAdminForm?.value?.position,
      email: this.editAdminForm?.value?.email,
      mobile: this.editAdminForm?.value?.mobile.replaceAll('-', ''),
      notification: {
        user_messages: this.editAdminForm?.value.notifications.user_messages,
        waitlist_notifications:
          this.editAdminForm?.value.notifications.waitlist_notifications,
        new_online_applications:
          this.editAdminForm?.value.notifications.new_online_applications,
        enrollment_requests:
          this.editAdminForm?.value.notifications.enrollment_requests,
        new_enrollment_packages:
          this.editAdminForm?.value.notifications.new_enrollment_packages,
        monthly_usage_summary:
          this.editAdminForm?.value.notifications.monthly_usage_summary,
        affiliated_provider_requests:
          this.editAdminForm?.value.notifications.affiliated_provider_requests,
        marketing_from_KCF_affiliates:
          this.editAdminForm?.value.notifications.marketing_from_KCF_affiliates,
      },
    };

    console.log('dataToSenddataToSend ', dataToSend);

    this.providerService.updateProviderData(dataToSend, id).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          this.clickedId = 0;
          let updatedIndex = this.administratorList.findIndex(
            (x: any) => x.id == id
          );
          if (updatedIndex > -1) {
            this.updatedIndexValues(
              this.administratorList,
              updatedIndex,
              dataToSend
            );
          }
        }
      },
      error: (error: any) => {
        if (error?.error?.errors?.email) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[0].message
          );
        }
        if (error?.error?.errors?.mobile) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[1].message
          );
        }
      },
    });
  }

  getParticularAdmin(id: number) {
    let foundIndex = this.administratorList.findIndex((x: any) => x.id == id);
    this.providerService.getParticularAdmin(id).subscribe({
      next: (data) => {
        console.log('sfjkhdjshfjhsdf ', data);

        if (data?.code && data?.code == 200) {
          if (foundIndex > -1) {
            const adminstrator = data?.data?.administrator[0];
            const permissions = data?.data?.notification[0];
            this.editAdminForm.patchValue({
              full_name: adminstrator?.first_name,
              last_name: adminstrator?.last_name,
              position: adminstrator?.position,
              email: adminstrator?.email,
              mobile: this.phoneNumberFormatPipe.transform(
                adminstrator?.mobile
              ),
              notifications: permissions,
            });
          }
        }
      },
      error: (error: any) => {
        if (error?.error?.errors?.email) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[0].message
          );
          // console.log("Email Error", error?.error?.errors?.email);
        }
        if (error?.error?.errors?.mobile) {
          this.notificationService.showError(
            CustomAlertMessage.adminSetting[1].message
          );
          // console.log("Email Error", error?.error?.errors?.mobile);
        }
      },
    });
  }

  getFullName(item: any) {
    return item.first_name + ' ' + item.last_name;
  }

  getKeyByValue(object: any) {
    let keysArr = Object.keys(object).filter((key: string) => {
      return object[key] === true;
    });
    if (keysArr.length) {
      const slugArr = new Set([...keysArr]);
      let filteredWishlist: any = this.permissionNotifs.filter((x) =>
        slugArr.has(x.slug)
      );
      filteredWishlist = filteredWishlist.map((x: any) => x.id);
      return filteredWishlist;
    }

    return;
  }

  setBooleanValue(idArray: any, keys: string) {
    let obj: any = this.permissionNotifs.find((x: any) => x.slug == keys);
    if (obj && obj.id && idArray.includes(obj.id)) {
      return true;
    }
    return false;
  }

  updatedIndexValues(data: any, index: number, sentData: any) {
    data[index].first_name = sentData.first_name;
    data[index].last_name = sentData.last_name;
    data[index].position = sentData.position;
    data[index].email = sentData.email;
    data[index].mobile = sentData.mobile;
  }

  removeAdmin(id: number) {
    this.providerService.deleteAdmin(id).subscribe((x: any) => {
      this.getAllProviders();
      this.notificationService.showSuccess('Additional administrators removed');
    });
  }
}
