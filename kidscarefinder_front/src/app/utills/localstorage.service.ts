import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const ROLE_KEY = 'auth-role';
const TAB_KEY = 'tabDetails';
const ENTITY_TAB_KEY = 'entityTabDetails';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  signOut(): void {
    window.localStorage.clear();
  }
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public saveKey(key: any, value: any): void {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  public delKey(key: any): void {
    window.localStorage.removeItem(key);
  }

  public getKey(key: any): any {
    const val = window.localStorage.getItem(key);
    if (val) {
      return JSON.parse(val);
    }
    return false;
  }
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  public saveTabDetails(tabDetails: any): void {
    window.localStorage.removeItem(TAB_KEY);
    window.localStorage.setItem(TAB_KEY, JSON.stringify(tabDetails));
  }
  public saveEntityTabDetails(tabDetails: any): void {
    window.localStorage.removeItem(ENTITY_TAB_KEY);
    window.localStorage.setItem(ENTITY_TAB_KEY, JSON.stringify(tabDetails));
  }
  public getTabDetails(): any {
    const tabDetails = window.localStorage.getItem(TAB_KEY);
    if (tabDetails) {
      return JSON.parse(tabDetails);
    }
    return {};
  }
  public getEntityTabDetails(): any {
    const tabDetails = window.localStorage.getItem(ENTITY_TAB_KEY);
    if (tabDetails) {
      return JSON.parse(tabDetails);
    }
    return {};
  }

  public getProviderId(): any {
    if (this.getUser()) {
      return this.getUser().provider_id;
    }
    return 0;
  }
}

