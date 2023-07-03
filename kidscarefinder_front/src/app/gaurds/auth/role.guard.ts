import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from '../../utills/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  loginRole: any;

  constructor(
    private router: Router,
    private localstorage: LocalstorageService,
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    let isLoggedIn = this.localstorage.getUser();
    // if (isLoggedIn.user_type == 'PROVIDER') {
    //   this.toasterService.error(
    //     'User credentials not found! Please Signup as a User'
    //   );
    //   return false;
    // }
    var size = Object.keys(isLoggedIn).length;
    if (
      !isLoggedIn.user_type &&
      route.data['notLoggedin'] &&
      route.data['notLoggedin'] == 'true'
    ) {
      return true;
    } else if (size > 0) {
      this.loginRole = this.localstorage.getUser()?.user_type;
      if (route.data['role'] && route.data['role'] == this.loginRole) {
        // this.router.navigate(['/login']);
        return true;
      } else {
        return false;
      }
    } else {
      this.router.navigate(['']);
    }
    return true;
  }
}
