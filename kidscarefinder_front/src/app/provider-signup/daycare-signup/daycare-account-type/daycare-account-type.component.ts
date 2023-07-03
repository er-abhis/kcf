import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { UserService } from 'src/app/services/rest-services/user.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';

@Component({
  selector: 'app-daycare-account-type',
  templateUrl: './daycare-account-type.component.html',
  styleUrls: ['./daycare-account-type.component.scss'],
})
export class DaycareAccountTypeComponent implements OnInit {
  @Output() public moveToStep = new EventEmitter();
  @Output() public step10Complete = new EventEmitter();
  stepCount: number = 0;
  d = new Date();
  addressDetails: any;
  nextPaymentDate = this.d.setMonth(this.d.getMonth() + 1);
  selectedVal = 10;
  affiliated_provider_url: any;
  organization_name: any;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }
  moveToNextStep(step: number) {
    this.moveToStep.emit(step);
  }
  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 10) {
      this.ngOnInit();
      this.stepCount = +value;
    }
  }

  get stepCountNumber(): number {
    return this.stepCount;
  }

  monthly: boolean = false;
  selectedPlan: any;
  subscriptionPlans: any;
  userData: any;
  providerId: any;
  defaultPlan: any;
  type = 1;
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  cardDetailForm = this.formBuilder.group({
    name: ['', Validators.required],
    card_number: ['', Validators.required],
    expiry_month: ['', Validators.required],
    expiry_year: ['', Validators.required],
    cvc: ['', Validators.required],
  });
  checkboxType = {
    individual: false,
    company: false,
  };
  cardDetailSubmitted = false;
  bankDetailSubmitted = false;
  bankDetailForm = this.formBuilder.group({
    name: ['', Validators.required],
    account_number: ['', Validators.required],
    verify_account_number: ['', Validators.required],
    routing_number: ['', Validators.required],
    account_type: ['', Validators.required],
  });
  user: any;
  amount: any;
  providerUrl: any;
  uniqueId: any;

  constructor(
    public formBuilder: FormBuilder,
    private providerService: ProviderService,
    private userService: UserService,
    private notificationService: NotificationService,
    private localStrService: LocalstorageService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  goToMyProviderPage() {
    this.localStrService.saveKey('provider_return_text', 'provider sign-up');
    this.router.navigateByUrl(
      `/preschool/${this.addressDetails.state?.replaceAll(
        ' ',
        ''
      )}/${this.addressDetails.city?.replaceAll(
        ' ',
        ''
      )}/${this.organization_name?.replaceAll(' ', '')}/${this.providerId}`
    );
  }

  async setStripe() {
    const stripe = await loadStripe(
      'pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3'
    );
    const elements: any = stripe?.elements();
    const paymentRequest = stripe?.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: Number(this.amount),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    const prButton = elements?.create('paymentRequestButton', {
      paymentRequest,
    });

    (async () => {
      const result = await paymentRequest?.canMakePayment();
      if (result) {
        prButton?.mount('#payment-request-button');
      } else {
        let btn: any = document?.getElementById('payment-request-button');
        btn.style.display = 'none';
      }
    })();
  }
  getProviderAddressDetails() {
    this.providerService.getProviderAddressDetails().subscribe({
      next: (data: any) => {
        if (data && data?.data && data?.code == 200) {
          this.addressDetails = data.data[0];
          this.providerId = this.userData?.provider_id;
          this.providerUrl = `${
            window.origin.split('//')[1]
          }/preschool/${this.addressDetails.state?.replaceAll(
            ' ',
            ''
          )}/${this.addressDetails.city?.replaceAll(
            ' ',
            ''
          )}/${this.organization_name?.replaceAll(' ', '')}/${this.providerId}`;
        }
      },
    });
  }
  ngOnInit(): void {
    this.subscription();
    this.getProviderAddressDetails();
    this.userDetails();
    this.userData = this.localStrService.getUser();
    document?.querySelector('.prevent-default')?.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
      },
      false
    );
  }

  checkbox(type: any) {
    if (type == 'individual') {
      this.checkboxType.individual = true;
      this.checkboxType.company = false;
    } else {
      this.checkboxType.individual = false;
      this.checkboxType.company = true;
    }
  }
  get c(): { [key: string]: AbstractControl } {
    return this.cardDetailForm.controls;
  }

  get b(): { [key: string]: AbstractControl } {
    return this.bankDetailForm.controls;
  }

  changeType(type: any) {
    this.type = type;
    this.bankDetailForm.reset();
    this.cardDetailForm.reset();
  }

  subscription() {
    this.providerService.subscription('').subscribe({
      next: (res: any) => {
        this.subscriptionPlans = res.data;
      },
      error: (error: any) => {},
    });
  }

  basicPlanSelect() {
    this.providerService
      .updateProviderSignupSteps(
        { step10_completed: true },
        this.localStrService.getUser()?.provider_id
      )
      .subscribe({
        next: (data) => {
          this.router.navigate(['/providerSettings/user-activity']);
        },
        error: (error) => {},
      });
  }

  savePlanInfo(planId: any, monthly?: boolean) {
    this.selectedPlan = Number(planId);
    this.subscriptionPlans.forEach((element: any) => {
      if (element.id == this.selectedPlan) this.defaultPlan = element;
      if (monthly) {
        this.monthly = true;
        this.amount =
          String(this.defaultPlan?.monthly_subscription_price) + '00';
      } else {
        this.monthly = false;
        this.amount =
          String(this.defaultPlan?.yearly_subscription_price) + '00';
      }
      this.setStripe();
      this.moveToNextStep(1);
    });
  }
  userDetails() {
    if (this.localStrService.getUser()?.id != undefined) {
      this.userService
        .getUserById(this.localStrService.getUser()?.id)
        .subscribe({
          next: (res: any) => {
            this.user = res.data[0];
            this.uniqueId = this.user?.provider?.unique_provider_id;
            this.organization_name = this.user?.provider?.organization_name;
            this.providerService.uniqueProviderId = this.uniqueId;
            this.affiliated_provider_url =
              this.user?.provider?.affiliated_provider_url;
            this.nextPaymentDate =
              this.user?.provider?.subscription_expiration_time;
          },
          error: (error: any) => {},
        });
    }
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (!this.selectedPlan) {
          this.notificationService.showWarning(
            CustomAlertMessage.paymentSection[0].message
          );
          return callback(false);
        } else {
          return callback(true);
        }
      case 1:
        if (this.type == 2) {
          this.cardDetailSubmitted = true;
          if (!this.cardDetailForm.valid) {
            return callback(false);
          }
          let obj: any = {};
          obj.account_name = this.cardDetailForm?.value?.name;
          obj.email = this.user?.email;
          obj.amount = Number(this.amount);
          obj.plan = this.defaultPlan?.plan_type;
          obj.cvc = Number(this.cardDetailForm?.value?.cvc);
          obj.exp_year = Number(this.cardDetailForm?.value?.expiry_year);
          obj.exp_month = Number(this.cardDetailForm?.value?.expiry_month);
          obj.card_number = this.cardDetailForm?.value?.card_number;
          this.providerService.cardDetails(obj).subscribe({
            next: (res: any) => {
              this.notificationService.showSuccess(
                CustomAlertMessage.paymentSection[3].message
              );
              let data = {
                provider_subscription: this.selectedPlan,
              };
              this.providerService
                .saveProviderWebsiteInfo(data, this.providerId)
                .subscribe({
                  next: (data) => {
                    if (data?.code && data?.code == 200) {
                      this.providerService
                        .updateProviderSignupSteps(
                          { step10_completed: true },
                          this.localStrService.getUser()?.provider_id
                        )
                        .subscribe({
                          next: (data) => {
                            this.step10Complete.emit(data);
                            return callback(true);
                          },
                          error: (error) => {},
                        });
                    }
                  },
                  error: (error: any) => {
                  },
                });
            },
            error: (error: any) => {
              if (error.error['Message ']) {
                this.notificationService.showError(error.error['Message ']);
              } else this.notificationService.showError('Some error occured');
              return callback(false);
            },
          });
        } else {
          this.bankDetailSubmitted = true;
          if (
            !this.bankDetailForm.valid ||
            this.bankDetailForm.value.account_number !=
              this.bankDetailForm.value.verify_account_number
          ) {
            return callback(false);
          }
          let obj: any = {};
          obj.account_name = this.bankDetailForm.value?.name;
          obj.account_type =
            this.checkboxType.company == true ? 'company' : 'individual';
          obj.routing_number = Number(
            this.bankDetailForm.value?.routing_number
          );
          obj.account_number = this.bankDetailForm.value?.account_number;
          obj.plan = this.defaultPlan?.plan_type;
          obj.amount = Number(this.amount);
          obj.email = this.user?.email;
          // this.notificationService.showInfo(CustomAlertMessage.paymentSection[1].message)
          this.providerService.bankAccount(obj).subscribe({
            next: async (res: any) => {
              let data = res.data;
              this.notificationService.showSuccess(
                CustomAlertMessage.paymentSection[2].message
              );
              const stripe = await loadStripe(
                'pk_test_51MgykuGbpFz7G4kjLqebHJMILRf1UleXfrwQ4xkjugAsqejoYOgzdIoDL4IrWKKPq6P2Brv3KFgrEOVxyUwes9bk00RySnEV9b'
              );

              stripe
                ?.collectBankAccountForPayment({
                  clientSecret: data.client_secret,
                  params: {
                    payment_method_type: 'us_bank_account',
                    payment_method_data: {
                      billing_details: {
                        name: obj?.account_name,
                        email: obj?.email,
                      },
                    },
                  },
                  expand: ['payment_method'],
                })
                .then(({ paymentIntent, error }: any) => {
                  if (error) {
                    this.notificationService.showError(error.message);
                    return callback(false);
                  } else if (
                    paymentIntent.status === 'requires_payment_method'
                  ) {
                    this.notificationService.showError(
                      `Customer canceled the hosted verification modal`
                    );
                    return callback(false);
                  } else if (paymentIntent.status === 'requires_confirmation') {
                    stripe
                      .confirmUsBankAccountPayment(data.client_secret)
                      .then(({ paymentIntent, error }) => {
                        if (error) {
                          console.error(error.message);
                          this.notificationService.showError(error.message);
                          return callback(false);
                        } else if (
                          paymentIntent.status === 'requires_payment_method'
                        ) {
                          this.notificationService.showError(
                            'Confirmation failed'
                          );
                          return callback(false);
                        } else if (paymentIntent.status === 'processing') {
                          this.notificationService.showSuccess(
                            'Confirmation succeeded! The account will be debited'
                          );
                          let data = {
                            provider_subscription: this.selectedPlan,
                          };
                          this.providerService
                            .saveProviderWebsiteInfo(data, this.providerId)
                            .subscribe({
                              next: (data) => {
                                if (data?.code && data?.code == 200) {
                                  this.providerService
                                    .updateProviderSignupSteps(
                                      { step10_completed: true },
                                      this.localStrService.getUser()
                                        ?.provider_id
                                    )
                                    .subscribe({
                                      next: (data) => {
                                        this.step10Complete.emit('true');
                                        return callback(true);
                                      },
                                      error: (error) => {},
                                    });
                                }
                              },
                              error: (error: any) => {
                              },
                            });
                        } else if (
                          paymentIntent.next_action?.type ===
                          'verify_with_microdeposits'
                        ) {
                          this.notificationService.showError(
                            'The account needs to be verified via microdeposits'
                          );
                          return callback(false);
                        }
                      });
                  }
                });
            },
            error: (error: any) => {
              if (error.error['Message ']) {
                this.notificationService.showError(error.error['Message ']);
              } else this.notificationService.showError('Some error occured');
              return callback(false);
            },
          });
        }
    }
  }
}
