import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { NotificationService } from 'src/app/utills/notification.service';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-daycare-meals',
  templateUrl: './daycare-meals.component.html',
  styleUrls: ['./daycare-meals.component.scss'],
})
export class DaycareMealsComponent implements OnInit {
  stepCount: number = 0;
  ProvideMealYesNo: string[] = ['Yes', 'No'];
  SnacksProYesNo: string[] = ['Yes', 'No'];
  variable: boolean[] = [];
  variable1: boolean[] = [];
  isBreakFast: boolean = false;
  is_meal_provided: any = null;
  is_snack_provided: any = null;
  isLunch: boolean = false;
  isDinner: boolean = false;
  // public is_meal_provided: boolean = false;
  isMorning: boolean = false;
  isAfternoon: boolean = false;
  isEvening: boolean = false;
  selectedVal = 5;
  ChildFoodProvideSteps: boolean = false;
  ChildSnacksProvideSteps: boolean = false;
  childNeedCareGroup!: FormGroup;
  isMeals: boolean = false;
  isSnacks: boolean = false;
  isSnackPost: any;
  isMealPost: any;

  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 5) {
      this.getRecordsBasedUponSteps(value);
      this.stepCount = +value;
    }
  }
  get stepCountNumber(): number {
    return this.stepCount;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificationService: NotificationService
  ) {}

  ChildSnacksFormGroup = this._formBuilder.group({
    provideMeal: [''],
    provideSnacks: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getReviewDetails();
    this.childNeedCareGroup = this._formBuilder.group({
      is_meal_provided: ['', Validators.required],
    });
  }

  getReviewDetails() {
    this.providerService.videoPhoto().subscribe({
      next: (data: any) => {
        this.isMealPost = data.data.meals;
        this.isSnackPost = data.data.snacks;
      },
    });
  }

  ProvideSnacksChange(event: MatRadioChange, data: any) {
    if (data === 'Yes') this.ChildSnacksProvideSteps = true;
    else this.ChildSnacksProvideSteps = false;
  }

  ProvideMealChange(event: MatRadioChange, data: any) {
    if (data === 'Yes') this.ChildFoodProvideSteps = true;
    else this.ChildFoodProvideSteps = false;
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (this.childNeedCareGroup.invalid) {
          this.notificationService.showError(
            CustomAlertMessage.mealSnacks[0].message
          );
          return;
        }
        if (
          this.childNeedCareGroup.value.is_meal_provided == 'Yes' &&
          !this.isBreakFast &&
          !this.isLunch &&
          !this.isDinner
        ) {
          this.notificationService.showWarning(
            CustomAlertMessage.mealSnacks[1].message
          );
          return callback(false);
        }
        let dataToSend = {
          is_meal_provided:
            this.childNeedCareGroup.value.is_meal_provided == 'Yes'
              ? true
              : false,
          breakfast: this.isBreakFast,
          lunch: this.isLunch,
          dinner: this.isDinner,
          provider: localStorage.getItem('provider_id'),
        };
        if (this.childNeedCareGroup.invalid) {
          this.notificationService.showWarning(
            CustomAlertMessage.mealSnacks[1].message
          );
          return callback(false);
        }

        return this.providerService
          .meals(dataToSend, this.isMealPost)
          .subscribe({
            next: (data: any) => {
              const resData: any = data;

              return callback(true);
            },
            error: (error: any) => {
              this.isMeals = true;
              if (error?.error.errors) {
                this.notificationService.showError(error?.error.errors);
              } else {
                this.notificationService.showError('Some Error occured');
              }
              return callback(false);
            },
          });

      case 1:
        if (
          this.ChildSnacksFormGroup.value.provideSnacks == 'Yes' &&
          !this.isMorning &&
          !this.isEvening &&
          !this.isAfternoon
        ) {
          this.notificationService.showWarning(
            CustomAlertMessage.mealSnacks[2].message
          );
          return callback(false);
        }
        let snaksData = {
          is_snack_provided:
            this.ChildSnacksFormGroup.value.provideSnacks == 'Yes'
              ? true
              : false,
          morning: this.isMorning,
          afternoon: this.isAfternoon,
          evening: this.isEvening,
          provider: localStorage.getItem('provider_id'),
        };
        if (this.childNeedCareGroup.invalid) {
          this.notificationService.showWarning(
            CustomAlertMessage.mealSnacks[2].message
          );
          return callback(false);
        }

        return this.providerService
          .snacks(snaksData, this.isSnackPost)
          .subscribe({
            next: (data: any) => {
              const resData: any = data;
              return callback(true);
            },
            error: (error: any) => {
              this.isSnacks = true;

              if (error?.error.errors) {
                this.notificationService.showError(error?.error.errors);
              } else {
                this.notificationService.showError('Some Error occured');
              }
              return callback(false);
            },
          });

      case 2:
        this.getMeals();
        this.getSnacks();
        return callback(true);

        break;
      default:
        console.log('called');
        return callback(true);
    }
    // return callback(true);
  }

  getMeals() {
    this.providerService.mealsGet().subscribe({
      next: (data: any) => {
        let mapData = data?.data;
        this.childNeedCareGroup.patchValue({
          provideMeal: mapData?.[0].is_meal_provided ? 'Yes' : 'No',
          is_meal_provided: mapData?.[0].is_meal_provided ? 'Yes' : 'No',
        });

        if (mapData?.[0].is_meal_provided) {
          this.ChildFoodProvideSteps = true;
        }
        this.is_meal_provided = mapData?.[0].is_meal_provided;
        if (this.is_meal_provided) {
          this.isDinner = mapData?.[0].dinner;
          this.isLunch = mapData?.[0].lunch;
          this.isBreakFast = mapData?.[0].breakfast;
          this.is_meal_provided = mapData?.[0].is_meal_provided;
        }
      },
      error: (error: any) => {},
    });
  }

  getSnacks() {
    this.providerService.snacksGet().subscribe({
      next: (data: any) => {
        let mapData = data?.data;
        this.childNeedCareGroup.patchValue({
          provideSnacks: mapData?.[0].is_snack_provided ? 'Yes' : 'No',
          is_snack_provided: mapData?.[0].is_snack_provided ? 'Yes' : 'No',
        });
        this.ChildSnacksFormGroup.patchValue({
          provideSnacks: mapData?.[0].is_snack_provided ? 'Yes' : 'No',
        });
        if (mapData?.[0].is_snack_provided) {
          this.ChildSnacksProvideSteps = true;
        }
        this.is_snack_provided = mapData?.[0].is_snack_provided;
        if (this.is_snack_provided == true) {
          this.isEvening = mapData?.[0].evening;
          this.isAfternoon = mapData?.[0].afternoon;
          this.isMorning = mapData?.[0].morning;
        }
      },
      error: (error: any) => {},
    });
  }

  getRecordsBasedUponSteps(step: number) {
    if (step == 0) {
      this.getMeals();
    } else if (step == 1) {
      this.getSnacks();
    } else {
      this.getMeals();
      this.getSnacks();
    }
  }
}
