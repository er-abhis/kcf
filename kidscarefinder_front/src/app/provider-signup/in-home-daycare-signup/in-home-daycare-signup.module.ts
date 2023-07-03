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

import { InHomeDaycareBasicInfoComponent } from './in-home-daycare-basic-info/in-home-daycare-basic-info.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { InHomeDaycareStepperComponent } from './in-home-daycare-stepper/in-home-daycare-stepper.component';
import { InHomeDaycareSidebarComponent } from './in-home-daycare-sidebar/in-home-daycare-sidebar.component';
import { InHomeDaycareScheduleAvailabilityComponent } from './in-home-daycare-schedule-availability/in-home-daycare-schedule-availability.component';


import { InHomeDaycareAccountTypeComponent } from './in-home-daycare-account-type/in-home-daycare-account-type.component';
import { InHomeDaycareAdminSettingComponent } from './in-home-daycare-admin-setting/in-home-daycare-admin-setting.component';
import { InHomeDaycareAffiliationComponent } from './in-home-daycare-affiliation/in-home-daycare-affiliation.component';
import { InHomeDaycareChildRequirementsComponent } from './in-home-daycare-child-requirements/in-home-daycare-child-requirements.component';
import { InHomeDaycareMealsComponent } from './in-home-daycare-meals/in-home-daycare-meals.component';
import { InHomeDaycarePhotoVideoComponent } from './in-home-daycare-photo-video/in-home-daycare-photo-video.component';
import { InHomeDaycareTeacherToAdultComponent } from './in-home-daycare-adult-to-child/in-home-daycare-adult-to-child.component';
import { InHomeDaycareTuitionsComponent } from './in-home-daycare-tuitions/in-home-daycare-tuitions.component';
import { InHomeDaycareScheduleReviewComponent } from './in-home-daycare-schedule-availability/in-home-daycare-schedule-review/in-home-daycare-schedule-review.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'signup', canActivate: [RoleGuard], data: { role: 'PROVIDER', notLoggedin: 'true' }, component: SignUpComponent },
      { path: '', pathMatch: 'full', redirectTo: 'signup' },
      { path: 'step/:stepNumber', canActivate: [RoleGuard], data: { role: 'PROVIDER', notLoggedin: 'true' }, component: InHomeDaycareStepperComponent },

      // {path: 'step/:stepNumber', canActivate: [RoleGuard], data: {role: 'PROVIDER', notLoggedin:'true'}, component: DaycareBasicInfoComponent},
      { path: '', pathMatch: 'full', redirectTo: 'step/:stepNumber' },
    ],
  },
];

@NgModule({
  declarations: [
    InHomeDaycareStepperComponent,
    InHomeDaycareSidebarComponent,
    InHomeDaycareBasicInfoComponent,
    InHomeDaycareAccountTypeComponent,
    InHomeDaycareAdminSettingComponent,
    InHomeDaycareAffiliationComponent,
    InHomeDaycareChildRequirementsComponent,
    InHomeDaycareMealsComponent,
    InHomeDaycarePhotoVideoComponent,
    InHomeDaycareScheduleAvailabilityComponent,
    InHomeDaycareTeacherToAdultComponent,
    InHomeDaycareTuitionsComponent,
    InHomeDaycareScheduleReviewComponent,
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
  exports: [InHomeDaycareStepperComponent],
  providers: [PhoneNumberFormatPipe],
})
export class InHomeDaycareSignupModule { }
