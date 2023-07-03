import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/utills/notification.service';
import { Router } from '@angular/router';
import {loadStripe} from '@stripe/stripe-js';
@Component({
  selector: 'app-account-billing',
  templateUrl: './account-billing.component.html',
  styleUrls: ['./account-billing.component.scss']
})
export class AccountBillingComponent implements OnInit {
  defaultPlan: any;
  type = 1;
  d = new Date();
  nextPaymentDate = this.d.setMonth(this.d.getMonth() + 1)

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  cardDetailForm = this.formBuilder.group({
    name: ['', Validators.required],
    card_number: ['', Validators.required],
    expiry_month: ['', Validators.required],
    expiry_year: ['', Validators.required],
    cvc: ['', Validators.required],
  });
  checkboxType = {
    'individual': false,
    'company': false
  }
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
  is_yearly_active: any;

  constructor(    
    private providerService: ProviderService,
    private userService: UserService,
    private router: Router,
    private localstorageService: LocalstorageService,
    private formBuilder: FormBuilder,
    private notification : NotificationService,
) { }
changeAccountType(){
  this.router.navigateByUrl('/provider/step/10');
}
async setStripe(){
  const stripe = await loadStripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3')
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
// Check the availability of the Payment Request API first.
const result = await paymentRequest?.canMakePayment();
if (result) {
  prButton?.mount('#payment-request-button');
} else {
 let btn: any = document?.getElementById('payment-request-button');
 btn.style.display = 'none';
}
})();
}
  ngOnInit(): void {
    document?.querySelector('.prevent-default')?.addEventListener('click', (e)=>{
      e.preventDefault();
   }, false);
    this.userDetails();
  }
  submit(){
    if(this.type == 2){
      this.cardDetailSubmitted = true;
      if(!this.cardDetailForm.valid){
        return;
      }
      let obj : any= {};
      obj.account_name = this.cardDetailForm?.value?.name;
      obj.email = this.user?.email;
      obj.amount = this.defaultPlan?.yearly_subscription_price;
      obj.plan = this.defaultPlan?.plan_type;
      obj.cvc = Number(this.cardDetailForm?.value?.cvc);
      obj.exp_year = Number(this.cardDetailForm?.value?.expiry_year);
      obj.exp_month = Number(this.cardDetailForm?.value?.expiry_month);
      obj.card_number = this.cardDetailForm?.value?.card_number;
      this.notification.showInfo('Please Wait... Your request is under process')
      this.providerService.cardDetails(obj).subscribe({
        next: (res: any) => {
          this.notification.showSuccess(res.data.seller_message);
          this.router.navigateByUrl(`/providerSettings/user-activity`)
        },
        error: (error: any) => {
          if(error.error["Message "]){
            this.notification.showError(error.error["Message "]);
          }
          else
            this.notification.showError('Some error occured')
        },
      })
    }
    else{
      this.bankDetailSubmitted = true;
      if(!this.bankDetailForm.valid || this.bankDetailForm.value.account_number != this.bankDetailForm.value.verify_account_number){
        return;
      }
      let obj : any = {};
      obj.account_name = this.bankDetailForm.value?.name;
      obj.account_type = this.checkboxType.company == true? 'company': 'individual';
      obj.routing_number = this.bankDetailForm.value?.routing_number;
      obj.account_number = this.bankDetailForm.value?.account_number;
      obj.plan = this.defaultPlan?.plan_type;
      obj.amount = this.defaultPlan?.yearly_subscription_price;
      obj.email = this.user?.email;
      this.notification.showInfo('Please Wait... Your request is under process')
      this.providerService.bankAccount(obj).subscribe({
        next: async (res: any) => {
          this.notification.showSuccess('Payment Information Submitted')
         await this.callStripe(res.data,obj);

        },
        error: (error: any) => {
          if(error.error["Message "]){
            this.notification.showError(error.error["Message "]);
          }
          else
            this.notification.showError('Some error occured')
        },
      })
    }
  }
  checkbox(type: any){
    if(type == 'individual'){
      this.checkboxType.individual = true;
      this.checkboxType.company = false;
    }
    else{
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

 async callStripe(data: any,userData: any){
    const stripe = await loadStripe('pk_test_51MgykuGbpFz7G4kjLqebHJMILRf1UleXfrwQ4xkjugAsqejoYOgzdIoDL4IrWKKPq6P2Brv3KFgrEOVxyUwes9bk00RySnEV9b');

  // Calling this method will open the instant verification dialog.
  stripe?.collectBankAccountForPayment({
    clientSecret: data.client_secret,
    params: {
      payment_method_type: 'us_bank_account',
      payment_method_data: {
        billing_details: {
          name: userData?.account_name,
          email: userData?.email,
        },
      },
    },
    expand: ['payment_method'],
  })
  .then(({paymentIntent, error}: any) => {
    if (error) {
      this.notification.showError(error.message);
      console.error(error.message);
      // PaymentMethod collection failed for some reason.
    } else if (paymentIntent.status === 'requires_payment_method') {
      this.notification.showError(`Customer canceled the hosted verification modal`);
      // Customer canceled the hosted verification modal. Present them with other
      // payment method type options.
    } else if (paymentIntent.status === 'requires_confirmation') {
      // We collected an account - possibly instantly verified, but possibly
      // manually-entered. Display payment method details and mandate text
      // to the customer and confirm the intent once they accept
      // the mandate.
        stripe.confirmUsBankAccountPayment(data.client_secret)
        .then(({paymentIntent, error}) => {
          if (error) {
            console.error(error.message);
            this.notification.showError(error.message);
            // The payment failed for some reason.
          } else if (paymentIntent.status === "requires_payment_method") {
            this.notification.showError('Confirmation failed');
            // Confirmation failed. Attempt again with a different payment method.
          } else if (paymentIntent.status === "processing") {
            this.notification.showSuccess('Confirmation succeeded! The account will be debited')
            this.router.navigateByUrl(`/providerSettings/user-activity`)
            // Confirmation succeeded! The account will be debited.
            // Display a message to customer.
          } else if (paymentIntent.next_action?.type === "verify_with_microdeposits") {
            this.notification.showError('The account needs to be verified via microdeposits')
            // The account needs to be verified via microdeposits.
            // Display a message to consumer with next steps (consumer waits for
            // microdeposits, then enters a statement descriptor code on a page sent to them via email).
          }
        });
    }
  });
  }

  changeType(type: any){
    this.type = type;
    this.bankDetailForm.reset();
    this.cardDetailForm.reset();
  }


  subscription(){
    this.providerService.subscription('').subscribe({
      next: (res: any) => {
        res.data.forEach((element: any) => {
          if(element.id == 2)
          this.defaultPlan = element;
          this.amount = String(this.defaultPlan?.yearly_subscription_price) + '00'
        });
      },
      error: (error: any) => {
      },
    })
  }   
  userDetails(){
    this.userService.getUserById(this.localstorageService.getUser()?.id).subscribe({
      next: (res: any) => {
        this.user = res.data[0];
        if(res.data[0]?.provider?.provider_subscription){
       this.defaultPlan = res.data[0]?.provider?.provider_subscription;
       this.amount = String(this.defaultPlan?.yearly_subscription_price) + '00'
       this.nextPaymentDate = res.data[0]?.provider?.subscription_expiration_time,
       this.is_yearly_active = res.data[0]?.provider?.provider_subscription.is_yearly_active
        }
       else{
        this.subscription();
       }
      },
      error: (error: any) => {
      },
    })
  } 


}
