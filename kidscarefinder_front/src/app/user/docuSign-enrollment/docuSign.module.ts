import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStepperComponent } from './docuSign-stepper/enrollment-stepper.component';
import { EnrollmentSidebarComponent } from './docuSign-sidebar/enrollment-sidebar.component';
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
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from '../../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DetailsComponent } from './docuSign-details/details.component';
import { EnrollmentParentInfoComponent } from './docuSign-parent-info/enrollment-parent-info.component';
import { EnrollmentAuthorizedPersonsComponent } from './docuSign-authorized-persons/enrollment-authorized-persons.component';
import { EnrollmentHealthHistoryComponent } from './docuSign-health-history/enrollment-health-history.component';
import { EnrollmentMedicalContactsComponent } from './docuSign-medical-contacts/enrollment-medical-contacts.component';
import { EnrollmentValidationComponent } from './docuSign-validation/enrollment-validation.component';
import { EnrollmentSignaturesComponent } from './docuSign-signatures/enrollment-signatures.component';
import { EnrollmentUploadAdditionalDocumentsComponent } from './docuSign-upload-additional-documents/enrollment-upload-additional-documents.component';
import { UsualPickerComponent } from './docuSign-health-history/usual-picker/usual-picker.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {NgxMaskModule} from "ngx-mask";



@NgModule({
  declarations: [
    EnrollmentStepperComponent,
    EnrollmentSidebarComponent,
    DetailsComponent,
    EnrollmentParentInfoComponent,
    EnrollmentAuthorizedPersonsComponent,
    EnrollmentHealthHistoryComponent,
    EnrollmentMedicalContactsComponent,
    EnrollmentValidationComponent,
    EnrollmentSignaturesComponent,
    EnrollmentUploadAdditionalDocumentsComponent,
    UsualPickerComponent
  ],
    imports: [
        CommonModule,
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
        LayoutModule,
        NgxMaterialTimepickerModule,
        MatDatepickerModule,
        NgxMaskModule
    ],
  exports: [
    EnrollmentStepperComponent,
  ]
})
export class EnrollmentModule { }
