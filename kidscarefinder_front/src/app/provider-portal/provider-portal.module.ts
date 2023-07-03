import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { LayoutModule } from '../shared/layout/layout.module';

import { AccountBillingComponent } from './account-billing/account-billing.component';
import { ManageWaitlistComponent } from './manage-waitlist/manage-waitlist.component';
import { MyInformationComponent } from './my-information/my-information.component';
import { ProviderApplicationsComponent } from './provider-applications/provider-applications.component';
import { ProviderEnrollmentComponent } from './provider-enrollment/provider-enrollment.component';
import { ProviderMessageCenterComponent } from './provider-message-center/provider-message-center.component';
import { ProviderSupportComponent } from './provider-support/provider-support.component';

import { BasicInfoComponent } from './update-details/step1/basic-info/basic-info.component';
import { ScheduleAvailComponent } from './update-details/step2/schedule-avail/schedule-avail.component';
import { PhotoVideoComponent } from './update-details/step3/photo-video/photo-video.component';
import { ChildRequirementsComponent } from './update-details/step4/child-requirements/child-requirements.component';
import { MealsSnacksComponent } from './update-details/step5/meals-snacks/meals-snacks.component';
import { TeacherChildComponent } from './update-details/step6/teacher-child/teacher-child.component';
import { TuitionComponent } from './update-details/step7/tuition/tuition.component';
import { AffiliationsComponent } from './update-details/step8/affiliations/affiliations.component';
import { AdminsSettingsComponent } from './update-details/step9/admins-settings/admins-settings.component';

import { UserActivityComponent } from './user-activity/user-activity.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateDetailsSidebarComponent } from './update-details/update-details-sidebar/update-details-sidebar.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSearchSelectModule } from '../shared/mat-search-select/mat-search-select.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { InvitationDialogComponent } from './manage-waitlist/invitation-dialog.component/invitation-dialog.component';
import { AlertDialogComponent } from './manage-waitlist/alert-dialog/alert-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxMaskModule} from "ngx-mask";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'user-activity', component: UserActivityComponent },
      {
        path: 'provider-message-center',
        component: ProviderMessageCenterComponent,
      },
      { path: 'manage-waitlist', component: ManageWaitlistComponent },
      {
        path: 'provider-applications',
        component: ProviderApplicationsComponent,
      },
      { path: 'provider-enrollment', component: ProviderEnrollmentComponent },
      { path: 'my-information', component: MyInformationComponent },
      { path: 'account-billing', component: AccountBillingComponent },
      // { path: 'update-details', component: UpdateDetailsComponent },
      // { path: 'update-details/step1', component: BasicInfoComponent },
      // { path: 'update-details/step2', component: ScheduleAvailComponent },
      // { path: 'update-details/step3', component: PhotoVideoComponent },
      // { path: 'update-details/step4', component: ChildRequirementsComponent },
      // { path: 'update-details/step5', component: MealsSnacksComponent },
      // { path: 'update-details/step6', component: TeacherChildComponent },
      // { path: 'update-details/step7', component: TuitionComponent },
      // { path: 'update-details/step8', component: AffiliationsComponent },
      // { path: 'update-details/step9', component: AdminsSettingsComponent },
      { path: 'provider-support', component: ProviderSupportComponent },
    ],
  },
  // { path: 'update-details', component: UpdateDetailsSidebarComponent}
];

@NgModule({
  declarations: [
    AccountBillingComponent,
    ManageWaitlistComponent,
    MyInformationComponent,
    ProviderApplicationsComponent,
    ProviderEnrollmentComponent,
    ProviderMessageCenterComponent,
    ProviderSupportComponent,
    UserActivityComponent,
    BasicInfoComponent,
    ScheduleAvailComponent,
    PhotoVideoComponent,
    ChildRequirementsComponent,
    MealsSnacksComponent,
    TuitionComponent,
    AffiliationsComponent,
    TeacherChildComponent,
    AdminsSettingsComponent,
    UpdateDetailsSidebarComponent,
    InvitationDialogComponent,
    AlertDialogComponent,
  ],
    imports: [
        CommonModule,
        LayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        SharedModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        GooglePlaceModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatStepperModule,
        MatSearchSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        RouterModule.forChild(routes),
        MatTooltipModule,
        NgxMaskModule,
    ],
})
export class ProviderSettingModule { }
