import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Base } from './base';
import { ParamsHandler } from '../params-handler';
import {
  UserAccount,
  LoginResult,
  Profile,
  Role,
  UserList,
  UserAccountList,
} from '../models/Profile';
import { ActionResult } from '../models/ActionResult';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResetPass } from '../models/ResetPass';
import { Router } from '@angular/router';
import { ApiRequest } from './request.service';
import { GlobalService } from './global.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService extends Base {
  private _profile: BehaviorSubject<LoginResult>;
  private _userList: BehaviorSubject<UserList>;
  private _accountList: BehaviorSubject<UserAccount[]>;
  private _registerUser: BehaviorSubject<ActionResult>;
  private _resetPas: BehaviorSubject<boolean>;
  private _chekRestPasKey: BehaviorSubject<boolean>;
  private _errorType: BehaviorSubject<string>;
  private _checkresetPas: BehaviorSubject<ResetPass>;
  private dataSet: {
    loginResult: LoginResult;
    checkresetPas: ResetPass;
    resetPas: boolean;
    chekRestPasKey: boolean;
    errorType: string;
    token: string;
    userList: UserList;
    accountList: UserAccount[];
  };

  public relogin: boolean = false;
  resetDataSet() {
    this.dataSet = {
      loginResult: null,
      checkresetPas: null,
      resetPas: false,
      chekRestPasKey: false,
      errorType: '',
      token: null,
      userList: null,
      accountList: [],
    };
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private gs: GlobalService
  ) {
    super('user');
    this.resetDataSet();
    this._checkresetPas = new BehaviorSubject<ResetPass>(null);
    this._profile = new BehaviorSubject<LoginResult>(null);
    this._resetPas = new BehaviorSubject<boolean>(false);
    this._chekRestPasKey = new BehaviorSubject<boolean>(false);
    this._errorType = new BehaviorSubject<string>('');
    this._userList = new BehaviorSubject<UserList>(null);
    this._accountList = new BehaviorSubject<UserAccount[]>(null);
    this._registerUser = new BehaviorSubject<ActionResult>(null);
  }

  public clearSubscription() {
    this.unsubscribe();
  }

  get LoginResult() {
    return this._profile.asObservable();
  }
  get resetPas() {
    return this._resetPas.asObservable();
  }
  get checkresetPas() {
    return this._checkresetPas.asObservable();
  }
  get chekRestPasKey() {
    return this._chekRestPasKey.asObservable();
  }
  get errorType() {
    return this._errorType.asObservable();
  }

  get UserList() {
    return this._userList.asObservable();
  }

  get defaultAccount() {
    const accountList = this.dataSet.accountList.filter(
      (a) => a.AccountID === this.SelectedAccountID
    );
    return accountList.length > 0 ? accountList[0] : null;
  }

  get UserAccountList() {
    return this._userList.asObservable();
  }

  get tokenParams(): HttpParams {
    var user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.dataSet.token == null) this.dataSet.token = user.GUID;
    let params = new HttpParams().set('Token', this.dataSet.token);
    return params;
  }

  get AccountList() {
    return this._accountList.asObservable();
  }

  get RegisterUser$() {
    return this._registerUser.asObservable();
  }

  get UserLogin(): LoginResult {
    if (localStorage.getItem('currentUser') == null) {
      return null;
    } else {
      return JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  set UserLogin(user: LoginResult) {
    user.MapAPI = 2;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  get SelectedAccountID(): number {
    if (localStorage.getItem('SelectedAccountID') == null) {
      return null;
    } else {
      return Number(localStorage.getItem('SelectedAccountID'));
    }
  }

  set SelectedAccountID(accountID: number) {
    localStorage.setItem('SelectedAccountID', accountID.toString());
  }

  changeAccount(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/accountchange';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();
    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  userLogout() {
    if (this.gs.currentUser?.Token) {
      let token = this.gs.currentUser.Token;
      ApiRequest('POST', true)
        .controller('user')
        .action('logout')
        .setBody(new ParamsHandler({ Token: token }))
        .call(this.gs)
        .subscribe((resp) => {
          // window.location.href = environment.HomeUrl + '?Token=' + token;
        });
      this.resetDataSet();
      localStorage.setItem('currentUser', null);
      localStorage.clear();
      // this.dataSet.loginResult = null;
      this._profile.next(Object.assign({}, this.dataSet).loginResult);
    }
  }

  userLogin(body: any = null) {
    let paramsHandler = new ParamsHandler();
    const method = 'userLogin';
    const Url = this.getServiceUrl() + '/login';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const subscription = this.http.post(Url, body, { headers: hdrs }).subscribe(
      (resp: any) => {
        if (resp) {
          let { Data } = resp;
          if (resp.Data) {
            if (
              Data.User &&
              Data.User.GUID !== null &&
              Data.User.GUID !== undefined
            ) {
              this.dataSet.token = Data.User.GUID;
              this.SelectedAccountID = Data.User.AccountID;
              this.UserLogin = Data.User;
              this.dataSet.loginResult = Object.assign(
                new LoginResult(),
                Data.User
              );
              this.dataSet.loginResult.Token = Data.User.GUID;
              this._profile.next(Object.assign({}, this.dataSet).loginResult);
              paramsHandler.addParam('AccountRefID', Data.User.AccountID);
              // this.accountList(paramsHandler);
            } else {
              this.resetDataSet();
              let loginResult = new LoginResult();
              loginResult.Error = resp.Message;
              loginResult.Token = null;
              this._profile.next(loginResult);
            }
          } else {
            this.resetDataSet();
            let loginResult = new LoginResult();
            loginResult.Error = Data.Message; //'Exception on login.';
            loginResult.Token = null;
            this._profile.next(loginResult);
          }
        }
      },
      (error) => {
        this._profile.next(null);
        if (error.status == 401) {
          //Unauthorized
          this.router.navigate(['/logout']);
        } else {
          // paramsHandler.parent.messageOnNotify(
          //   JSON.stringify(error),
          //   'close',
          //   'red-snackbar'
          // );
          this._profile.next(null);
        }
      }
    );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  resetPasswordRequest(paramsHandler: ParamsHandler) {
    const method = 'resetPasswordRequest';
    const Url = this.getServiceUrl() + '/resetpasswordrequest';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();
    const subscription = this.http
      .post(Url, param, { headers: hdrs })
      .subscribe(
        (data) => {
          this.dataSet.resetPas = data['Success'];
          this._resetPas.next(Object.assign({}, this.dataSet).resetPas);
        },
        (error) => {
          if (error.status == 401) {
            //Unauthorized
            this.router.navigate(['/logout']);
          } else {
            // paramsHandler.parent.messageOnNotify(
            //   JSON.stringify(error),
            //   'close',
            //   'red-snackbar'
            // );
          }
        }
      );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  checkResetPassKey(paramsHandler: ParamsHandler) {
    const method = 'checkResetPassKey';
    const Url = this.getServiceUrl() + '/checkresetpasskey';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();
    const subscription = this.http
      .post(Url, param, { headers: hdrs })
      .subscribe(
        (data) => {
          this.dataSet.errorType = data['Message'];
          this._errorType.next(Object.assign({}, this.dataSet).errorType);
          this.dataSet.chekRestPasKey = data['Success'];
          this._chekRestPasKey.next(
            Object.assign({}, this.dataSet).chekRestPasKey
          );
          if (data['Success'] === true) {
            if (data['Data'] !== null && data['Data'].token !== null) {
              this.dataSet.checkresetPas = data['Data'];
              this._checkresetPas.next(
                Object.assign({}, this.dataSet).checkresetPas
              );
            }
          }
        },
        (error) => {
          if (error.status == 401) {
            //Unauthorized
            this.router.navigate(['/logout']);
          } else {
            // paramsHandler.parent.messageOnNotify(
            //   JSON.stringify(error),
            //   'close',
            //   'red-snackbar'
            // );
          }
        }
      );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  resetPassword(paramsHandler: ParamsHandler) {
    const method = 'resetpassword';
    const Url = this.getServiceUrl() + '/resetpassword';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();
    const subscription = this.http
      .post(Url, param, { headers: hdrs })
      .subscribe(
        (data) => {},
        (error) => {
          if (error.status == 401) {
            //Unauthorized
            this.router.navigate(['/logout']);
          } else {
            // paramsHandler.parent.messageOnNotify(
            //   JSON.stringify(error),
            //   'close',
            //   'red-snackbar'
            // );
          }
        }
      );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  findUserList(paramsHandler: ParamsHandler) {
    const method = 'fetchUserList';
    const url = this.getServiceUrl() + '/list?' + paramsHandler.urlParamaters;
    const subscription = this.http
      .get(url, { params: this.tokenParams })
      .subscribe(
        (data) => {
          if (data['Success'] === true) {
            let userList = new UserList();
            userList = {
              Users: data['Data'].User,
              Count: data['Data'].RowCount,
            };
            this.dataSet.userList = userList;
            this._userList.next(Object.assign({}, this.dataSet).userList);
          }
        },
        (error) => {
          if (error.status == 401) {
            //Unauthorized
            this.router.navigate(['/logout']);
          } else {
            // paramsHandler.parent.messageOnNotify(
            //   JSON.stringify(error),
            //   'close',
            //   'red-snackbar'
            // );
          }
        }
      );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  RegisterUser(paramsHandler: ParamsHandler) {
    const method = 'RegisterUser';
    const Url = this.getServiceUrl() + '/register';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    const subscription = this.http
      .post(Url, param, { headers: hdrs, params: this.tokenParams })
      .subscribe(
        (data) => {
          let result = new ActionResult();
          result.Success = false;
          if (data != null) {
            result.Message = data['Message'];
            result.Success = data['Success'];
            this._registerUser.next(result);
          }
          this._registerUser.next(result);
        },
        (error) => {
          if (error.status == 401) {
            //Unauthorized
            this.router.navigate(['/logout']);
          } else {
            // paramsHandler.parent.messageOnNotify(
            //   JSON.stringify(error),
            //   'close',
            //   'red-snackbar'
            // );
          }
        }
      );
    this.addSubscription$(method, subscription);
    return subscription;
  }

  EditUser(paramsHandler: ParamsHandler): Observable<ActionResult> {
    const Url = this.getServiceUrl() + '/edit';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    const subscription = this.http.post<ActionResult>(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
    return subscription;
  }
  // accountList$(paramsHandler: ParamsHandler): Observable<any> {
  //   const url =
  //     this.getServiceUrl() + '/accountlist?' + paramsHandler.urlParamaters;
  //   return this.http.get(url, { params: this.tokenParams });
  // }

  // accountList(paramsHandler: ParamsHandler) {
  //   const subscription = this.accountList$(paramsHandler).subscribe(
  //     (resp) => {
  //       const { Data } = resp;
  //       if (Data) {
  //         this.dataSet.accountList = Data.Account;
  //         this.SelectedAccountID = Data.CurrentAccountID;
  //         this._accountList.next(Object.assign({}, this.dataSet).accountList);
  //       }
  //     },
  //     (error) => {
  //       if (error.status === 401) {
  //         // Unauthorized
  //         this.router.navigate(['/logout']);
  //       } else {
  //         // paramsHandler.parent.messageOnNotify(
  //         //   JSON.stringify(error),
  //         //   'close',
  //         //   'red-snackbar'
  //         // );
  //       }
  //     }
  //   );
  //   return subscription;
  // }

  restorePointList$(paramsHandler: ParamsHandler): Observable<any> {
    const url =
      this.getServiceUrl() + '/restorepointlist?' + paramsHandler.urlParamaters;
    return this.http.get(url, { params: this.tokenParams });
  }

  restorePointCreate$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/restorepointcreate';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  restorePointRestore$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/restorepointrestore';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  createAccount$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/accountadd';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  editAccount$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/accountedit';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  accountRestore$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/accountrestore';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  accountDelete$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/accountdelete';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }
  databasesetasopreational$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/databasesetasopreational';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }
  clonedatabase$(paramsHandler: ParamsHandler): Observable<any> {
    const Url = this.getServiceUrl() + '/clonedatabase';
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    const param = paramsHandler.getJson();

    return this.http.post(Url, param, {
      headers: hdrs,
      params: this.tokenParams,
    });
  }

  activityList$(paramsHandler: ParamsHandler): Observable<any> {
    const url =
      this.getServiceUrl() + '/activitylist?' + paramsHandler.urlParamaters;
    return this.http.get(url, { params: this.tokenParams });
  }
} ///////////////////////////////
