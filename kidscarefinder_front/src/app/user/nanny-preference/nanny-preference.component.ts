import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { CustomisableDialogComponent } from '../../component/customisable-dialog/customisable-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface FoodNode {
  name: string;
  img: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    // name: 'Fruit',
    name: 'Enrollment Details',
    img: '',
    children: [
      {
        name: ' Parent/Guardian Information',
        img: '/../../src/assets/images/icon_tuition.svg',
      },
      {
        name: 'Authorized Persons',
        img: '/../../src/assets/images/icon_tuition.svg',
      },
      {
        name: 'Medical Contacts',
        img: '/../../src/assets/images/icon_tuition.svg',
      },
      {
        name: 'Health History',
        img: '/../../src/assets/images/icon_tuition.svg',
      },
    ],
  },
];

@Component({
  selector: 'app-nanny-preference',
  templateUrl: './nanny-preference.component.html',
  styleUrls: ['./nanny-preference.component.scss'],
})
export class NannyPreferenceComponent implements OnInit {
  toggle: boolean = true;
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  showPedia = false;
  showDentist = false;
  pediaSubmitted = false;
  isValid: boolean = true;
  dentistSubmitted = false;
  children: any;
  hasApiBeenCalled = false;
  user: any;
  dentist: any;
  pedia: any;
  selectedProvider: any[] = [];
  childCount: any;
  updateEditPedia = false;
  updatePediaData: any;
  updatePediaId: any;
  updateEditDentist = false;
  updateDentistData: any;
  selected_child: any = [];
  updateDentistId: any;
  ischeckPhysician: any = false;
  ischeckDentist: any = false;
  clicked = false;
  addPedia: any = FormGroup;
  addDentist: any = FormGroup;
  apiError: any;
  options = {
    componentRestrictions: {
      country: ['AU'],
    },
  };
  public AddressChange(address: any) {
    this.addPedia.patchValue({
      address: address.formatted_address,
      latitude: address.geometry.location.lat(),
      longitude: address.geometry.location.lng(),
    });
    this.addDentist.patchValue({
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
  ) {
    this.dataSource.data = TREE_DATA;
  }

  // For Google Loaction
  manageErr(errors: any) {

    if (errors.error && typeof errors.error.errors === 'object') {
      this.apiError = errors.error.errors;
    } else {
      if (errors && errors.error)
        this.notification.showError(errors.error.errors);

    }
  }

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.initDentistForm();
    this.initPediaForm();
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
      error: (errors: any) => {
        this.manageErr(errors);
      },
    });
    this.getDentist();
    this.getPediatrican();
    // this.getUserPreference();
  }

  async getUserPreference() {
    const preference = await this.userService.getPopUpPreference(
      'show_medical_contacts_notification'
    );
    if (preference) {
      this.openDialog();
    }
  }

  get u(): { [key: string]: AbstractControl } {
    return this.addPedia.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addDentist.controls;
  }

  initPediaForm() {
    this.addPedia = this.formBuilder.group({
      business_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z_ ]*$/)],
      ],
      physician_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z_ ]*$/)],
      ],
      address: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      medicalplan_number: ['', Validators.required],
      childpregnancydetails: ['', Validators.required],
      call_emergency: [''],
      other: [''],
      userDetails: [localStorage.getItem('user_id')],
      // childSelect: [false],
    });
  }

  initDentistForm() {
    this.addDentist = this.formBuilder.group({
      business_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z_ ]*$/)],
      ],
      dentist_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z_ ]*$/)],
      ],
      address: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      medicalplan_number: ['', Validators.required],
      childpregnancydetails: ['', Validators.required],
      call_emergency: [''],
      other: [''],
      userDetails: [localStorage.getItem('user_id')],
      // medicalSelect: [false],
    });
  }
  showHidePediaForm(type: any) {
    this.selected_child = [];
    if (type == true) {
      this.updateEditPedia = false;
    }
    this.addPedia.reset();
    this.showPedia = type;
    this.pediaSubmitted = false;
  }

  showHideDentistForm(type: any) {
    this.selected_child = [];
    if (type == true) {
      this.updateEditDentist = false;
    }
    this.addDentist.reset();
    this.dentistSubmitted = false;
    this.showDentist = type;
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
  pediaAdd() {
    this.apiError = {};
    this.clicked = true;
    this.pediaSubmitted = true;
    if (this.addPedia.controls.business_name.value) {
      this.addPedia.controls.business_name.setValue(this.addPedia.controls.business_name.value.trim())
    }
    if (this.selected_child && this.selected_child.length) {
      this.addPedia.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    } else {
      this.addPedia.controls['childpregnancydetails'].setValue('');
    }
    if (this.addPedia.invalid) {
      return;
    }
    this.hasApiBeenCalled = true;
    let dataToSend = {
      business_name: this.addPedia?.value?.business_name,
      physician_name: this.addPedia?.value?.physician_name,
      address: this.addPedia?.value?.address,
      mobile: this.addPedia?.value?.mobile,
      medicalplan_number: this.addPedia?.value?.medicalplan_number,
      call_emergency: this.addPedia?.value?.call_emergency,
      other: this.addPedia?.value?.other,
      childpregnancydetails: this.addPedia?.value?.childpregnancydetails,
      userDetails: localStorage.getItem('user_id'),
    };
    this.userService.pediaAdd(dataToSend).subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        const resData: any = data;
        this.clicked = false;

        this.notification.showSuccess(
          CustomAlertMessage.pediatrician[0].message
        );
        this.getPediatrican();
      },
      error: (errors: any) => {
        this.manageErr(errors);
        this.hasApiBeenCalled = false;
        this.clicked = false;
      },
    });
  }
  onSelected(child: any, event: any): void {
    this.apiError = {};
    if (event?.target.checked == true) {
      this.selected_child.push(child.id);
    } else if (event?.target.checked == false) {
      const index = this.selected_child.indexOf(child.id);
      if (index > -1) {
        this.selected_child.splice(index, 1);
      }
    }
  }
  SelectPhy(event: any) {
    this.apiError = {};

    let newData = this.children;
    this.selected_child = newData.map((obj: { id: any }) => obj.id);
    if (event.checked == true) {
      return this.selected_child;
    } else if (event.checked == false) {
      this.selected_child = [];
    }
  }
  SelectDent(event: any) {
    this.apiError = {};
    let newData = this.children;
    this.selected_child = newData.map((obj: { id: any }) => obj.id);
    if (event.checked == true) {
      return this.selected_child;
    } else if (event.checked == false) {
      this.selected_child = [];
    }
  }

  dentistAdd() {
    this.apiError = {};
    this.dentistSubmitted = true;
    if (this.addDentist.controls.business_name.value) {
      this.addDentist.controls.business_name.setValue(this.addDentist.controls.business_name.value.trim())
    }
    if (this.selected_child && this.selected_child.length) {
      this.addDentist.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    } else {
      this.addDentist.controls['childpregnancydetails'].setValue('');
    }
    if (this.addDentist.invalid) {
      return;
    }
    this.clicked = true;
    this.hasApiBeenCalled = true;

    let dataToSend = {
      business_name: this.addDentist?.value?.business_name,
      dentist_name: this.addDentist?.value?.dentist_name,
      address: this.addDentist?.value?.address,
      mobile: this.addDentist?.value?.mobile,
      medicalplan_number: this.addDentist?.value?.medicalplan_number,
      call_emergency: this.addDentist?.value?.call_emergency,
      other: this.addDentist?.value?.other,
      childpregnancydetails: this.addDentist?.value?.childpregnancydetails,
      userDetails: localStorage.getItem('user_id'),
    };
    this.userService.dentistAdd(dataToSend).subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        const resData: any = data;
        this.clicked = false;

        this.notification.showSuccess(CustomAlertMessage.dentist[0].message);
        this.getDentist();
      },
      error: (errors: any) => {
        this.manageErr(errors);
        this.hasApiBeenCalled = false;
        this.clicked = false;
      },
    });
  }
  getDentist() {
    this.showDentist = false;
    this.userService.getDentist().subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        this.dentist = data.data;
        let newData = this.dentist;
        this.selected_child = newData.map((obj: { id: any }) => obj.id);
        localStorage.setItem('dentistID', data?.data[0].id);
      },
      error: (error: any) => { },
    });
  }
  getPediatrican() {
    this.showPedia = false;
    this.userService.getPedia().subscribe({
      next: (data: any) => {
        this.hasApiBeenCalled = false;
        this.pedia = data.data;
        let newData = this.pedia;
        this.selected_child = newData.map((obj: { id: any }) => obj.id);

        localStorage.setItem('pediaId', data?.data[0].id);
      },
      error: (error: any) => { },
    });
  }

  pediatricianDelete(id: any) {
    localStorage.setItem('pedia_Id', id.id);

    let dataToSend = {
      is_deleted: true,
    };
    this.userService.deletePedia(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess(CustomAlertMessage.pediatrician[1].message);
        this.getPediatrican();
      },
    });
  }

  pediatricianEdit(element: any) {
    this.showPedia = true;
    this.updateEditPedia = true;

    this.addPedia.controls.business_name.setValue('' + element.business_name);
    this.addPedia.controls.physician_name.setValue('' + element.physician_name);
    this.addPedia.controls.address.setValue('' + element.address);
    this.addPedia.controls.mobile.setValue('' + element.mobile);
    this.addPedia.controls.medicalplan_number.setValue(
      '' + element.medicalplan_number
    );
    this.addPedia.controls.childpregnancydetails.setValue(
      element.childpregnancydetails
    );
    this.addPedia.controls.other.setValue(element.other);

    this.addPedia.controls.call_emergency.setValue(element.call_emergency);
    this.selected_child = element.childpregnancydetails.map((e: any) => {
      return e.id;
    });
    // this.addPedia.controls.physician_name.setValue(element.physician_name);
    // }
    // });
    this.updatePediaId = element.id;
    localStorage.setItem('Pededit', this.updatePediaId);
  }

  pediaUpdate() {
    this.apiError = {};
    this.clicked = true;
    this.pediaSubmitted = true;
    if (this.addPedia.controls.business_name.value) {
      this.addPedia.controls.business_name.setValue(this.addPedia.controls.business_name.value.trim())
    }
    if (this.selected_child && this.selected_child.length) {
      this.addPedia.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    } else {
      this.addPedia.controls['childpregnancydetails'].setValue('');
    }
    if (this.addPedia.invalid) {
      return;
    }
    this.hasApiBeenCalled = true;
    this.updatePediaData = {
      id: this.updatePediaId,
      business_name: this.addPedia?.value?.business_name,
      physician_name: this.addPedia?.value?.physician_name,
      address: this.addPedia?.value?.address,
      mobile: this.addPedia?.value?.mobile,
      medicalplan_number: this.addPedia?.value?.medicalplan_number,
      call_emergency: this.addPedia?.value?.call_emergency ? true : false,
      other: this.addPedia?.value?.other ? true : false,
      childpregnancydetails: this.selected_child,
      is_deleted: false,
    };
    this.userService
      .editPedia(this.updatePediaData, this.updatePediaData.id)
      .subscribe({
        next: (data: any) => {
          this.hasApiBeenCalled = false;
          const resData: any = data;
          this.notification.showWarning(
            CustomAlertMessage.pediatrician[2].message
          );
          this.getPediatrican();
        },
        error: (errors: any) => {
          this.manageErr(errors);
          this.hasApiBeenCalled = false;
          this.clicked = false;
        },
      });
  }
  dentistEdit(element: any) {
    this.apiError = {};
    this.showDentist = true;
    this.updateEditDentist = true;

    this.addDentist.controls.business_name.setValue('' + element.business_name);
    this.addDentist.controls.dentist_name.setValue('' + element.dentist_name);
    this.addDentist.controls.address.setValue('' + element.address);
    this.addDentist.controls.mobile.setValue('' + element.mobile);
    this.addDentist.controls.medicalplan_number.setValue(
      '' + element.medicalplan_number
    );
    this.addDentist.controls.call_emergency.setValue(element.call_emergency);
    this.addDentist.controls.childpregnancydetails.setValue(
      element.childpregnancydetails
    );
    this.addDentist.controls.other.setValue(element.other);
    this.selected_child = element.childpregnancydetails.map((e: any) => {
      return e.id;
    });
    this.updateDentistId = element.id;
    localStorage.setItem('DentEdit', this.updateDentistId);
  }
  dentistUpdate() {
    this.apiError = {};
    this.clicked = true;
    this.dentistSubmitted = true;
    if (this.addDentist.controls.business_name.value) {
      this.addDentist.controls.business_name.setValue(this.addDentist.controls.business_name.value.trim())
    }

    if (this.selected_child && this.selected_child.length) {
      this.addDentist.controls['childpregnancydetails'].patchValue(
        this.selected_child
      );
    } else {
      this.addDentist.controls['childpregnancydetails'].setValue('');
    }

    if (this.addDentist.invalid) {
      return;
    }
    this.hasApiBeenCalled = true;
    this.updateDentistData = {
      id: this.updateDentistId,
      business_name: this.addDentist?.value?.business_name,
      dentist_name: this.addDentist?.value?.dentist_name,
      address: this.addDentist?.value?.address,
      mobile: this.addDentist?.value?.mobile,
      medicalplan_number: this.addDentist?.value?.medicalplan_number,
      call_emergency: this.addDentist?.value?.call_emergency ? true : false,
      other: this.addDentist?.value?.other ? true : false,
      is_deleted: false,
      childpregnancydetails: this.selected_child,
    };
    this.userService
      .editDentist(this.updateDentistData, this.updateDentistData.id)
      .subscribe({
        next: (data: any) => {
          this.hasApiBeenCalled = false;
          const resData: any = data;
          this.notification.showWarning(CustomAlertMessage.dentist[2].message);
          this.getDentist();
        },
        error: (errors: any) => {
          this.manageErr(errors);
          this.hasApiBeenCalled = false;
          this.clicked = false;
        },
      });
  }
  dentistDelete(id: any) {
    this.apiError = {};
    localStorage.setItem('dent_Id', id.id);

    let dataToSend = {
      // id: localStorage.getItem('parentId'),
      is_deleted: true,
    };
    this.userService.deleteDentist(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.notification.showSuccess(CustomAlertMessage.dentist[1].message);
        this.getDentist();
      },
    });
  }
  onSelect1(event: any) {
    if (event.target.checked == true) {
      this.addDentist.call_emergency = true;
    } else if (event.target.checked == false) {
      this.addDentist.call_emergency = false;
    }
  }
  onSelect2(event: any) {
    if (event.target.checked == true) {
      this.addDentist.other = true;
    } else if (event.target.checked == false) {
      this.addDentist.other = false;
    }
  }
  onSelect3(event: any) {
    if (event.target.checked == true) {
      this.addPedia.call_emergency = true;
    } else if (event.target.checked == false) {
      this.addPedia.call_emergency = false;
    }
  }
  onSelect4(event: any) {
    if (event.target.checked == true) {
      this.addPedia.other = true;
    } else if (event.target.checked == false) {
      this.addPedia.other = false;
    }
  }
  selectDeselect() {
    this.addPedia.controls.childSelect.patchValue(this.toggle);
    this.toggle = !this.toggle;
  }

  selectDeselectdentist() {
    this.addDentist.controls.medicalSelect.patchValue(this.toggle);
    this.toggle = !this.toggle;
  }

  openDialog() {
    const dialogRef = this.dialog.open(CustomisableDialogComponent, {
      maxHeight: 330,
      maxWidth: 630,
      panelClass: ['customisable-dialog'],
      data: {
        title:
          'Please add both your child’s Pediatrician’s information and Dentist’s information on this page.',
        titleClass: 'centered-bold',
        content: 'type1',
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.userService.userUpdate({
          show_medical_contacts_notification: false,
        });
      }
    });
  }
}
