import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { NotificationService } from 'src/app/utills/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  selectedOption: number = 0;
  providerForm!: FormGroup;
  steps_completed: any = null;
  provider_id: any = null;
  filteredProvidersList: any = [];

  providersList: any = [
    { id: 1, value: 'Babysitter' },
    { id: 2, value: 'Private nanny' },
    { id: 3, value: 'Nanny share' },
    { id: 4, value: 'Daycare center' },
    { id: 5, value: 'In-home daycare' },
    { id: 6, value: 'Preschool' },
    { id: 7, value: 'Private school' },
    { id: 8, value: 'Before/ aftercare' },
    { id: 9, value: 'Summer camps' },
    { id: 10, value: 'Music teachers' },
    { id: 11, value: 'Tutors' },
    { id: 12, value: 'Sports & recreation' },
    { id: 13, value: 'Parent & me classes' },
    { id: 14, value: 'Special needs programs' },
  ];

  // notification: any
  constructor(
    private route: Router,
    public notification: NotificationService,
    private localstorageService: LocalstorageService,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.filteredProvidersList = this.providersList;
    this.provider_id = this.localstorageService.getUser().provider_id;
    this.providerForm = new FormGroup({
      selectProvider: new FormControl(''),
    });
    if (this.provider_id) {
      this.getProviderStepsStatus(this.provider_id);
    }
  }

  getProviderStepsStatus(id: any) {
    this.providerService.getProviderSignupStepsStatus(id).subscribe({
      next: (res) => {
        let data = res.data;
        for (let i = 1; i <= 10; i++) {
          let property = `step${i}_completed`;
          if (!data[property]) {
            this.steps_completed = i;
            break;
          }
        }
      },
      error: (error) => { },
    });
  }

  optionList = [
    { label: 'Lucy', value: 'lucy', age: 20 },
    { label: 'Jack', value: 'jack', age: 22 },
  ];
  selectedValue = { label: 'Jack', value: 'jack', age: 22 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareFn = (o1: any, o2: any): boolean =>
    o1 && o2 ? o1.value === o2.value : o1 === o2;

  log(value: { label: string; value: string; age: number }): void { }

  async getStarted() {
    if (!this.providerForm.value.selectProvider) {
      this.notification.showError(CustomAlertMessage.signUpProvider[2].message);
      return;
    }
    switch (this.providerForm.value.selectProvider) {
      // Babysitter
      case 1: {
        if (this.steps_completed != null) {
          await this.route.navigateByUrl(`/provider/signup/${this.providerForm.value.selectProvider}/step/${this.steps_completed}`);
        }
        else {
          await this.route.navigate([`/provider/signup/${this.providerForm.value.selectProvider}/step/1`]);
        }
        break;
      }
      // Daycare center
      case 4: {
        if (this.steps_completed != null) {
          await this.route.navigateByUrl(`/daycare/step/${this.steps_completed}`);
        }
        else {
          await this.route.navigate([`/daycare/step/1`]);
        }
        break;
      }
      case 5: {
        if (this.steps_completed != null) {
          await this.route.navigateByUrl(`/in-home_daycare/step/${this.steps_completed}`);
        }
        else {
          await this.route.navigate([`/in-home_daycare/step/1`]);
        }
        break;
      }
      // Preschool
      case 6: {
        if (this.steps_completed != null) {
          await this.route.navigateByUrl(`/provider/step/${this.steps_completed}`);
        }
        else {
          await this.route.navigate(['/provider/step/1']);
        }
      }
    }

  }

  // For search provider
  search(event: any) {
    let searchData = event.target.value;
    this.filteredProvidersList = this.providersList.filter((x: any) =>
      x.value.toUpperCase().match(searchData.toUpperCase())
    );
  }
}
