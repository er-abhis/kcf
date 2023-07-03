import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from '../../utills/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  loginRole: any;
  constructor(
    private router: Router,
    private localstorage: LocalstorageService
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
    this.loginRole = JSON.parse(
      localStorage.getItem('userData') || '{}'
    ).userType;
    let isLoggedIn = this.localstorage.getUser();
    var size = Object.keys(isLoggedIn).length;
    if (size > 0) {
      return true;
    } else {
      this.router.navigate(['']);
    }
    return true;
  }
}
