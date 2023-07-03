import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/component/static_pages/header/header.component';
import { FooterComponent } from 'src/app/component/static_pages/footer/footer.component';
import { MenuComponent } from 'src/app/component/static_pages/menu/menu.component';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserSidebarComponent } from 'src/app/user/user-sidebar/user-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { ProviderSettingSidebarComponent } from 'src/app/provider-portal/provider-setting-sidebar/provider-setting-sidebar.component';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    UserSidebarComponent,
    ProviderSettingSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    UserSidebarComponent,
    ProviderSettingSidebarComponent,
  ]
})
export class LayoutModule { }
