import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreschoolComponent } from './preschool.component';
import { AdvertisingSpaceComponent } from '../static_pages/advertising-space/advertising-space.component';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { RouterModule, Routes } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSearchSelectModule } from 'src/app/shared/mat-search-select/mat-search-select.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ReviewComponent } from './review/review.component';
import { HomeModule } from '../home/home.module';
import { ReviewListComponent } from './review/review-pages/review-list/review-list.component';
import { SingleResultsComponent } from './single-results/single-results.component';
import { ResultComponent } from './result/result.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ApplyOnlineComponent } from '../static_pages/custom-modal/single-result/apply-online/apply-online.component';
import { MatSelectModule } from '@angular/material/select';
import { AuthGuard } from 'src/app/gaurds/auth/auth.guard';
import { RoleGuard } from 'src/app/gaurds/auth/role.guard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReviewFormComponent } from './review/review-pages/review-form/review-form.component';
import {NgxMaskModule} from "ngx-mask";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PreschoolComponent },
      { path: 'result', component: ResultComponent },
      { path: ':state/:city/:username/:id', component: SingleResultsComponent },
      { path: ':id', component: SingleResultsComponent },
      { path: 'apply-online', component: ApplyOnlineComponent },
    ]
  }
];

@NgModule({
  declarations: [
    PreschoolComponent,
    ReviewComponent,
    ReviewListComponent,
    ReviewFormComponent,
    ResultComponent,
    SingleResultsComponent,
    ApplyOnlineComponent,
  ],
    imports: [
        CommonModule,
        LayoutModule,
        RouterModule.forChild(routes),
        HomeModule,
        MatStepperModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        GooglePlaceModule,
        MatSearchSelectModule,
        AdvertisingSpaceComponent,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        NgxMaskModule
    ],
  exports: [
    PreschoolComponent,
    ReviewComponent,
    ReviewListComponent,
    ReviewFormComponent,
    ResultComponent,
    SingleResultsComponent,
  ]
})
export class PreschoolModule { }
