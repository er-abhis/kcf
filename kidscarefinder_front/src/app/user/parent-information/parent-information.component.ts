import { Component, OnInit } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { CustomisableDialogComponent } from '../../component/customisable-dialog/customisable-dialog.component';
@Component({
  selector: 'app-parent-information',
  templateUrl: './parent-information.component.html',
  styleUrls: ['./parent-information.component.scss'],
})
export class ParentInformationComponent implements OnInit {
  toggle: boolean = true;
  showParent = false;
  parentSubmitted = false;
  hasApiBeenCalled = false;
  selectedProvider: any[] = [];
  children: any;
  parent: any;
  childCount: any;
  relationship: any;
  ischeck: any = false;
  radioItems = ['Father', 'Mother', 'Guardian'];
  selected_child: any = [];
  parentInfo: any = FormGroup;
  user: any;
  updateEditParent = false;
  updateParentData: any;
  updateParentId: any;
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };
  apiError: any;
  // For Google Loaction
  public AddressChange(address: any) {
    this.parentInfo.patchValue({
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
  ) {}

  manageErr(errors: any) {
    if (errors.error && typeof errors.error.errors === 'object') {
      this.apiError = errors.error.errors;
    } else {
      if (errors && errors.error)
        this.notification.showError(errors.error.errors);
    }
  }

  async ngOnInit() {
    this.initUserForm();
    let token = this.localServ.getToken();
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
    this.getParent();
    await this.getUserPreference();
  }

  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference(
      'show_parent_or_guardian_notification'
    );
    if (preference) {
      this.openDialog();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    this.apiError = {};
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

  initUserForm() {
    this.parentInfo = this.formBuilder.group({
      first_name: [
        this.user?.userDetails?.first_name
          ? this.user?.userDetails?.first_name
          : '',
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      last_name: [
        this.user?.userDetails?.last_name
          ? this.user?.userDetails?.last_name
          : '',
        [Validators.required, Validators.pattern(/^[A-Za-z]+$/)],
      ],
      middle_name: ['', [Validators.pattern(/^[A-Za-z]+$/)]],
      address: [
        this.user?.address?.street_address
          ? this.user?.address?.street_address
          : '',
        [Validators.required, Validators.pattern(/^\S+/)],
      ],
      latitude: [''],
      longitude: [''],
      phone_number: [
        this.user?.contact ? this.user?.contact : '',
        [Validators.required, Validators.minLength(10)],
      ],
      work_number: ['', [Validators.required, Validators.minLength(10)]],
      email: [
        this.user?.email ? this.user?.email : '',
        [Validators.required, Validators.email],
      ],

      relationship: ['', [Validators.required]],
      childpregnancydetails: ['', [Validators.required]],
      userDetails: [localStorage.getItem('user_id')],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.parentInfo.controls;
  }

  showHideParentForm(type: any) {
    this.selected_child = [];
    this.apiError = {};
    if (type == true) {
      this.updateEditParent = false;
    }
    this.parentInfo.reset();
    this.showParent = type;
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

  getParent() {
    this.showParent = false;
    this.userService.getParent().subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        this.parent = data.data;
        let newData = this.parent;
        this.selected_child = newData.map((obj: { id: any }) => obj.id);
        // localStorage.setItem('parentId', data?.data[0].id);
      },
      error: (errors: any) => {},
    });
  }

  parentAdd() {
    this.apiError = {};
    this.parentSubmitted = true;
    if (this.selected_child && this.selected_child.length) {
      this.parentInfo.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    }
    if (this.parentInfo.invalid) {
      return;
    }
    this.hasApiBeenCalled = true;
    let dataToSend = {
      first_name: this.parentInfo?.value?.first_name,
      last_name: this.parentInfo?.value?.last_name,
      middle_name: this.parentInfo?.value?.middle_name,
      address: this.parentInfo?.value?.address,
      phone_number: this.parentInfo?.value?.phone_number,
      work_number: this.parentInfo?.value?.work_number,
      email: this.parentInfo?.value?.email,
      relationship: this.parentInfo?.value?.relationship,
      childpregnancydetails: this.parentInfo?.value?.childpregnancydetails,
      userDetails: localStorage.getItem('user_id'),
    };
    this.userService.parentAdd(dataToSend).subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        this.getParent();
        const resData: any = data;
        this.notification.showSuccess(
          CustomAlertMessage.parentGuardian[0].message
        );
      },
      error: (errors: any) => {
        this.hasApiBeenCalled = false;
        this.manageErr(errors);
      },
    });
    this.getParent();
  }
  autofillData() {
    let id = this.localServ.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user = data.data[0];
        this.initUserForm();
      },
      error: (errors: any) => {
        this.manageErr(errors);
      },
    });
  }
  SelectAll(event: any) {
    let newData = this.children;
    this.selected_child = newData.map((obj: { id: any }) => obj.id);
    if (event.checked == true) {
      return this.selected_child;
    } else if (event.checked == false) {
      this.selected_child = [];
    }

    // this.selected_child;
  }
  parentEdit(element: any) {
    this.apiError = {};
    this.showParent = true;
    this.updateEditParent = true;

    this.parentInfo.controls.first_name.setValue('' + element.first_name);
    this.parentInfo.controls.middle_name.setValue(
      '' + element.middle_name ? element.middle_name : ''
    );
    this.parentInfo.controls.address.setValue('' + element.address);
    this.parentInfo.controls.last_name.setValue('' + element.last_name);
    this.parentInfo.controls.phone_number.setValue('' + element.phone_number);
    this.parentInfo.controls.work_number.setValue(element.work_number);
    this.parentInfo.controls.email.setValue(element.email);
    this.parentInfo.controls.relationship.setValue(element.relationship);
    this.parentInfo.controls.childpregnancydetails.setValue(
      element.childpregnancydetails
    );

    this.selected_child = element.childpregnancydetails.map((e: any) => {
      return e.id;
    });

    this.updateParentId = element.id;
    localStorage.setItem('Parentedit', this.updateParentId);
  }
  parentUpdate() {
    this.apiError = {};
    this.parentSubmitted = true;
    if (this.selected_child && this.selected_child.length) {
      this.parentInfo.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    }
    if (this.parentInfo.invalid) {
      return;
    }

    this.hasApiBeenCalled = true;

    this.updateParentData = {
      id: this.updateParentId,
      first_name: this.parentInfo?.value?.first_name,
      middle_name: this.parentInfo?.value?.middle_name,
      last_name: this.parentInfo?.value?.last_name,
      address: this.parentInfo?.value?.address,
      phone_number: this.parentInfo?.value?.phone_number,
      work_number: this.parentInfo?.value?.work_number,
      email: this.parentInfo?.value?.email,
      relationship: this.parentInfo?.value?.relationship,
      childpregnancydetails: this.selected_child,

      is_deleted: false,
    };
    this.userService
      .editParent(this.updateParentData, this.updateParentData.id)
      .subscribe({
        next: (data: any) => {
          this.hasApiBeenCalled = false;

          const resData: any = data;
          this.notification.showWarning(
            CustomAlertMessage.parentGuardian[2].message
          );
          this.getParent();
        },
        error: (errors: any) => {
          this.hasApiBeenCalled = false;
          this.manageErr(errors);
        },
      });
  }
  parentDelete(id: any) {
    localStorage.setItem('parent_Id', id.id);

    let dataToSend = {
      is_deleted: true,
    };
    this.userService.deleteParent(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess(
          CustomAlertMessage.parentGuardian[1].message
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (errors: any) => {
        this.manageErr(errors);
      },
    });
  }
  selectDeselect() {}

  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      maxHeight: 330,
      maxWidth: 630,
      panelClass: ['customisable-dialog'],
      data: {
        title:
          'State enrollment forms require you to enter all parents/ legal guardians for the child, upto three individuals in this section.',
        titleClass: 'centered-bold',
        content: 'type1',
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userService
          .userUpdate({
            show_parent_or_guardian_notification: false,
          })
          .subscribe({
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

  subString(str: any, start: number, last: number) {
    return str.substring(start, last);
  }
  usLast(str: any) {
    return this.subString(str, 0, 1).toUpperCase();
  }
  ucFirst(str: any) {
    return (
      str.substring(0, 1).toUpperCase() +
      str.substring(1, str.length).toLowerCase()
    );
  }
}
