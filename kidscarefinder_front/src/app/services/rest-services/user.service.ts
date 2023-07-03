import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { Injectable } from '@angular/core';
import { API } from 'src/app/utills/constant/api.constant';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  providerDeatils: any;
  baseUrl: string;
  newMsgCount: any = 0;
  filters: any = {};
  private dataSource = new BehaviorSubject<any>({});
  data: Observable<string> = this.dataSource.asObservable();
  private filterSource = new BehaviorSubject<any>({});
  filter: Observable<string> = this.filterSource.asObservable();

  private applyOnlineData: any;
  private getItemData: any;
  private parentList: any;
  private authList: any;
  private dentist: any;
  private pedia: any;
  private wait: any;
  private enroll: any;
  private userData: any;
  private urlSign: any;
  private pdfLink: any;
  private envelope: any;

  constructor(
    private LocalstorageService: LocalstorageService,
    private http: HttpClient,
    private authservice: AuthService,
    private localStorage: LocalstorageService
  ) {
    this.baseUrl = environment.baseUrl;
    this.providerDeatils = this.localStorage.getUser();
  }

  sendData(data: string) {
    this.dataSource.next(data);
  }
  sendFilter(data: string) {
    this.filterSource.next(data);
  }
  // User Profile
  getUserById(id: any): Observable<any> {
    let userDetails = this.baseUrl + API.userDetails + id;
    return this.http.get<any>(userDetails);
  }

  uploadDocuments(data: any){
    let photo = this.baseUrl + API.photo;
    return this.http.post<any>(photo, data);
  }


  photo(data: any): Observable<any> {
    let photo = this.baseUrl + API.photo;
    const formData = new FormData();
    formData.append('upload_file', data);
    let id = localStorage.getItem('user_id');
    return this.http.post<any>(photo, formData);
  }

  addChild(data: any): Observable<any> {
    let headers = this.authservice.getCustomHeaders();
    let childAdd = this.baseUrl + API.addChild;
    return this.http.post<any>(childAdd, data, { headers: headers });
  }

  addPregnancy(data: any): Observable<any> {
    let headers = this.authservice.getCustomHeaders();
    let pregAdd = this.baseUrl + API.addPregnancy;
    return this.http.post<any>(pregAdd, data, { headers: headers });
  }

  getChild(data: any): Observable<any> {
    let id = localStorage.getItem('user_id');
    let getChild = this.baseUrl + API.getChild;
    return this.http.get<any>(getChild + id);
  }


  getChildById(id: any): Observable<any> {
    let getChild = this.baseUrl + API.getChild;
    return this.http.get<any>(getChild + id);
  }

  putChild(data: any): Observable<any> {
    let id = localStorage.getItem('user_id');
    let getChild = this.baseUrl + API.getChild;
    return this.http.put<any>(getChild + id, data);
  }

  userBasic(data: any): Observable<any> {
    let basicInfo = this.baseUrl + API.userbasic;
    let id = localStorage.getItem('userid');
    return this.http.put<any>(basicInfo + id, data);
  }

  userUpdate(data: any): Observable<any> {
    let userDetailsUpdate = this.baseUrl + API.userDetailsUpdate;
    let headers = this.authservice.getCustomHeaders();

    return this.http.put<any>(userDetailsUpdate, data, { headers: headers });
  }

  userDetails(data: any): Observable<any> {
    let userDetails = this.baseUrl + API.userDetails;
    return this.http.get<any>(userDetails, data);
  }


  // Pedia-Dentist Add

  pediaAdd(data: any): Observable<any> {
    let pedia = this.baseUrl + API.addPedia;
    return this.http.post<any>(pedia, data);
  }

  dentistAdd(data: any): Observable<any> {
    let dentist = this.baseUrl + API.addDentist;

    return this.http.post<any>(dentist, data);
  }

  parentAdd(data: any): Observable<any> {
    let addParent = this.baseUrl + API.parentAdd;
    return this.http.post<any>(addParent, data);
  }

  authPersonAdd(data: any): Observable<any> {
    let addAuthPerson = this.baseUrl + API.authPerson;
    return this.http.post<any>(addAuthPerson, data);
  }

  getDentist(): Observable<any> {
    let dentistDetails = this.baseUrl + API.getDentist;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(dentistDetails + id);
  }

  getPedia(): Observable<any> {
    let pediaDetails = this.baseUrl + API.getPedia;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(pediaDetails + id);
  }

  getAuthPerson(): Observable<any> {
    let authPersonDetails = this.baseUrl + API.getauthPerson;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(authPersonDetails + id);
  }

  getParent(): Observable<any> {
    let ParentDetails = this.baseUrl + API.getparentAdd;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(ParentDetails + id);
  }


  sendMessage(data: any): Observable<any> {
    let id = localStorage.getItem('user_id');

    let msg = this.baseUrl + API.sharingMessgae + id;
    return this.http.put<any>(msg, data);
  }

  getMessage(data: any): Observable<any> {
    let msg = this.baseUrl + API.sharingMessgae;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(msg + id, data);
  }

  changeUserPass(data: any) {
    let headers = this.authservice.getCustomHeaders();
    let id = this.LocalstorageService.getUser().id;

    let changePass = this.baseUrl + API.userChangePass;
    return this.http.put<any>(changePass + id, data, { headers: headers });
  }

  changeUserName(data: any): Observable<any> {
    let changeName = this.baseUrl + API.usernameChange;
    let id = this.LocalstorageService.getUser().id;

    let token = this.LocalstorageService.getToken();
    return this.http.put<any>(changeName + id, data);
  }

  getProvider(): Observable<any> {
    let providerCategory = this.baseUrl + API.getProvider;
    return this.http.get<any>(providerCategory);
  }
  getMsgNotification(data: any): Observable<any> {
    let id = localStorage.getItem('user_id') || localStorage.getItem('provider_id');
    let msgNotify = this.baseUrl + API.getNotify;
    return this.http.get<any>(msgNotify + id);
  }

  postHealthHistory(data: any): Observable<any> {
    let id = localStorage.getItem('user_id');
    let healthHistory = this.baseUrl + API.healthHistory;
    return this.http.put<any>(healthHistory + id, data);
  }

  sendIllnessData(data: any): Observable<any> {
    let illness = this.baseUrl + API.illnessData;
    return this.http.post<any>(illness, data);
  }

  getData(): Observable<any> {
    let dta = this.baseUrl + API.getIllness;
    return this.http.get<any>(dta);
  }

  //Appy Online Services
  getUserAccount(data: any): Observable<any> {
    let user = this.baseUrl + API.userAccount;
    let id = localStorage.getItem('userid');

    return this.http.get<any>(user + id);
  }
  putUserAccount(data: any): Observable<any> {
    let user = this.baseUrl + API.userAccount;
    let id = localStorage.getItem('userid');
    let userid = localStorage.getItem('user_id');

    return this.http.put<any>(user + id + '/' + userid, data);
    // return this.http.put<any>(user + id);
  }
  getGuardianInfo(data: any): Observable<any> {
    let guardian = this.baseUrl + API.parentInfo;
    let id = localStorage.getItem('user_id');
    return this.http.get<any>(guardian + id);
  }
  putGuardianInfo(data: any): Observable<any> {
    let guardian = this.baseUrl + API.parentInfo;
    let id = localStorage.getItem('user_id');
    return this.http.put<any>(guardian + id, data);
  }

  getProviderInfo(data: any, userId: any): Observable<any> {
    let provider = this.baseUrl + API.providerInfo;
    let id;
    if (userId) {
      id = userId;
    } else {
      id = localStorage.getItem('userid');
    }
    return this.http.get<any>(provider + id);
  }
  putProviderInfo(data: any): Observable<any> {
    let provider = this.baseUrl + API.providerInfo;
    let id = localStorage.getItem('userid');
    return this.http.put<any>(provider + id, data);
  }
  // Delete API's Start
  deleteParent(data: any): Observable<any> {
    let dlt = this.baseUrl + API.deleteParent;
    let id = localStorage.getItem('user_id');
    let parentid = localStorage.getItem('parent_Id');
    return this.http.put<any>(dlt + id + '/' + parentid, data);
  }

  deletechild(data: any): Observable<any> {
    let dlt = this.baseUrl + API.deleteChild;
    let id = localStorage.getItem('user_id');
    let childPredId = localStorage.getItem('child_Id');
    return this.http.put<any>(dlt + id + '/' + childPredId, data);
  }

  deleteAuthorized(data: any): Observable<any> {
    let dlt = this.baseUrl + API.deleteAuthorized;
    let id = localStorage.getItem('user_id');
    let authPersonid = localStorage.getItem('auth_ID');
    return this.http.put<any>(dlt + id + '/' + authPersonid, data);
  }

  deletePedia(data: any): Observable<any> {
    let dlt = this.baseUrl + API.deletePedia;
    let id = localStorage.getItem('user_id');
    let pediaId = localStorage.getItem('pedia_Id');
    return this.http.put<any>(dlt + id + '/' + pediaId, data);
  }
  deleteDentist(data: any): Observable<any> {
    let dlt = this.baseUrl + API.deleteDentist;
    let id = localStorage.getItem('user_id');
    let dentistID = localStorage.getItem('dent_Id');
    return this.http.put<any>(dlt + id + '/' + dentistID, data);
  }
  // Delete API's End

  postApply(data: any): Observable<any> {
    let apply = this.baseUrl + API.postApplyOnline;
    return this.http.post<any>(apply, data);
  }

  searchDataWithParams(queryParams: any): Observable<any> {
    let search = this.baseUrl + API.searchData;
    if (queryParams) {
      search = search + queryParams;
    }
    return this.http.get<any>(search);
  }
  searchData(): Observable<any> {
    let search = this.baseUrl + API.searchData;
    return this.http.get<any>(search);
  }
  addToWaitList(data: any): Observable<any> {
    let waitList = this.baseUrl + API.addWaitlist;
    return this.http.post<any>(waitList, data);
  }

  // Edit API
  editPedia(data: any, id: any): Observable<any> {
    let userData = this.LocalstorageService.getUser();
    let PediatricianId = localStorage.getItem('Pededit');
    let editPedias =
      this.baseUrl +
      API.editPedia +
      userData.userDetails_id +
      '/' +
      PediatricianId;
    return this.http.put<any>(editPedias, data);
  }
  editDentist(data: any, id: any): Observable<any> {
    let userData = this.LocalstorageService.getUser();
    let DentistId = localStorage.getItem('DentEdit');
    let editDentist =
      this.baseUrl +
      API.editDentist +
      userData.userDetails_id +
      '/' +
      DentistId;
    return this.http.put<any>(editDentist, data);
  }
  editParent(data: any, id: any): Observable<any> {
    let userData = this.LocalstorageService.getUser();
    let ParentId = localStorage.getItem('Parentedit');
    let editParent =
      this.baseUrl + API.editParent + userData.userDetails_id + '/' + ParentId;
    return this.http.put<any>(editParent, data);
  }
  editAuthPerson(data: any, id: any): Observable<any> {
    let userData = this.LocalstorageService.getUser();
    let AuthPersonId = localStorage.getItem('Authedit');
    let editAuthPerson =
      this.baseUrl +
      API.editAuthPerson +
      userData.userDetails_id +
      '/' +
      AuthPersonId;
    return this.http.put<any>(editAuthPerson, data);
  }
  editChild(data: any, id: any): Observable<any> {
    let userData = this.LocalstorageService.getUser();
    let editChild = this.baseUrl + API.editChild + userData.userDetails_id;
    return this.http.put<any>(editChild, data);
  }

  async getPopUpPreference(popUpName: string): Promise<boolean> {
    const userId = localStorage.getItem('userid');
    const userDetails = await firstValueFrom(this.getUserById(userId));
    return userDetails.data[0].userDetails[popUpName]
  }
  fillPdfData(data: any): Observable<any> {
    let docuSign = this.baseUrl + API.call_docuSign;
    return this.http.post<any>(docuSign, data);
  }
  embedSignature(data: any): Observable<any> {
    let signature = this.baseUrl + API.embeddedSignature;
    return this.http.post<any>(signature, data);
  }
  signatureStatus(): Observable<any> {
    let statusUrl = this.getEnvelope();
    let status = this.baseUrl + API.envelopeStatus;

    return this.http.get<any>(status + statusUrl);

  }
  getDocLink(): Observable<any> {
    let docId = this.getEnvelope();
    let get_link = this.baseUrl + API.getSignatured_document;
    return this.http.get<any>(get_link + docId)

  }
  // upload_docFiles(data: any, id: any): Observable<any> {
  //   let userData = this.LocalstorageService.getUser();
  //   let docFile_upload = this.baseUrl + API.upload_docfiles + userData.userDetails_id;
  //   return this.http.put<any>(docFile_upload + data);

  // }
  //save and render data
  setData(resData: any) {
    this.wait = resData;
  }
  setEnrollData(resData: any) {
    this.enroll = resData;
  }
  getEnrollData(): any {
    return this.enroll;
  }
  getWaitData(): any {
    return this.wait;
  }
  setApplyOnlineData(data: any) {
    this.applyOnlineData = data;
  }

  getApplyOnlineData(): any {
    return this.applyOnlineData;
  }
  setUserData(data: any) {
    this.userData = data.data[0];
  }
  getUserData(): any {
    return this.userData;
  }
  setDocUrl(docUrl: any) {
    this.urlSign = docUrl;
  }
  getDocUrl(): any {
    return this.urlSign;
  }
  setDocuSignPdf(pdf: any) {
    this.pdfLink = pdf;
  }
  getDocuSignPdf(): any {
    return this.pdfLink;
  }
  setEnvelope(envelope_id: any) {
    this.envelope = envelope_id;
  }
  getEnvelope(): any {
    return this.envelope;
  }
  setEnrolledItem(item: any) {
    this.getItemData = item;
  }
  getEnrolledItem(): any {
    return this.getItemData;
  }
  checkStatus(data: any): Observable<any> {
    let userData = this.baseUrl + API.checkStatus;
    let id = localStorage.getItem('user_id');
    return this.http.put<any>(userData + '/' + id, data)
  }

  updateUserActivity(data: any) {
    const url: string = this.baseUrl + '/provider-appeared-in-search';
    return this.http.post<any>(url, data, {
      headers: {
        Authorization: 'Bearer ' + this.authservice.getAuthTokenFromLS()
      }
    });
  }
}
