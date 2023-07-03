import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { LocalstorageService } from './localstorage.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient, private router: Router, private localStorage: LocalstorageService, private notificationService: NotificationService) { }

  getAccessToken() {
    var accessToken = '';
    if (localStorage['getToken']()) {                                             //if (this.localStorage.getToken())
      accessToken = 'Bearer ' + this.localStorage.getToken() as string;
    } else {
      this.router.navigateByUrl('/signin');
    }
    return accessToken;
  }

  get(url: any, data: any, headers: any) {
    var headersObj = new HttpHeaders({
      'Authorization': headers.authToken ? headers.authToken : '',
    });
    let options = {
      params: (data != null && data.params != null) ? new HttpParams({ fromObject: data.params }) : {},
      headers: headersObj
    };
    return this.http.get(url, options).pipe(
      catchError(this.handleError)
    );
  }
  getfor(url: any, data: any, headers: any) {
    let options = {
      params: (data != null && data.params != null) ? new HttpParams({ fromObject: data.params }) : {},
    };
    return this.http.get(url, options).pipe(
      catchError(this.handleError)
    );
  }


  post(url: any, data: any, headers: any) {
    var headersObj = new HttpHeaders();
    headersObj = headersObj.set('Authorization', headers.authToken ? headers.authToken : this.getAccessToken());
    if (headers.contentType) {
      headersObj = headersObj.set('content-type', headers.contentType);
    }

    return this.http.post(url, data, { headers: headersObj, observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }

  put(url: any, data: any, headers: any ) {
    var headersObj = new HttpHeaders();
    headersObj = headersObj.set('Authorization', headers.authToken ? headers.authToken : this.getAccessToken());
    if (headers.contentType) {
      headersObj = headersObj.set('content-type', headers.contentType);
    }

    return this.http.put(url, data, { headers: headersObj, observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }
  postForget(url: any, data: any, headers: any) {
    var headersObj = new HttpHeaders();
    if (headers.contentType) {
      headersObj = headersObj.set('content-type', headers.contentType);
    }

    return this.http.post(url, data, { headers: headersObj, observe: 'response' });
  }

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 401) {
    } else if (error.status === 403) {
      this.localStorage.signOut();
      window.location.reload();
    } else if (error.status === 0) {
    } else {
      if (error && error.error && error.error.message) {
        this.notificationService.showPopup('danger', '', error.error.message, 'Ok', '', '');
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
