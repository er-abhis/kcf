import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteOverviewComponent } from './site-overview/site-overview.component';
import { SupportSidebarComponent } from './support-sidebar/support-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { AdvertisingSpaceComponent } from '../advertising-space/advertising-space.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from 'src/app/shared/layout/layout.module';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'site-overview', component: SiteOverviewComponent },
    ]
  }
];

@NgModule({
  declarations: [
    SiteOverviewComponent,
    SupportSidebarComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdvertisingSpaceComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule
  ],

  exports: [
    SiteOverviewComponent,
    SupportSidebarComponent,
  ]
})
export class FootSupport  { }
