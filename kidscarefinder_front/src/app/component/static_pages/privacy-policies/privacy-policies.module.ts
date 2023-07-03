import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PrivacyPoliciesSidebarComponent } from './privacy-policies-sidebar/privacy-policies-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from 'src/app/shared/layout/layout.module';

import { AdvertisingSpaceComponent } from '../advertising-space/advertising-space.component';
import { CopyrightPolicyComponent } from './copyright-policy/copyright-policy.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      // { path: 'copyright-policy', component: CopyrightPolicyComponent},
    ]
  }
];


@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    PrivacyPoliciesSidebarComponent,
    CopyrightPolicyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    AdvertisingSpaceComponent
  ],

  exports: [
    PrivacyPoliciesSidebarComponent,
    AdvertisingSpaceComponent
  ]

})
export class PrivacyPoliciesModule { }
