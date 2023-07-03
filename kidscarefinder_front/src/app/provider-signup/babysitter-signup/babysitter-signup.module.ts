import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BabysitterSignupFormComponent} from './babysitter-signup-form/babysitter-signup-form.component';
import {LayoutModule} from "../../shared/layout/layout.module";
import {Routes, RouterModule} from "@angular/router";
import {RoleGuard} from "../../gaurds/auth/role.guard";
import { BsSignupSidebarComponent } from './components/bs-signup-sidebar/bs-signup-sidebar.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatStepperModule} from "@angular/material/stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BsSignupStepOneComponent } from './components/bs-signup-step-one/bs-signup-step-one.component';
import { BsSignupStepOneSubStepOneComponent } from './components/bs-signup-step-one/components/bs-signup-step-one-sub-step-one/bs-signup-step-one-sub-step-one.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxMaskModule} from "ngx-mask";
import {SharedModule} from "../../shared/shared.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import { BasicInfoDescriptionComponent } from './components/bs-signup-step-one/components/basic-info-description/basic-info-description.component';
import { ReviewStepOneComponent } from './components/bs-signup-step-one/components/review-step-one/review-step-one.component';

const routes: Routes = [
  {path: 'step/:stepNumber', canActivate: [RoleGuard], data: {role: 'PROVIDER', notLoggedin:'true'}, component: BabysitterSignupFormComponent},
  {path: '', pathMatch: 'full', redirectTo: 'step/:stepNumber'},
];

@NgModule({
  declarations: [
    BabysitterSignupFormComponent,
    BsSignupSidebarComponent,
    BsSignupStepOneComponent,
    BsSignupStepOneSubStepOneComponent,
    BasicInfoDescriptionComponent,
    ReviewStepOneComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    MatStepperModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    NgxMaskModule,
    SharedModule,
    MatDatepickerModule,
    GooglePlaceModule,
    FormsModule,
  ]
})
export class BabysitterSignupModule {
}
