import { inject, Injectable } from '@angular/core';
import { ParamsHandler } from '../params-handler';
import { map, catchError, tap } from 'rxjs/operators';
import { GlobalService } from './global.service';
import { Observable, throwError } from 'rxjs';
import { CachMode, HttpVerb, SchemaName } from '../type/new.type';
import { RequestAction, RequestController } from '../shared/Request.enum';
import { Response } from '../type/new.type';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
export function ApiRequest(
  verb: HttpVerb = 'GET',
  global: boolean = true
): RequestBuilder {
  return new RequestBuilder(verb, global);
}
@Injectable({
  providedIn: 'root',
})
export class RequestBuilder {
  private static globalRequestID = 0;
  private schema: SchemaName = null;
  private controllerName: RequestController | string;
  private actionName: RequestAction | string;
  private urlParameters: ParamsHandler;
  private bodyParameters;
  private requestID: number;
  private cachMode: CachMode = 'none';
  private file: File;
  private loading: boolean;
  private messageShow: boolean;
  constructor(private verb: HttpVerb = 'GET', public global: boolean = false) {
    this.requestID = RequestBuilder.globalRequestID++;
    // this.bodyParameters = new JSON();
    this.urlParameters = new ParamsHandler();
  }
  get getRequestID() {
    return this.requestID;
  }
  public get(): RequestBuilder {
    this.verb = 'GET';
    return this;
  }
  public post(): RequestBuilder {
    this.verb = 'POST';
    return this;
  }
  public delete(): RequestBuilder {
    this.verb = 'DELETE';
    return this;
  }
  public put(): RequestBuilder {
    this.verb = 'PUT';
    return this;
  }
  public schemaName(name: SchemaName) {
    this.schema = name;
    return this;
  }
  public showLoading(show: boolean = true) {
    this.loading = show;
    return this;
  }
  public showMessage(show: boolean = true) {
    this.messageShow = show;
    return this;
  }
  public setMode(cachMode: CachMode) {
    this.cachMode = cachMode;
  }
  public controller(
    controllerName: RequestController | string
  ): RequestBuilder {
    this.controllerName = controllerName;
    return this;
  }
  public action(actionName: RequestAction | string): RequestBuilder {
    this.actionName = actionName;
    return this;
  }
  public setBody(data: ParamsHandler): RequestBuilder {
    this.bodyParameters = data;
    return this;
  }
  public addBody(key: any, value: any): RequestBuilder {
    this.bodyParameters.addParam(key, value);
    return this;
  }
  public setParam(param: ParamsHandler): RequestBuilder {
    this.urlParameters = param;
    return this;
  }
  public addParam(key: any, value: any): RequestBuilder {
    this.urlParameters.addParam(key, value);
    return this;
  }
  private getUrl(): string {
    let url = environment.serviceBaseUrl;
    if (environment.APP_NAME && this.global === false) {
      url += environment.APP_NAME + '/';
    }
    if (this.schema) {
      url += this.schema + '/';
    }
    if (this.controllerName && this.controllerName.toString() !== '') {
      url += this.controllerName + '/';
    }
    if (this.actionName && this.actionName.toString() !== '') {
      url += this.actionName + '/';
    }
    return url.substring(url.length - 1) === '/'
      ? url.substring(0, url.length - 1)
      : url;
  }
  public call(globalService: GlobalService): Observable<any> {
    const hasParam =
      this.urlParameters !== undefined && this.urlParameters.count() > 0;
    const urlWithParams =
      this.getUrl() + (hasParam ? '?' + this.urlParameters.urlParamaters : '');
    const token = globalService.token;
    const hdrs = new HttpHeaders({ 'Content-Type': 'text/plain' });
    if (this.loading) {
      globalService.startLoading();
    }
    if (this.verb === 'GET') {
      return globalService.http
        .get(urlWithParams, { headers: hdrs, params: token })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService))
        );
    } else if (this.verb === 'POST') {
      const posthdr = new HttpHeaders({'Content-Type': 'application/json'});
      return globalService.http
        .post(urlWithParams, this.bodyParameters.toJson(), {
          headers: posthdr,
          params: token,
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService))
        );
    } else if (this.verb === 'PUT') {
      return globalService.http
        .put(urlWithParams, this.bodyParameters.toJson(), {
          headers: hdrs,
          params: token,
        })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService))
        );
    } else if (this.verb === 'DELETE') {
      return globalService.http
        .delete(urlWithParams, { headers: hdrs, params: token })
        .pipe(
          map(this.handlePipeMap),
          catchError((error) => {
            return this.ErrorHandeling(error, globalService);
          }),
          tap((resp) => this.messageHandling(this, resp, globalService))
        );
    }
    return null
  }
  private messageHandling(
    parent: RequestBuilder,
    resp: any,
    globalService: GlobalService
  ) {
    if (parent.loading === true) {
      globalService.finishLoading();
    }
    if (resp.Messages) {
      resp.Messages.forEach((data) => {
        globalService.toaster.open({
          type: resp.Success ? 'success' : 'danger',
          duration: 3000,
          caption: '',
          text: data.trim(),
        });
      });
    }
  }
  private handlePipeMap(resp) {
    const { Success, Message } = resp;
    if (Success) {
      return resp;
    } else {
      if (Message) throw { message: Message.toString(), status: 0, data: resp };
      return resp;
    }
  }
  ErrorHandeling(error: HttpErrorResponse, globalService: GlobalService) {
    if (this.loading === true) {
      globalService.finishLoading();
    }
    const { status } = error;
    const toaster = globalService.toaster; // ServiceLocator.injector.get(Toaster);
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      toaster.open({
        type: 'danger',
        caption: 'Client Exception',
        text: error.error.message,
      });
    } else {
      // Get server-side error
      switch (status) {
        case 404: {
          toaster.open({
            type: 'danger',
            caption: 'Not Found',
            text: 'Error Code: 404',
          });
          break;
        }
        case 401: {
          toaster.open({
            type: 'danger',
            caption: 'Unathorize',
            text: 'Error Code: 401',
          });
          break;
        }
        case 403: {
          toaster.open({
            type: 'danger',
            caption: 'Access Denide',
            text: 'Error Code: 403',
          });
          break;
        }
        case 500: {
          toaster.open({
            type: 'danger',
            caption: 'Server Error',
            text: 'Error Code: 500',
          });
          break;
        }
        case 0: {
          toaster.open({
            type: 'warning',
            caption: 'Server Message',
            text: error.message,
          });
          break;
        }
        default:
          toaster.open({
            type: 'danger',
            caption: `Error Code: ${error.status}`,
            text: error.message,
          });
      }
    }
    return throwError(error);
  }
}
