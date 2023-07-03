import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from '../../shared/become-provider/sign-up.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSearchSelectModule } from '../../shared/mat-search-select/mat-search-select.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { RoleGuard } from 'src/app/gaurds/auth/role.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhoneNumberFormatPipe } from 'src/app/gaurds/pipes/phone-number-format.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';

import { DaycareBasicInfoComponent } from './daycare-basic-info/daycare-basic-info.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DaycareStepperComponent } from './daycare-stepper/daycare-stepper.component';
import { DaycareSidebarStepperComponent } from './daycare-sidebar-stepper/daycare-sidebar-stepper.component';
import { DaycareScheduleAvailabilityComponent } from './daycare-schedule-availability/daycare-schedule-availability.component';
import { DaycareScheduleReviewComponent } from './daycare-schedule-availability/daycare-schedule-review/daycare-schedule-review.component';
import { DaycarePhotoVideoComponent } from './daycare-photo-video/daycare-photo-video.component';
import { DaycareChildRequirementsComponent } from './daycare-child-requirements/daycare-child-requirements.component';
import { DaycareMealsComponent } from './daycare-meals/daycare-meals.component';
import { DaycareTeacherToAdultComponent } from './daycare-teacher-to-adult/daycare-teacher-to-adult.component';
import { DaycareTuitionsComponent } from './daycare-tuitions/daycare-tuitions.component';
import { DaycareAffiliationComponent } from './daycare-affiliation/daycare-affiliation.component';
import { DaycareAdminSettingComponent } from './daycare-admin-setting/daycare-admin-setting.component';
import { DaycareAccountTypeComponent } from './daycare-account-type/daycare-account-type.component';
import { DaycareAffiliationReviewComponent } from './daycare-affiliation/daycare-affiliation-review/daycare-affiliation-review.component';
import { DaycareAdminAddComponent } from './daycare-admin-setting/daycare-admin-add/daycare-admin-add.component';
import { DaycareAdminReviewComponent } from './daycare-admin-setting/daycare-admin-review/daycare-admin-review.component';
import { DaycareAccountTypeReviewComponent } from './daycare-account-type/daycare-account-type-review/daycare-account-type-review.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signup',
        canActivate: [RoleGuard],
        data: { role: 'PROVIDER', notLoggedin: 'true' },
        component: SignUpComponent,
      },
      { path: '', pathMatch: 'full', redirectTo: 'signup' },
      {
        path: 'step/:stepNumber',
        canActivate: [RoleGuard],
        data: { role: 'PROVIDER', notLoggedin: 'true' },
        component: DaycareStepperComponent,
      },

      // {path: 'step/:stepNumber', canActivate: [RoleGuard], data: {role: 'PROVIDER', notLoggedin:'true'}, component: DaycareBasicInfoComponent},
      { path: '', pathMatch: 'full', redirectTo: 'step/:stepNumber' },
    ],
  },
];

@NgModule({
  declarations: [
    DaycareBasicInfoComponent,
    DaycareStepperComponent,
    DaycareSidebarStepperComponent,
    DaycareScheduleAvailabilityComponent,
    DaycareScheduleReviewComponent,
    DaycarePhotoVideoComponent,
    DaycareChildRequirementsComponent,
    DaycareMealsComponent,
    DaycareTeacherToAdultComponent,
    DaycareTuitionsComponent,
    DaycareAffiliationComponent,
    DaycareAdminSettingComponent,
    DaycareAccountTypeComponent,
    DaycareAffiliationReviewComponent,
    DaycareAdminAddComponent,
    DaycareAdminReviewComponent,
    DaycareAccountTypeReviewComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    RouterModule,
    SharedModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSearchSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    GooglePlaceModule,
    MatTooltipModule,
    NgxMaskModule,
  ],
  exports: [DaycareStepperComponent],
  providers: [PhoneNumberFormatPipe],
})
export class DaycareSignupModule {}
