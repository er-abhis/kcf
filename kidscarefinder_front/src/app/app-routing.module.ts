import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { NoPageComponent } from './component/static_pages/no-page/no-page.component';
import { AuthGuard } from './gaurds/auth/auth.guard';
import { RoleGuard } from './gaurds/auth/role.guard';
import { EnrollmentDetailsComponent } from './user/enrollment-details/enrollment-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/user-impersonation/:data', component: HomeComponent },
  // About us Page
  { path: 'about-us', loadChildren: () => import('./component/static_pages/about-us/about-us.module').then(m => m.AboutUsModule) },

  // Privacy Policy
  { path: '', loadChildren: () => import('./component/static_pages/privacy-policies/privacy-policies.module').then(m => m.PrivacyPoliciesModule) },

  //FAQS
  { path: 'faqs', loadChildren: () => import('./component/static_pages/faqs/faqs.module').then(m => m.FAQSModule) },

  //support Page
  { path: 'support', loadChildren: () => import('./component/static_pages/support/foot-support.module').then(m => m.FootSupport) },

  // User Module Start
  { path: 'user', canActivate: [AuthGuard], data: { role: 'USER' }, loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'enrollment-details', canActivate: [AuthGuard], data: { role: 'USER' }, component: EnrollmentDetailsComponent },

  // Preschool Routes
  // { path: 'preschool', canActivate: [AuthGuard, RoleGuard], data: {role: 'USER'}, loadChildren: () => import('./component/preschool/preschool.module').then(m => m.PreschoolModule) },
  { path: 'preschool', loadChildren: () => import('./component/preschool/preschool.module').then(m => m.PreschoolModule) },
  // User Module end

  // provider route start
  { path: 'provider', loadChildren: () => import('./provider-signup/preschool-signup/preschool-signup.module').then(m => m.PreschoolSignupModule) },
  { path: 'daycare', loadChildren: () => import('./provider-signup/daycare-signup/daycare-signup.module').then(m => m.DaycareSignupModule) },
  { path: 'in-home_daycare', loadChildren: () => import('./provider-signup/in-home-daycare-signup/in-home-daycare-signup.module').then(m => m.InHomeDaycareSignupModule) },

  // proviter setting routes start
  { path: 'providerSettings', canActivate: [AuthGuard, RoleGuard], data: { role: 'PROVIDER' }, loadChildren: () => import('./provider-portal/provider-portal.module').then(m => m.ProviderSettingModule) },
  // provider route End

  //No Page Component
  { path: '**', component: NoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
