import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { LayoutModule } from 'src/app/shared/layout/layout.module';

import { AccountSettingComponent } from './account-setting/account-setting.component';
import { AuthorizedPersonComponent } from './authorized-person/authorized-person.component';
import { EnrollmentDetailsComponent } from './enrollment-details/enrollment-details.component';
import { HealthHistoryComponent } from './health-history/health-history.component';
import { MedicalContactComponent } from './medical-contact/medical-contact.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { MyProviderComponent } from './my-provider/my-provider.component';
import { NannyPreferenceComponent } from './nanny-preference/nanny-preference.component';
import { ParentInformationComponent } from './parent-information/parent-information.component';
import { ProfileComponent } from './profile/profile.component';
import { SupportComponent } from './support/support.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MyChildrenComponent } from './profile/my-children/my-children.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserPublicPageComponent } from './user-public-page/user-public-page.component';
import { UsualTimePickerInputComponent } from './health-history/usual-time-picker-input/usual-time-picker-input.component';
import { MoboTopMenuComponent } from './user-sidebar/mobo-top-menu/mobo-top-menu.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxMaskModule} from "ngx-mask";
import { PastIllnessComponent } from './health-history/past-illness/past-illness.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'account-setting', component: AccountSettingComponent },
      { path: 'authorized-person', component: AuthorizedPersonComponent },
      { path: 'health-history', component: HealthHistoryComponent },
      { path: 'medical-contact', component: MedicalContactComponent },
      { path: 'message-center', component: MessageCenterComponent },
      { path: 'my-providers', component: MyProviderComponent },
      { path: 'nanny-prference', component: NannyPreferenceComponent },
      { path: 'parent-information', component: ParentInformationComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'support', component: SupportComponent },
      { path: ':id', component: UserPublicPageComponent }
    ],
  },
];

@NgModule({
  declarations: [
    AccountSettingComponent,
    AuthorizedPersonComponent,
    EnrollmentDetailsComponent,
    HealthHistoryComponent,
    MedicalContactComponent,
    MessageCenterComponent,
    MyProviderComponent,
    NannyPreferenceComponent,
    ParentInformationComponent,
    ProfileComponent,
    SupportComponent,
    MyChildrenComponent,
    UserPublicPageComponent,
    UsualTimePickerInputComponent,
    MoboTopMenuComponent,
    PastIllnessComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    RouterModule.forChild(routes),
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatListModule,
    MatTreeModule,
    GooglePlaceModule,
    NgxMaterialTimepickerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    NgxMaskModule,
  ],
  exports: [
    AccountSettingComponent,
    AuthorizedPersonComponent,
    EnrollmentDetailsComponent,
    HealthHistoryComponent,
    MedicalContactComponent,
    MessageCenterComponent,
    MyProviderComponent,
    NannyPreferenceComponent,
    ParentInformationComponent,
    ProfileComponent,
    SupportComponent,
  ],
})
export class UserModule { }
