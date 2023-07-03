import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserFAQSSidebarComponent } from './user/user-faqs-sidebar/user-faqs-sidebar.component';
import { FAQsComponent } from './faqs.component';
import { AdvertisingSpaceComponent } from '../advertising-space/advertising-space.component';


import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FaqsProviderSidebarComponent } from './provider/faqs-provider-sidebar/faqs-provider-sidebar.component';
import { ProviderFAQsComponent } from './provider/provider-faqs/provider-faqs.component';
import { UserFaqsComponent } from './user/user-faqs/user-faqs.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: FAQsComponent },
      { path: 'provider-faqs', component: ProviderFAQsComponent },
      { path: 'user-faqs', component: UserFaqsComponent },
    ]
  }
];

@NgModule({
  declarations: [
    UserFAQSSidebarComponent,
    FAQsComponent,
    FaqsProviderSidebarComponent,
    ProviderFAQsComponent,
    UserFaqsComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    AdvertisingSpaceComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],

  exports: [
    UserFAQSSidebarComponent
  ]
})
export class FAQSModule { }
