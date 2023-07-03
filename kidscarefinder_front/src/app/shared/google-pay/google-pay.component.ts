import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kcf-google-pay',
  templateUrl: './google-pay.component.html',
  styleUrls: ['./google-pay.component.scss']
})
export class GooglePayComponent implements OnInit {
  @Input() amount: any;
  buttonColor: any = "white";
  buttonType: any = "buy";
  isCustomSize = false;
  buttonWidth: any = 240;
  buttonHeight: any = 40;
  isTop: any = window === window.top;

  paymentRequest: any = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "VISA", "MASTERCARD"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ],
    merchantInfo: {
      merchantId: "12345678901234567890",
      merchantName: "Demo Merchant"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Total",
      totalPrice: "0.00",
      currencyCode: "USD",
      countryCode: "US"
    }
  };
  constructor() { }
  ngOnChanges(){
    this.paymentRequest.transactionInfo.totalPrice = this.amount;
  }
  ngOnInit(): void {
  }
  onLoadPaymentData(event: any) {
  }

}
