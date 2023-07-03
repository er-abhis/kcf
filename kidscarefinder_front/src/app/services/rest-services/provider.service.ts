import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { API } from 'src/app/utills/constant/api.constant';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  clickedFromSideBar = new BehaviorSubject({});
  enableSideBar = new BehaviorSubject(false);
  sideBarChange = new BehaviorSubject(false);
  providerDeatils: any;
  uniqueProviderId: any;
  baseUrl: string;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService,
    private authService: AuthService
  ) {
    this.providerDeatils = this.localStorageService.getUser();
    this.baseUrl = environment.baseUrl;
  }

  applicationSearch(providerid: any, providercategoryid: any, search: any) {
    let url =
      this.baseUrl +
      API.providerSearch +
      providerid +
      '/' +
      providercategoryid +
      '/1' +
      '?name=' +
      search;
    return this.http.get<any>(url);
  }
  getLanguages() {
    let url = this.baseUrl + API.language;
    return this.http.get<any>(url);
  }
  getReligions() {
    let url = this.baseUrl + API.religion;
    return this.http.get<any>(url);
  }
  enrollmentSearch(providerid: any, providercategoryid: any, search: any) {
    let url =
      this.baseUrl +
      API.providerSearch +
      providerid +
      '/' +
      providercategoryid +
      '/2' +
      '?name=' +
      search;
    return this.http.get<any>(url);
  }
  waitlistSearch(providerid: any, providercategoryid: any, search: any) {
    let url =
      this.baseUrl +
      API.providerSearch +
      providerid +
      '/' +
      providercategoryid +
      '/3' +
      '?name=' +
      search;
    return this.http.get<any>(url);
  }
  updateWaitList(data: any) {
    let url =
      this.baseUrl +
      API.userWaitlist +
      this.localStorageService.getUser().provider_id +
      '/';
    return this.http.put<any>(url, data);
  }
  getProviderDashboard() {
    let userData = this.localStorageService.getUser();
    let url = this.baseUrl + API.providerDashboard + userData?.provider_id;
    return this.http.get<any>(url);
  }
  searchAffiliatedprovider(id: any) {
    let url = this.baseUrl + API.affiliatedprovider;

    return this.http.post<any>(url, { params: id });
  }
  provActivity(id: any, data: any) {
    let url = this.baseUrl + API.provActivity + id;

    return this.http.post<any>(url, data);
  }
  getAffiliatedprovider(id: any) {
    let url = this.baseUrl + API.getAffiliatedProvider + id;
    return this.http.get<any>(url);
  }

  delAffiliatedprovider(mainProv: any, affiliatedprov: any) {
    let data = {
      is_deleted: true,
    };
    let url =
      this.baseUrl +
      API.getAffiliatedProvider +
      mainProv +
      '/' +
      affiliatedprov;
    return this.http.put<any>(url, data);
  }
  addAffiliatedprovider(body: any) {
    let url = this.baseUrl + API.addAffiliatedprovider;
    return this.http.post<any>(url, body);
  }
  searchDetails(id: any) {
    let url = this.baseUrl + API.searchDetails + id;
    return this.http.get<any>(url);
  }
  getProviderBasicInfo() {
    let userData = this.localStorageService.getUser();
    let proBasicInfo =
      this.baseUrl + API.providerBasicInfo + '/' + userData?.provider_id;
    return this.http.get<any>(proBasicInfo);
  }

  //Provider Basic info API
  providerBasicInfo(data: any): Observable<any> {
    let proBasicInfo = this.baseUrl + API.providerLicense;
    return this.http.put<any>(proBasicInfo, data);
  }
  myprovider(data: any, queryParams?: any): Observable<any> {
    let url = this.baseUrl + API.myprovider + data;
    if (queryParams) {
      url = url + queryParams;
    }
    return this.http.get<any>(url);
  }
  cardDetails(data: any): Observable<any> {
    let url = this.baseUrl + API.cardDetails;
    return this.http.post<any>(url, data);
  }
  bankAccount(data: any): Observable<any> {
    let url = this.baseUrl + API.bankAccount;
    return this.http.post<any>(url, data);
  }
  subscription(data: any): Observable<any> {
    let url = this.baseUrl + API.subscription + data;
    return this.http.get<any>(url);
  }
  favourite(data: any): Observable<any> {
    let url = this.baseUrl + API.favourite + data;
    return this.http.get<any>(url);
  }
  updatefavourite(data: any): Observable<any> {
    let url = this.baseUrl + API.updatefavourite;
    return this.http.post<any>(url, data);
  }
  postReview(data: any): Observable<any> {
    let url = this.baseUrl + API.review;
    return this.http.post<any>(url, data);
  }
  reviews(provider_id: any, category_id: any): Observable<any> {
    let url = this.baseUrl + API.reviews + provider_id + '/' + category_id;
    return this.http.get<any>(url);
  }
  favouriteDelete(id: any, provider_id: any, data: any): Observable<any> {
    let url = this.baseUrl + API.favourite + id + '/' + provider_id;
    return this.http.put<any>(url, data);
  }

  getRequestApplications(provider_id: any, category_id: any): Observable<any> {
    let url =
      this.baseUrl +
      API.requestApplications +
      provider_id +
      '/' +
      category_id +
      '/1';
    return this.http.get<any>(url);
  }
  getRequestApplicationsTop10(
    provider_id: any,
    category_id: any
  ): Observable<any> {
    let url =
      this.baseUrl +
      API.requestApplications +
      provider_id +
      '/' +
      category_id +
      '/1/10';
    return this.http.get<any>(url);
  }
  requestApplications(data: any): Observable<any> {
    let url = this.baseUrl + API.requestApplications;
    return this.http.post<any>(url, data);
  }
  getAllRequestApplications(
    provider_id: any,
    category_id: any,
    count: any
  ): Observable<any> {
    let url =
      this.baseUrl +
      API.requestApplications +
      provider_id +
      '/' +
      category_id +
      '/1/' +
      count;
    return this.http.get<any>(url);
  }
  getUserWaitlist(id: any): Observable<any> {
    let url = this.baseUrl + API.userWaitlist + id + '/';
    return this.http.get<any>(url);
  }
  viewApplications(
    parent_1: any,
    provider: any,
    provider_category: any,
    child: any
  ): Observable<any> {
    let url =
      this.baseUrl +
      API.viewApplications +
      parent_1 +
      '/' +
      provider +
      '/' +
      provider_category +
      '/' +
      child;
    return this.http.get<any>(url);
  }
  updateProviderSignupSteps(data: any, id: any): Observable<any> {
    let url = this.baseUrl + API.providerBasicInfo + '/' + id;
    return this.http.put<any>(url, data);
  }

  getProviderSignupStepsStatus(id: any): Observable<any> {
    let url = this.baseUrl + API.providerBasicInfo + '/' + id;
    return this.http.get<any>(url);
  }

  //Provider step 2 API
  addProviderSchedule(data: any): Observable<any> {
    let proSch = this.baseUrl + API.providerSchedule;
    return this.http.post<any>(proSch, data);
  }

  getProviderSchedule(scheduleType?: number): Observable<any> {
    let providerId = this.localStorageService.getUser()?.provider_id;
    let proSch = this.baseUrl + API.providerSchedule + '/' + providerId;
    if (scheduleType) {
      proSch = proSch + '/' + scheduleType;
    }
    return this.http.get<any>(proSch);
  }

  SaveProviderLicenseInfo(data: any, license_id: number): Observable<any> {
    let proLicense = this.baseUrl + API.providerLicense;
    if (license_id) {
      proLicense = proLicense + '/' + license_id;
    }
    return license_id
      ? this.http.put<any>(proLicense, data)
      : this.http.post<any>(proLicense, data);
  }

  saveProviderWebsiteInfo(data: any, id: number): Observable<any> {
    let proWebsite = this.baseUrl + API.providerWebsite + id;
    return this.http.put<any>(proWebsite, data);
  }

  saveProviderAgeGroup(isEditMode: boolean, data: any) {
    let proAgeGroup = this.baseUrl + API.providerAgeGroupSave;
    return isEditMode
      ? this.http.put<any>(proAgeGroup, data)
      : this.http.post<any>(proAgeGroup, data);
  }

  getProviderAgeGroup() {
    let proWebsite = this.baseUrl + API.providerAgeGroup;
    return this.http.get<any>(proWebsite);
  }

  getLicenseInfo(id: number) {
    let proLicense = this.baseUrl + API.providerLicenseInfo + id;
    return this.http.get<any>(proLicense);
  }

  getProviderAgeGroups() {
    let proAgeGroups =
      this.baseUrl +
      API.providerGetAgeGroup +
      this.providerDeatils?.provider_id;
    return this.http.get<any>(proAgeGroups);
  }

  providerSignUp(data: any): Observable<any> {
    const APIURL = this.baseUrl + API.providerSignup;
    return this.http.post(APIURL, data);
  }

  providerSaveAddress(data: any, id: number): Observable<any> {
    const APIURL = this.baseUrl + API.providerAddress + id;
    return this.http.put(APIURL, data);
  }

  //Provider step 2 API
  ProviderSchedule(data: any): Observable<any> {
    let proSch = this.baseUrl + API.providerSchedule;
    return this.http.post<any>(proSch, data);
  }

  //Provider step 3 API
  photo(data: any): Observable<any> {
    let photo = this.baseUrl + API.photo;
    const formData = new FormData();
    formData.append('upload_file', data);
    let id = localStorage.getItem('userid');
    return this.http.post<any>(photo, formData);
  }

  //Provider step 3 Video API
  video(data: any): Observable<any> {
    let video = this.baseUrl + API.video;
    return this.http.put<any>(video + this.providerDeatils.provider_id, data);
  }

  //Provider step 3 VideoPhoto Get API
  videoPhoto(): Observable<any> {
    let videoPhoto =
      this.baseUrl + API.videoPhoto + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.get<any>(videoPhoto);
  }

  //Provider Step 4 API
  childRequiremnet(data: any): Observable<any> {
    let childRequiremnet =
      this.baseUrl + API.childRequiremnet + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.put<any>(childRequiremnet, data);
  }

  // Step 4 review
  childRequiremnets(): Observable<any> {
    let childRequiremnets =
      this.baseUrl + API.childRequiremnets + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.get<any>(childRequiremnets);
  }

  //provider step 5 meals API
  meals(data: any, isApi: any): Observable<any> {
    let mealsAPI = this.baseUrl + API.meals;
    let id = localStorage.getItem('provider_id');
    return isApi > 0
      ? this.http.put<any>(mealsAPI, data)
      : this.http.post<any>(mealsAPI, data);
  }

  //provider step 5 snacks API
  snacks(data: any, isApi: any): Observable<any> {
    let snacksAPI = this.baseUrl + API.snacks;
    let id = localStorage.getItem('provider_id');
    return isApi > 0
      ? this.http.put<any>(snacksAPI, data)
      : this.http.post<any>(snacksAPI, data);
  }

  // provider step 5 GET APIs
  mealsGet(): Observable<any> {
    let mealsGet =
      this.baseUrl + API.mealsGet + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.get<any>(mealsGet);
  }

  snacksGet(): Observable<any> {
    let snacksGet =
      this.baseUrl + API.snacksGet + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.get<any>(snacksGet);
  }

  // Provider Step 6
  teacherChild(data: any): Observable<any> {
    let teacherChild = this.baseUrl + API.teachersChild;
    let id = localStorage.getItem('provider_id');
    return this.http.put<any>(teacherChild, data);
  }

  getTeacherChild() {
    let userData = this.localStorageService.getUser();
    let apiUrl = this.baseUrl + API.providerAddress + userData?.address_id?.id;
    return this.http.get<any>(apiUrl);
  }

  twelveHourFormatFromTwentyFour(time: any, format: string) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'am' : 'pm';
      time[0] = +time[0] % 12 || 12;
    }
    let timeHr;
    if (format == 'hour') {
      timeHr = time[0];
      if (timeHr < 10) {
        timeHr = '0' + timeHr;
      }
    } else if (format == 'minutes') {
      timeHr = time[2];
    } else if (format == 'format') {
      timeHr = time[5];
    } else {
      return time[0] + ':' + time[2] + time[5];
    }
    return timeHr;
  }

  deleteSchedule(scheduleTypeId: number, id: number) {
    let schedule =
      this.baseUrl +
      API.providerSchedule +
      '/' +
      this.providerDeatils?.provider_id +
      '/' +
      scheduleTypeId +
      '/' +
      id;
    return this.http.delete<any>(schedule);
  }

  // Step 7 API
  tuitions(data: any, update: boolean = false): Observable<any> {
    let tuition = this.baseUrl + API.tuitions;
    let id = localStorage.getItem('userid');
    if (update) {
      return this.http.put<any>(tuition + '/' + data.provider, data);
    } else return this.http.post<any>(tuition, data);
  }

  // For address details
  getAddressDetails() {
    let apiUrl =
      this.baseUrl + API.getteachersChild + this.providerDeatils.provider_id;
    return this.http.get<any>(apiUrl);
  }

  getProviderAddressDetails() {
    let userData = this.localStorageService.getUser();
    let apiUrl =
      environment.baseUrl + API.providerAddress + userData?.address_id?.id;
    return this.http.get<any>(apiUrl);
  }

  saveAdminSettings(data: any, isEditMode: boolean) {
    let userData = this.localStorageService.getUser();
    let apiUrl = '';
    if (isEditMode) {
      apiUrl =
        environment.baseUrl + API.getAdminNotifications + userData?.provider_id;
    } else {
      data.provider = userData.provider_id;
      apiUrl = environment.baseUrl + API.adminSettings;
    }

    return isEditMode
      ? this.http.put<any>(apiUrl, data)
      : this.http.post<any>(apiUrl, data);
  }

  adminAddWithSettings(data: any) {
    let userData = this.localStorageService.getUser();
    data.provider = userData.provider_id;
    let apiUrl = environment.baseUrl + API.adminAddWithSettings;
    return this.http.post<any>(apiUrl, data);
  }

  getAdminNotifications() {
    let userData = this.localStorageService.getUser();
    let apiUrl =
      environment.baseUrl + API.getAdminNotifications + userData.provider_id;
    return this.http.get<any>(apiUrl);
  }

  getAllProviders() {
    let userData = this.localStorageService.getUser();
    let apiUrl = environment.baseUrl + API.getAllAdmins + userData.provider_id;
    return this.http.get<any>(apiUrl);
  }

  getParticularAdmin(id: number) {
    let userData = this.localStorageService.getUser();
    let apiUrl =
      environment.baseUrl + API.getAllAdmins + userData.provider_id + '/' + id;
    return this.http.get<any>(apiUrl);
  }

  updateProviderData(data: any, id: number) {
    let userData = this.localStorageService.getUser();
    let apiUrl =
      environment.baseUrl + API.getAllAdmins + userData.provider_id + '/' + id;
    return this.http.put<any>(apiUrl, data);
  }

  deleteAdmin(id: number) {
    let apiUrl =
      environment.baseUrl +
      API.getAllAdmins +
      this.localStorageService.getUser()?.provider_id +
      '/' +
      id;
    return this.http.delete<any>(apiUrl);
  }

  affiliation(data: any): Observable<any> {
    let userData = this.localStorageService.getUser();
    const providerid = userData.provider_id;
    let affiliations = this.baseUrl + API.affiliation + providerid;
    return this.http.put<any>(affiliations, data);
  }

  saveAffiliation(): Observable<any> {
    let userData = this.localStorageService.getUser();
    const providerid = userData.provider_id;
    let affiliationGet = this.baseUrl + API.affiliationGet + providerid;
    return this.http.get<any>(affiliationGet);
  }
  getProviderFilters(): Observable<any> {
    let userData = this.localStorageService.getUser();
    const providerid = userData.provider_id;
    let url = this.baseUrl + API.providerFilters + providerid + '/';
    return this.http.get<any>(url);
  }
  updateProviderFilters(data: any): Observable<any> {
    let userData = this.localStorageService.getUser();
    const providerid = userData.provider_id;
    let url = this.baseUrl + API.providerBasicInfo + '/' + providerid;
    return this.http.put<any>(url, data);
  }

  // Search by provider name
  searchProvBYProvidername(providerName: any): Observable<any> {
    let url = this.baseUrl + API.searchProvBYProvidername + providerName;
    return this.http.get<any>(url);
  }

  getUserActivityStatics(params: {
    start_date: string;
    end_date: string;
  }): Observable<any> {
    let userData = this.localStorageService.getUser();
    let url = this.baseUrl + API.providerDashboard + userData.provider_id;
    return this.http.get<any>(url, {
      headers: {
        // Authorization: 'Bearer ' + this.authService.getAuthTokenFromLS()
      },
      params,
    });
  }

  // ------------------------------- *********** daycare center start ****************** ---------------------------------
  savedaycareProviderAgeGroup(isEditMode: boolean, data: any) {
    let proAgeGroup = this.baseUrl + API.daycareproviderAgeGroupSave;
    return isEditMode
      ? this.http.put<any>(proAgeGroup, data)
      : this.http.post<any>(proAgeGroup, data);
  }

  getdaycareProviderAgeGroups() {
    let proAgeGroups =
      this.baseUrl +
      API.daycareproviderGetAgeGroup +
      this.providerDeatils?.provider_id;
    return this.http.get<any>(proAgeGroups);
  }

  daycarecenterchildRequiremnet(data: any): Observable<any> {
    let daycarecenterchildRequiremnet =
      this.baseUrl + API.daycarecenterchildRequiremnet + this.providerDeatils.provider_id;
    let id = localStorage.getItem('provider_id');
    return this.http.put<any>(daycarecenterchildRequiremnet, data);
  }

  daycareteachersAdult(data: any): Observable<any> {
    let daycareteachersAdult = this.baseUrl + API.daycareteachersAdult;
    let id = localStorage.getItem('provider_id');
    return this.http.put<any>(daycareteachersAdult, data);
  }
  getdaycareteachersAdult() {
    let apiUrl =
      this.baseUrl + API.getdaycareteachersAdult + this.providerDeatils.provider_id;
    return this.http.get<any>(apiUrl);
  }
  // ------------------------------- *********** daycare center end ****************** ---------------------------------
}
