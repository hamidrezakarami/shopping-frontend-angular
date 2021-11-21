import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../models/user-login.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestBuilder } from './request.service';
import { Response, Dictionary } from '../type/new.type';
import { Toaster } from '../toast-notification';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private login$: BehaviorSubject<UserLogin>;
  private loadingCounter$: BehaviorSubject<number>;
  private repository: Repository = { dateTime: new Date() };
  constructor(
    public http: HttpClient,
    public toaster: Toaster,
    public router: Router
  ) {
    this.login$ = new BehaviorSubject<UserLogin>(null);
    this.loadingCounter$ = new BehaviorSubject<number>(0);
  }
  get loadingAsObservable() {
    return this.loadingCounter$.asObservable();
  }
  public startLoading(): void {
    window.requestAnimationFrame(() => {
      this.loadingCounter$.next(this.loadingCounter$.value + 1);
    });
  }
  public finishLoading(): void {
    window.requestAnimationFrame(() => {
      if (this.loadingCounter$.value > 0) {
        this.loadingCounter$.next(this.loadingCounter$.value - 1);
      }
    });
  }
  public apiRequest<T>(request: RequestBuilder): Observable<any> {
    return request.call(this);
  }
  get userLoginAsObservable() {
    return this.login$.asObservable();
  }
  public get token(): HttpParams {
    const user: UserLogin = this.currentUser ? this.currentUser : null;
    if (user && user['Token']) {
      return new HttpParams().set('Token', user['Token']);
    } else {
      return null;
    }
  }
  public get currentUser(): UserLogin {
    if (
      localStorage.getItem('currentUser') &&
      localStorage.getItem('currentUser').length > 0
    ) {
      this.repository.userLogin = JSON.parse(
        localStorage.getItem('currentUser')
      );
      return this.repository.userLogin;
    } else {
      return null;
    }
  }
  public userLogin(loginUser: UserLogin): void {
    this.repository.userLogin = Object.assign({}, loginUser);
    localStorage.setItem('user', JSON.stringify(loginUser));
    this.login$.next(this.repository.userLogin);
  }
  public userLogout(): void {
    this.repository.userLogin = null;
    this.login$.next(this.repository.userLogin);
    this.router.navigate(['/login']);
  }

  public getJWTPeyload() {
    return jwt_decode(localStorage.getItem('jwt'));
  }
}
export interface Repository extends Dictionary<any> {
  dateTime: Date;
}
