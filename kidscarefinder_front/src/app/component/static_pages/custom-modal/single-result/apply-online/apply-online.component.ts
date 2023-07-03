import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import {
  FormBuilder,
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Component, Inject,OnInit, Input, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/rest-services/user.service';
import { ResultComponent } from '../../../../preschool/result/result.component';
import { Dialog } from '@angular/cdk/dialog';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { UserService } from 'src/app/services/rest-services/user.service';

@Component({
  selector: 'app-apply-online',
  templateUrl: './apply-online.component.html',
  styleUrls: ['./apply-online.component.scss'],
})
export class ApplyOnlineComponent implements OnInit {
  applyForm: any = FormGroup;
  children: any;
  provider: any;
  onSubmitSelection = new EventEmitter();
  user: any;
  guardianInfo: any;
  childId: any;
  guardianId: any;
  parentApplied = false;
  userInfo: any;
  submitted = false;
  ParentForm: any = FormGroup;
  GuardianForm: any = FormGroup;
  ChildForm: any = FormGroup;
  Familydescription: any = FormGroup;
  providerInfo: any = FormGroup;
  providerSelectedData: any;
  // programs: any = [
  //   { id: 1, value: 'Preschool' }
  // ];
  emailRegex = '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  dataInfo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private userservice: UserService,
    private providerService: ProviderService,
    private localServ: LocalstorageService,
    private notification: NotificationService,
    private router: Router,
    private dialog: Dialog
  ) {
    this.initApplyOnlineForm();

  }
  initApplyOnlineForm() {
    this.applyForm = new FormGroup({
      selectionForm: new FormGroup({
        selectedParent_1: new FormControl(''),
        selectedParent_2: new FormControl(''),
        selectedChild: new FormControl(''),
      }),
      ParentForm: new FormGroup({
        first_name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
        last_name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]),
        email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
        contact: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        occupation: new FormControl(''),
        employer_name: new FormControl(''),
        employer_address: new FormControl(''),
        employee_phone: new FormControl('', [Validators.minLength(10)]),
        gross_income: new FormControl(''),
      }),
      GuardianForm: new FormGroup({
        first_name: new FormControl(''),
        last_name: new FormControl(''),
        email: new FormControl(''),
        phone_number: new FormControl(''),
        address: new FormControl(''),
        occupation: new FormControl(''),
        employer_name: new FormControl(''),
        employer_address: new FormControl(''),
        employee_phone: new FormControl('', [Validators.minLength(10)]),
        gross_income: new FormControl(''),
      }),
      ChildForm: new FormGroup({
        first_name: new FormControl('', [Validators.required]),
        last_name: new FormControl('', [Validators.required]),
        date_of_birth: new FormControl('', [Validators.required]),
        contact: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        tell_us_about_child: new FormControl(''),
        additional_info: new FormControl(''),
      }),
      Familydescription: new FormGroup({
        family_description: new FormControl(''),
      }),
      providerInfo: new FormGroup({
        first_name: new FormControl('', [Validators.required]),
        desired_start_date: new FormControl('', [Validators.required]),
        program_applying: new FormControl(''),
        enrollment_documentation: new FormControl('', [Validators.required]),
      }),
    });
  }
  ngOnInit(): void {

    // this.getBasicInfo();

    this.providerSelectedData = this.userservice.getApplyOnlineData();

    this.loadData();
  }

  patchDataForApplicationStarted(){
    if(this.data?.modalType == 'Application Started'){
      let parent_1 = this.userservice.getApplyOnlineData()?.parent_1?.id;
      let guardian = this.userservice.getApplyOnlineData()?.parent_2?.id;
      let child = this.userservice.getApplyOnlineData()?.child?.id;
      if(child){
        this.children?.map((item:any,index:any)=>{
          if(item.id == child){
            this.applyForm.controls.selectionForm.controls.selectedChild.patchValue(`${index}|${child}`)
            this.updateChildData(index);
          }
        })
      }
      if(guardian){
        this.guardianInfo?.map((item:any,index:any)=>{
          if(item.id == guardian){
            this.applyForm.controls.selectionForm.controls.selectedParent_2.patchValue(`${index}|${guardian}`)
            this.updateGuardianData(index);
          }
        })
      }
      if(parent_1){
        this.user?.map((item:any,index:any)=>{
          if(item?.userDetails?.id == parent_1){
            this.applyForm.controls.selectionForm.controls.selectedParent_1.patchValue(`${index}|${item?.id}`)
            this.updateParentData(index);
          }
        })
      }
    }
  }

  loadData() {
    this.getChild();
    // this.getUser();
    this.populateData();
    this.getProvider();

  }
  // getBasicInfo() {
  //   var id = this.providerSelectedData.provider.id;

  //   this.providerService.getProviderBasicInfo().subscribe((data) => {
  //     const dataInfo = data?.data;

  //   })
  // }

  populateData() {
    this.userservice.getUserAccount(this.applyForm).subscribe({
      next: (data: any) => {
        this.user = data?.data;
        this.patchDataForApplicationStarted();
      },
    });
    this.userservice.getGuardianInfo(this.applyForm).subscribe({
      next: (data: any) => {
        this.guardianInfo = data?.data;
        this.patchDataForApplicationStarted();
      },
    });
  }
  get parentContol(): { [key: string]: AbstractControl } {
    return this.applyForm.controls?.ParentForm?.controls;
  }
  get childControl(): { [key: string]: AbstractControl } {
    return this.applyForm.controls?.ChildForm?.controls;
  }

  get descriptionControl(): { [key: string]: AbstractControl } {
    return this.applyForm.controls?.Familydescription?.controls;
  }

  get g(): { [key: string]: AbstractControl } {
    return this.applyForm.controls?.providerInfo?.controls;
  }
  callChild(value: any) {
    this.childId = value.split('|')[1];
    this.updateChildData(value.split('|')[0]);
  }
  callGuardian(value: any) {
    this.guardianId = value.split('|')[1];
    this.updateGuardianData(value.split('|')[0]);
  }
  callParent(value: any) {
    this.userInfo = value.split('|')[1];
    this.updateParentData(value.split('|')[0]);
  }
  getChild() {
    let token = this.localServ.getToken();
    this.userservice.getChild(token).subscribe({
      next: (data: any) => {
        this.children = data.data;
        this.patchDataForApplicationStarted();
        if (this.children.length == 0) {
          this.notification.showInfo('Please Update Child Details First');
          this.dialog.closeAll();
          this.router.navigateByUrl('/user/profile');
        }
      },
    });
  }
  getProvider() {
    var id = this.providerSelectedData.provider.id;
    this.userservice.getProviderInfo(this.applyForm, id).subscribe({
      next: (data: any) => {
        this.provider = data?.data;
        let dataToPopulate = this.provider;
        this.patchDataForApplicationStarted();
        this.applyForm.patchValue({
          providerInfo: {
            first_name:
              dataToPopulate.organization_name,
          },
        });
      },
    });
  }

  // getUser() {
  //   this.userservice.getUserAccount(this.applyForm).subscribe({
  //     next: (data: any) => {
  //       this.user = data?.data;
  //       let dataToPopulate = this.user;
  //       this.applyForm.patchValue({
  //         ParentForm: {
  //           first_name: dataToPopulate.first_name,
  //         },
  //       });
  //     },
  //   });
  // }

  updateChildData(index: any) {
    this.userservice.getChild(this.applyForm).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          if (data && data?.data) {
            let dataToPopulate = data?.data;
            localStorage.setItem('childId', dataToPopulate[index].id);
            this.applyForm.patchValue({
              ChildForm: {
                first_name: dataToPopulate[index].first_name,
                last_name: dataToPopulate[index].last_name,
                date_of_birth: dataToPopulate[index].date_of_birth,
                contact: dataToPopulate[index].contact,
                address: dataToPopulate[index].address.street_address,
                tell_us_about_child: dataToPopulate[index].tell_us_about_child,
                additional_info: dataToPopulate[index].additional_info,
              },
            });
          }
        }
      },
      error: (error: any) => { },
    });
  }

  updateProviderData() {
    var id = this.providerSelectedData.provider.id;
    this.userservice.getProviderInfo(this.applyForm, id).subscribe({
      next: (data: any) => {
        let dataToPopulate = data?.data;
        this.applyForm.patchValue({
          providerInfo: {
            first_name:
              dataToPopulate.first_name + ' ' + dataToPopulate.last_name,
          },
        });
      },
    });
  }
  updateGuardianData(index: any) {
    this.userservice.getGuardianInfo(this.applyForm).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          if (data && data?.data) {
            let dataToPopulate = data?.data;
            localStorage.setItem('guardId', dataToPopulate[index].id);
            this.applyForm.patchValue({
              GuardianForm: {
                first_name: dataToPopulate[index].first_name,
                last_name: dataToPopulate[index].last_name,
                email: dataToPopulate[index].email,
                phone_number: dataToPopulate[index].phone_number,
                address: dataToPopulate[index].address,
                occupation: dataToPopulate[index].occupation,
                employer_name: dataToPopulate[index].employer_name,
                employer_address: dataToPopulate[index].employer_address,
                employee_phone: dataToPopulate[index].employee_phone,
                gross_income: dataToPopulate[index].gross_income,
              },
            });
          }
        }
      },
      error: (error: any) => { },
    });
  }

  updateParentData(index: any) {
    this.userservice.getUserAccount(this.applyForm).subscribe({
      next: (data) => {
        if (data?.code && data?.code == 200) {
          if (data && data?.data) {
            let dataToPopulate = data?.data;
            //localStorage.setItem('guardId', dataToPopulate[index].id);
            this.applyForm.patchValue({
              ParentForm: {
                first_name: dataToPopulate[index].userDetails.first_name,
                last_name: dataToPopulate[index].userDetails.last_name,
                email: dataToPopulate[index].email,
                contact: dataToPopulate[index].contact,
                address: dataToPopulate[index].address.street_address,
                occupation: dataToPopulate[index].userDetails.occupation,
                employer_name: dataToPopulate[index].userDetails.employer_name,
                employer_address:
                  dataToPopulate[index].userDetails.employer_address,
                employee_phone:
                  dataToPopulate[index].userDetails.employee_phone,
                gross_income: dataToPopulate[index].userDetails.gross_income,
              },
              Familydescription: {
                family_description:
                  dataToPopulate[index].userDetails.family_description,
              },
            });
          }
        }
      },
      error: (error: any) => { },
    });
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

  postParent() {
    let dataToSend = {
      first_name: this.applyForm?.value?.ParentForm.first_name,
      last_name: this.applyForm?.value?.ParentForm.last_name,
      email: this.applyForm?.value?.ParentForm.email,
      contact: this.applyForm?.value?.ParentForm.contact,
      address: this.applyForm?.value?.ParentForm.address.street_address,
      occupation: this.applyForm?.value?.ParentForm.occupation,
      employer_name: this.applyForm?.value?.ParentForm.employer_name,
      employer_address: this.applyForm?.value?.ParentForm.employer_address,
      employee_phone: this.applyForm?.value?.ParentForm.employee_phone,
      gross_income: this.applyForm?.value?.ParentForm.gross_income,
      family_description:
        this.applyForm?.value?.Familydescription.Familydescription,
    };
    this.userservice.putUserAccount(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
      },
    });
  }
  postGuardian() {
    this.userservice
      .putGuardianInfo(this.applyForm.value.GuardianForm)
      .subscribe({
        next: (data: any) => {
          const resData: any = data;
        },
      });
  }

  postData(status?:any) {
    let dataToSend = {
      parent_1: localStorage.getItem('user_id'),
      provider: this.provider.id,
      parent_2: localStorage.getItem('guardId'),
      provider_category: this.provider.providercategory.id,
      child: localStorage.getItem('childId'),
      request_status: status?status:'Application Submitted',
      isDeleted: false,
    };
    if (dataToSend.child == '' || dataToSend.child == null) {
      this.notification.showError('Please select Child');
    }
    this.userservice.postApply(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
        this.onSubmitSelection.emit(true);
        this.notification.showSuccess(CustomAlertMessage.applyOnline[0].message);
        this.dialog.closeAll();
        // this.router.navigateByUrl('/preschool/result');
      },
      error: (error: any) => {
        if (error.error.errors?.non_field_errors && error.error.errors?.non_field_errors[0])
          this.notification.showError(error.error.errors.non_field_errors[0]);
        else if (error.error.errors)
          this.notification.showError(error.error.errors);
        else
          this.notification.showError('Some Error occured')

      },
    });
  }

  postChild() {
    let dataToSend = {
      first_name: this.applyForm?.value?.ChildForm.first_name,
      last_name: this.applyForm?.value?.ChildForm.last_name,
      date_of_birth: this.applyForm?.value?.ChildForm.date_of_birth,
      contact: this.applyForm?.value?.ChildForm.contact,
      address: this.applyForm?.value?.ChildForm.address.street_address,
      tell_us_about_child: this.applyForm?.value?.ChildForm.tell_us_about_child,
      aditional_info: this.applyForm?.value?.ChildForm.aditional_info,
    };
    this.userservice.putChild(dataToSend).subscribe({
      next: (data: any) => {
        const resData: any = data;
      },
    });
  }
  putProvider() {


    this.userservice
      .putProviderInfo(this.applyForm.value.providerInfo)
      .subscribe({
        next: (data: any) => {
          const resData: any = data;
        },
      });
  }

  submitData() {


    if ((this.provider.occupation) && (this.applyForm?.controls?.ParentForm?.controls?.occupation.value == "")) {
      this.submitted = false;
      this.notification.showError("Parent occupation is mandatory")
    }
    else if ((this.provider.employer_name) && (this.applyForm?.controls?.ParentForm?.controls?.employer_name.value == "")) {
      this.submitted = false;

      this.notification.showError("Employer name is mandatory")

    }
    else if ((this.provider.employer_address) && (this.applyForm?.controls?.ParentForm?.controls?.employer_address.value == "")) {
      this.submitted = false;
      this.notification.showError("Employer address is mandatory")
    }
    else if ((this.provider.employee_phone) && (this.applyForm?.controls?.ParentForm?.controls?.employee_phone.value == "")) {
      this.submitted = false;
      this.notification.showError("Employer phone number is mandatory")

    }
    else if ((this.provider.annual_gross_income) && (this.applyForm?.controls?.ParentForm?.controls?.gross_income.value == "")) {
      this.submitted = false;
      this.notification.showError("Annual gross income is mandatory")
    }
    else if ((this.provider.any_special_needs) && (this.applyForm?.controls?.ChildForm?.controls?.additional_info.value == "")) {
      this.notification.showError("Any special needs is mandatory");
      this.submitted = false;
    }
    else if ((this.provider.tell_us_about_child) && (this.applyForm?.controls?.ChildForm?.controls?.tell_us_about_child.value == "")) {
      this.notification.showError("Tell us about child is mandatory");
      this.submitted = false;
    }
    else if ((this.provider.family_description) && (this.applyForm?.controls?.Familydescription?.controls?.Familydescription.value == "")) {
      this.notification.showError("Family description is mandatory");
      this.submitted = false;
    }
    else if (this.applyForm?.controls?.ParentForm.invalid || this.applyForm?.controls?.ChildForm.invalid || this.applyForm?.controls?.Familydescription.invalid || this.applyForm?.controls?.providerInfo.invalid) {

      this.submitted = true;
      this.notification.showError(CustomAlertMessage.applyOnline[1].message);
      return
    }

    else {
      this.submitted = true;
      this.postParent();
      this.postGuardian();
      this.postChild();
      this.putProvider();
      this.postData();
    }

  }
  saveData() {
    this.postParent();
    this.postGuardian();
    this.postChild();
    this.putProvider();
    this.postData('Application Started');
    this.closeModal();
    this.onSubmitSelection.emit(true);
  }

  closeModal() {
    this.dialog.closeAll();
    // this.router.navigateByUrl('/preschool');
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
