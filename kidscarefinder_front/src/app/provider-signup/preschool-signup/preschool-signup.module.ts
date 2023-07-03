import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

import { SidebarStepsComponent } from './sidebar-steps/sidebar-steps.component';
import { SignUpComponent } from '../../shared/become-provider/sign-up.component';

import { BasicInformationComponent } from './basic-information/basic-information.component';
import { ScheduleAvailabilityComponent } from './schedule-availability/schedule-availability.component';
import { PhotoVideoComponent } from './photo-video/photo-video.component';
import { ChildRequirementsComponent } from './child-requirements/child-requirements.component';
import { MealsSnacksComponent } from './meals-snacks/meals-snacks.component';
import { TeacherChildRatioComponent } from './teacher-child-ratio/teacher-child-ratio.component';
import { TuitionComponent } from './tuition/tuition.component';
import { AffiliationsComponent } from './affiliations/affiliations.component';
import { AdminSettingComponent } from './admin-setting/admin-setting.component';
import { AccountTypeComponent } from './account-types/account-type/account-type.component';
import { StepperMainComponent } from './stepper-main/stepper-main.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { ScheduleReviewComponent } from './schedule-availability/schedule-review/schedule-review.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AffiliationReviewComponent } from './affiliations/affiliation-review/affiliation-review.component';
import { AdminAddComponent } from './admin-setting/admin-add/admin-add.component';
import { AdminReviewComponent } from './admin-setting/admin-review/admin-review.component';
import { ReviewPaymentComponent } from './account-types/review-payment/review-payment.component';
import { RoleGuard } from 'src/app/gaurds/auth/role.guard';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhoneNumberFormatPipe } from 'src/app/gaurds/pipes/phone-number-format.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import {NgxMaskModule} from "ngx-mask";

const routes: Routes = [
  {
    path: '', children: [
      // { path: '', component: SidebarStepsComponent },
      { path: 'signup', canActivate: [RoleGuard], data: {role: 'PROVIDER', notLoggedin:'true'}, component: SignUpComponent },
      { path: '', pathMatch: 'full', redirectTo: 'signup' },
      { path: 'step/:stepNumber', canActivate: [RoleGuard], data: {role: 'PROVIDER', notLoggedin:'true'}, component: StepperMainComponent },
      { path: 'review-payment', canActivate: [RoleGuard], data: {role: 'PROVIDER'}, component: ReviewPaymentComponent },
      // Babysitter
      {path: 'signup/1', loadChildren: () => import('../babysitter-signup/babysitter-signup.module').then(m => m.BabysitterSignupModule) },
      // {path: 'signup/4', loadChildren: () => import('../daycare-signup/daycare-signup.module').then(m => m.DaycareSignupModule) }

    ]
  }
];

@NgModule({
  declarations: [
    SidebarStepsComponent,
    SignUpComponent,
    BasicInformationComponent,
    ScheduleAvailabilityComponent,
    PhotoVideoComponent,
    ChildRequirementsComponent,
    MealsSnacksComponent,
    TeacherChildRatioComponent,
    TuitionComponent,
    AffiliationsComponent,
    AccountTypeComponent,
    AdminSettingComponent,
    StepperMainComponent,
    ScheduleReviewComponent,
    AffiliationReviewComponent,
    AdminAddComponent,
    AdminReviewComponent,
    ReviewPaymentComponent,
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
        NgxMaskModule

  ],
  exports: [
    StepperMainComponent,
  ],
  providers: [
    PhoneNumberFormatPipe
  ]
})
export class PreschoolSignupModule { }

