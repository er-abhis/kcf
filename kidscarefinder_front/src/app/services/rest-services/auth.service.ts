import { Injectable } from '@angular/core';
import { API } from 'src/app/utills/constant/api.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn() {
    throw new Error('Method not implemented.');
  }
  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  // Login API
  login(data: any): Observable<any> {
    let loginApi = this.baseUrl + API.login;
    return this.http.post<any>(loginApi, data);
  }

  // After signup verify OTp
  accountActivateOtp(data: any): Observable<any> {
    let accountActivateOtp = this.baseUrl + API.accountActivateOtp;
    return this.http.post<any>(accountActivateOtp, data);
  }

  // signup API
  signup(data: any): Observable<any> {
    let signupApi = this.baseUrl + API.signup;
    return this.http.post<any>(signupApi, data);
  }

  // OTP API
  otp(data: any): Observable<any> {
    let otpApi = this.baseUrl + API.otpApi;
    return this.http.post<any>(otpApi, data);
  }

  // Forgot Password API
  forgotPass(data: any): Observable<any> {
    let forgotAPI = this.baseUrl + API.forgotAPI;
    return this.http.put<any>(forgotAPI, data);
  }
  //reset otp verify
  resetOTPVerified(data: any): Observable<any> {
    let resetOTPVerify = this.baseUrl + API.resetOTPVerify;
    return this.http.put<any>(resetOTPVerify, data);
  }

  //forgot password otp verify
  forgotPassOtpVerify(data: any): Observable<any> {
    let forgotPassOtpVerify = this.baseUrl + API.forgotPassOtpVerify;
    return this.http.post<any>(forgotPassOtpVerify, data);
  }

  signin(data: any) {}

  changeProviderPassword(id: number, data: any) {
    let headers = this.getCustomHeaders();
    let passwordAPI = this.baseUrl + API.providerChangePassword + id;
    return this.http.put<any>(passwordAPI, data, { headers: headers });
  }

  getCustomHeaders(): HttpHeaders {
    let token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token);
    return headers;
  }

  getAuthTokenFromLS() {
    const token = localStorage.getItem('auth-token');
    if (token) {
      return token
    } else {
      return null
    }
  }
}
