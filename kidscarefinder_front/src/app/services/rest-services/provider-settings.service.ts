import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/utills/constant/api.constant';
import { LocalstorageService } from 'src/app/utills/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderSettingsService {
  baseUrl: string;

  constructor(private http: HttpClient,
    private localStorage: LocalstorageService,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getEnrollmentRequests(provider_id: any, category_id: any, enrolled: any, limit: any): Observable<any> {
    let url = this.baseUrl + API.enrollmentRequests + provider_id + '/' + category_id + '/' + enrolled + '/' + limit;
    return this.http.get<any>(url);
  }
  photo(data: any): Observable<any> {
    let photo = this.baseUrl + API.photo;
    const formData = new FormData();
    formData.append('upload_file', data);
    return this.http.post<any>(photo, formData);
  }
  getAllEnrollmentRequests(provider_id: any, category_id: any, enrolled: any): Observable<any> {
    let url = this.baseUrl + API.enrollmentRequests + provider_id + '/' + category_id + '/' + enrolled;
    return this.http.get<any>(url);
  }
  providerInfoUpdate(body: any, id: any): Observable<any> {
    let url = this.baseUrl + API.userbasic + id
    return this.http.put<any>(url, body);
  }
  providerNameUpdate(body: any, id: any): Observable<any> {
    let url = this.baseUrl + API.providerInfo + id
    return this.http.put<any>(url, body);
  }
  profilePicUpload(data: any, id: any): Observable<any> {
    let proPicUpload = this.baseUrl + API.proPicUpload;
    const formData = new FormData();
    formData.append('profile_photo', data);
    return this.http.put<any>(proPicUpload + id, formData);
  }
  profilePicDelete(id: any): Observable<any> {
    let proPicUpload = this.baseUrl + API.proPicUpload;
    const formData = new FormData();
    formData.append('profile_photo', '');
    return this.http.put<any>(proPicUpload + id, formData);
  }
  getNotification(id: any): Observable<any> {
    let url = this.baseUrl + API.providerNotification + id;
    return this.http.get<any>(url);
  }
  updateNotification(id: any, data: any): Observable<any> {
    let url = this.baseUrl + API.providerNotification + id;
    return this.http.put<any>(url, data);
  }
}
