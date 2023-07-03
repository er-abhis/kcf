import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginProviderModalComponent } from './login-provider-modal/login-provider-modal.component';
import { TermsProvider } from './terms-provider/terms.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSearchSelectModule } from 'src/app/shared/mat-search-select/mat-search-select.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageProviderComponent } from './single-result/message-provider/message-provider.component';
import { AddWaitlistComponent } from './single-result/add-waitlist/add-waitlist.component';
import { RequestEnrollmentComponent } from './single-result/request-enrollment/request-enrollment.component';
import { AvailabilityComponent } from './single-result/availability/availability.component';
import { WaitlistThankyouComponent } from './single-result/thankyouModal/waitlist-thankyou/waitlist-thankyou.component';
import { EnrollThankyouComponent } from './single-result/thankyouModal/enroll-thankyou/enroll-thankyou.component';
import { TutionFeeComponent } from './tution-fee/tution-fee.component';
import { ProviderUrlComponent } from './provider-url/provider-url.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ModalTooltipComponent } from './modal-tooltip/modal-tooltip.component';
import { ApplicationPerfrencesComponent } from './application-perfrences/application-perfrences.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { EnrollmentModule } from 'src/app/user/docuSign-enrollment/docuSign.module';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { LicenceModalTooltipComponent } from './licence-modal-tooltip/licence-modal-tooltip.component';
import { ViewEnrollmentDocumentsComponent } from './view-enrollment-documents/view-enrollment-documents.component';
@NgModule({
  declarations: [
    LoginProviderModalComponent,
    TermsProvider,
    MessageProviderComponent,
    AddWaitlistComponent,
    RequestEnrollmentComponent,
    AvailabilityComponent,
    WaitlistThankyouComponent,
    EnrollThankyouComponent,
    TutionFeeComponent,
    ProviderUrlComponent,
    ModalTooltipComponent,
    ApplicationPerfrencesComponent,
    EnrollmentComponent,
    ConfirmPopupComponent,
    SuccessPopupComponent,
    LicenceModalTooltipComponent,
    ViewEnrollmentDocumentsComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    MatCheckboxModule,
    EnrollmentModule,
    RouterModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSearchSelectModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class CustomModalModule { }
