import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { CustomisableDialogComponent } from '../../../component/customisable-dialog/customisable-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-enrollment-authorized-persons',
  templateUrl: './enrollment-authorized-persons.component.html',
  styleUrls: ['./enrollment-authorized-persons.component.scss']
})
export class EnrollmentAuthorizedPersonsComponent implements OnInit {
  public selectedVal = 3;
  stepCount: number = 0;
  @Input()
  set selectedCurrentIndex(value: number) {
    this.selectedVal = value;

    if (this.selectedVal == 3) {
      this.getUserPreference();
    }
  }
  get selectedCurrentIndex(): number {
    return this.selectedVal;
  }
  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 3) {
      this.getUserPreference();
      this.stepCount = + value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }
  toggle: boolean = true;
  showParent = false;
  children: any;
  selectedProvider: any[] = [];
  parentSubmitted = false;
  authPerson: any;
  hasApiBeenCalled = false;
  auth: any;
  childCount: any;
  updateEditAuth = false;
  updateAuthData: any;
  updateAuthId: any;
  selected_child: any = [];
  authorizedForm: any = FormGroup;
  ischeck: any = false;
  apiError: any;
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };

  // For Google Loaction
  public AddressChange(address: any) {
    this.authorizedForm.patchValue({
      address: address.formatted_address,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
    });
  }
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initAuthForm();
    let token = this.localServ.getToken();
    this.userService.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;

        this.childCount = data.data.length;
        if (this.childCount == 0) {
          this.notification.showWarning('Add child first');
          this.router.navigate(['user/profile']);
        }
      },
    });
    this.getAuthPerson();
  }
  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference(
      'show_authorized_person_notification'
    );
    if (preference) {
      this.openDialog();
    }
  }
  initAuthForm() {
    this.authorizedForm = this.formBuilder.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      address: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      relationship: ['', [Validators.required]],
      emergency_contact: [''],
      authorized_pickup: [''],
      childpregnancydetails: ['', [Validators.required]],
      userDetails: [localStorage.getItem('user_id')],
      // childSelect: [false],
      // emergency: [false],
    });
  }

  showHideParentForm(type: any) {
    this.selected_child = [];
    if (type == true) {
      this.updateEditAuth = false;
    }
    this.authorizedForm.reset();
    this.showParent = type;
    this.parentSubmitted = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.authorizedForm.controls;
  }
  onSelected(child: any, event: any): void {
    if (event?.target.checked == true) {
      this.selected_child.push(child.id);
    } else if (event?.target.checked == false) {
      const index = this.selected_child.indexOf(child.id);
      if (index > -1) {
        this.selected_child.splice(index, 1);
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // this.apiError = {};
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
  navToAuthPerson() {
    this.dialog.closeAll();
    this.router.navigateByUrl('/user/authorized-person')
  }
  getAuthPerson() {
    this.userService.getAuthPerson().subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;

        this.authPerson = data.data;

        let newData = this.authPerson;
        this.selected_child = newData.map((obj: { id: any }) => obj.id);
        // localStorage.setItem('authPersonID', data?.data[0].id);
        // localStorage.setItem('authPersonID', data?.data[0].id);
      },
      error: (error: any) => {
        // this.manageErr(error);
      },
    });
  }

  submit() {
    this.parentSubmitted = true;
    if (this.selected_child && this.selected_child.length) {
      this.authorizedForm.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    }
    if (this.authorizedForm.invalid) {
      return;
    }
    if (this.parentSubmitted) {
      this.parentSubmitted = false;

      let dataToSend = {
        first_name: this.authorizedForm?.value?.first_name,
        last_name: this.authorizedForm?.value?.last_name,
        address: this.authorizedForm?.value?.address,
        mobile: this.authorizedForm?.value?.mobile,
        relationship: this.authorizedForm?.value?.relationship,
        userDetails: localStorage.getItem('user_id'),
        childpregnancydetails: this.authorizedForm?.value?.childpregnancydetails,
        emergency_contact: this.authorizedForm?.value?.emergency_contact,
        authorized_pickup: this.authorizedForm?.value?.authorized_pickup,
      };
      this.userService.authPersonAdd(dataToSend).subscribe({
        next: (data: any) => {
          this.hasApiBeenCalled = true;
          this.parentSubmitted = true;
          const resData: any = data;
          this.getAuthPerson();
          this.showParent = false;

          this.notification.showSuccess(CustomAlertMessage.authorized[0].message);
          //   setTimeout(() => {
          //     window.location.reload();
          //   }, 1000);
        },
        error: (errors: any) => {
          this.hasApiBeenCalled = false;
          this.parentSubmitted = true;
          this.manageErr(errors);
        },
      });
    }
  }

  manageErr(errors: any) {
    this.notification.showError(errors.error.errors);

    // if (errors.error && typeof errors.error.errors === 'object') {
    //   this.apiError = errors.error.errors;
    // } else {
    //   if (errors && errors.errors)
    // }
  }

  authPersonEdit(element: any) {
    // this.apiError = {};
    this.showParent = true;
    this.updateEditAuth = true;

    this.authorizedForm.controls.first_name.setValue('' + element.first_name);
    this.authorizedForm.controls.address.setValue('' + element.address);
    this.authorizedForm.controls.last_name.setValue('' + element.last_name);
    this.authorizedForm.controls.mobile.setValue('' + element.mobile);
    this.authorizedForm.controls.relationship.setValue(
      '' + element.relationship
    );
    this.authorizedForm.controls.emergency_contact.setValue(
      element.emergency_contact
    );
    this.authorizedForm.controls.authorized_pickup.setValue(
      element.authorized_pickup
    );
    this.authorizedForm.controls.childpregnancydetails.setValue(
      element.childpregnancydetails
    );
    this.selected_child = element.childpregnancydetails.map((e: any) => {
      return e.id;
    });
    // }
    // });
    this.updateAuthId = element.id;
    localStorage.setItem('Authedit', this.updateAuthId);
  }
  authPersonUpdate() {
    // this.apiError = {};
    this.parentSubmitted = true;
    if (this.selected_child && this.selected_child.length) {
      this.authorizedForm.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    }
    if (this.authorizedForm.invalid) {
      return;
    }
    this.hasApiBeenCalled = true;
    this.updateAuthData = {
      id: this.updateAuthId,
      first_name: this.authorizedForm?.value?.first_name,
      last_name: this.authorizedForm?.value?.last_name,
      address: this.authorizedForm?.value?.address,
      mobile: this.authorizedForm?.value?.mobile,
      relationship: this.authorizedForm?.value?.relationship,
      emergency_contact: this.authorizedForm?.value?.emergency_contact
        ? true
        : false,
      authorized_pickup: this.authorizedForm?.value?.authorized_pickup
        ? true
        : false,
      childpregnancydetails: this.selected_child,

      is_deleted: false,
    };
    this.userService
      .editAuthPerson(this.updateAuthData, this.updateAuthData.id)
      .subscribe({
        next: (data: any) => {
          this.hasApiBeenCalled = false;
          const resData: any = data;

          this.notification.showWarning(
            CustomAlertMessage.authorized[2].message
          );
          this.getAuthPerson();
          this.showParent = false;

        },
        error: (error: any) => {
          this.hasApiBeenCalled = false;
          this.manageErr(error);
        },
      });
  }

  authDelete(id: any) {
    localStorage.setItem('auth_ID', id.id);
    let dataToSend = {
      // id: localStorage.getItem('parentId'),
      is_deleted: true,
    };
    this.userService.deleteAuthorized(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess(CustomAlertMessage.authorized[1].message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
    });
  }
  onSelect1(event: any) {
    if (event.target.checked == true) {
      // this.authPerson.emergency_contact = true;
      if (this.authPerson)
        this.authPerson.authorized_pickup = true;
    } else if (event.target.checked == false) {
      // this.authPerson.emergency_contact= false;
      if (this.authPerson)
        this.authPerson.authorized_pickup = false;
    }
  }
  onSelect2(event: any) {
    if (event.target.checked == true) {
      this.authPerson.emergency_contact = true;
      // this.authPerson.authorized_pickup = true;
    } else if (event.target.checked == false) {
      this.authPerson.emergency_contact = false;
      // this.authPerson.authorized_pickup= false;
    }
  }
  SelectAll(event: any) {

    let newData = this.children;
    this.selected_child = newData.map((obj: { id: any }) => obj.id);
    if (event.checked == true) {
      return this.selected_child;
    } else if (event.checked == false) {
      this.selected_child = [];
    }
  }
  // SelectContact(event: any) {
  //   if (event.checked == true) {
  //     this.authorizedForm.controls.authorized_pickup.value = true;
  //     this.authorizedForm.controls.emergency_contact.value = true;

  //     // authorizedForm.controls.authorized_pickup.value
  //     // this.authPerson.authorized_pickup = true;
  //   } else if (event.checked == false) {
  //     this.authorizedForm.controls.authorized_pickup.value = false;
  //     this.authorizedForm.controls.emergency_contact.value = false;
  //   }
  // }
  selectDeselect() {
    this.authorizedForm.controls.childSelect.patchValue(this.toggle);
    this.toggle = !this.toggle;
  }

  subString(str: any, start: number, last: number) {
    return str.substring(start, last)
  }
  usLast(str: any) {
    return this.subString(str, 0, 1).toUpperCase();
  }
  ucFirst(str: any) {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase()
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      maxHeight: 550,
      maxWidth: 635,
      panelClass: ['customisable-dialog'],
      data: {
        title:
          'Enter the authorized persons that may be contacted in the event of an emergency or that are authorized to pickup your child. You may add up to four emergency contacts and five authorized pickup persons per child. If an individual is both an emergency contact and an authorized pickup person, you only need to enter them once and you will be able to designate what they are authorized for.',
        titleClass: 'centered-bold',
        content: 'type1'
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userService.userUpdate({
          show_authorized_person_notification: false,
        }).subscribe({
          next: (data: any) => {
            this.notification.showSuccess('Preferences saved Successfully');
          },
          error: (error: any) => {
            this.notification.showError('Failed to save preference.');
          },
        });
      }
    });
  }

}
