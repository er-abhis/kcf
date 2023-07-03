import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessengerComponent } from './messenger/messenger.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MessageFilterPipe } from 'src/app/gaurds/pipes/message-filter.pipe';
import { ApplyOnlinePopupComponent } from './apply-online-popup/apply-online-popup.component';
import { PhoneNumberFormatPipe } from '../gaurds/pipes/phone-number-format.pipe';
import { GooglePayComponent } from './google-pay/google-pay.component';
import { ApplePayComponent } from './apple-pay/apple-pay.component';
import { GooglePayButtonModule } from "@google-pay/button-angular";
import { FormAlertComponent } from './form-alert/form-alert.component';
import { InputReviewComponent } from './input-review/input-review.component';

@NgModule({
  declarations: [
    MessengerComponent,
    MessageFilterPipe,
    ApplyOnlinePopupComponent,
    PhoneNumberFormatPipe,
    GooglePayComponent,
    ApplePayComponent,
    FormAlertComponent,
    InputReviewComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    GooglePayButtonModule,
  ],
  exports: [
    MessageFilterPipe,
    MessengerComponent,
    ApplyOnlinePopupComponent,
    PhoneNumberFormatPipe,
    GooglePayComponent,
    ApplePayComponent,
    GooglePayButtonModule,
    FormAlertComponent,
    InputReviewComponent,
  ]
})
export class SharedModule { }
