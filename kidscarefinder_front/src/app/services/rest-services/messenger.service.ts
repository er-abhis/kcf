import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/utills/constant/api.constant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  user: any = null;
  baseUrl: string;
  childArr: any = [];

  constructor(private http: HttpClient,
    private authservice: AuthService,) {
    this.baseUrl = environment.baseUrl;
  }

  sendMessage(data: any): Observable<any> {
    let messengerInfo = this.baseUrl + API.sendMessage;
    return this.http.post<any>(messengerInfo, data);
  }
  updateMessage(body: any,id: any): Observable<any> {
    let messengerInfo = this.baseUrl + API.message;
    return this.http.put<any>(messengerInfo, body);
  }
  getMessage(id: any): Observable<any> {
    let messengerInfo = this.baseUrl + API.message + id;
    return this.http.get<any>(messengerInfo);
  }
  roomMessages(id: any): Observable<any> {
    let messengerInfo = this.baseUrl + API.roomMessages + id;
    return this.http.get<any>(messengerInfo);
  }
  allrooms(data: any): Observable<any> {
    let headers = this.authservice.getCustomHeaders();
    let messengerInfo = this.baseUrl + API.allRooms;
    return this.http.post<any>(messengerInfo, data, { headers: headers });
  }
  getChild(id: any): Observable<any> {
    let getChild = this.baseUrl + API.getChild;
    return this.http.get<any>(getChild + id);
  }
}
