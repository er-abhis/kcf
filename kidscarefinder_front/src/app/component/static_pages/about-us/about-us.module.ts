import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsSidebarComponent } from './about-us-sidebar/about-us-sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from 'src/app/shared/layout/layout.module';
import { AdvertisingSpaceComponent } from '../advertising-space/advertising-space.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: AboutPageComponent },
    ]
  }
];

@NgModule({
  declarations: [
    AboutUsSidebarComponent,
    AboutPageComponent,
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
  ]
})
export class AboutUsModule { }
