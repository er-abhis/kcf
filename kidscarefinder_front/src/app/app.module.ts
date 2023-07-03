import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeComponent } from './component/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoPageComponent } from './component/static_pages/no-page/no-page.component';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LayoutModule } from './shared/layout/layout.module';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { HomeModule } from './component/home/home.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReligiousComponent } from './component/preschool/religious/religious.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSearchSelectModule } from './shared/mat-search-select/mat-search-select.module';
import { TokenInterceptor } from './services/interceptors/token.interceptor';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { ConfirmboxComponent } from './shared/confirmbox/confirmbox.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TermsUSer } from './component/static_pages/custom-modal/terms-signup/terms.component';
import { ToastrModule } from 'ngx-toastr';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTableModule } from '@angular/material/table';
import { CustomModalModule } from './component/static_pages/custom-modal/custom-modal.module';
import { SharedModule } from './shared/shared.module';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from './gaurds/pipes/custom-date-adapter';
import { CustomisableDialogComponent } from './component/customisable-dialog/customisable-dialog.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    NoPageComponent,
    ReligiousComponent,
    ConfirmboxComponent,
    TermsUSer,
    CustomisableDialogComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule,
    FormsModule,
    MatNativeDateModule,
    HttpClientModule,
    ReactiveFormsModule,
    LayoutModule,
    MatSearchSelectModule,
    SlickCarouselModule,
    AngularMaterialModule,
    HomeModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSortModule,
    MatTableModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    GooglePlaceModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TextFieldModule,
    CustomModalModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
