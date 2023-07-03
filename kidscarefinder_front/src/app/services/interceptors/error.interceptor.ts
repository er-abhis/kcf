import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/utills/localstorage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private localStorage: LocalstorageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => { },
        (error) => {
          if (error.status === 401) {
            // Handle 401 error here, such as redirecting to login page
            this.logout();
          }
        }
      )
    );
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('provider_id');
    this.localStorage.signOut();
    this.router.navigateByUrl('/');
  }
}
