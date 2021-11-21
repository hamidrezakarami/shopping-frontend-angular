import { Directive, OnDestroy } from '@angular/core';
import { SubscribeManager } from '../shared/subscribe-manager';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Directive()
export class Base extends SubscribeManager implements OnDestroy {
  /*
    'http://producerproduct-env.rcrdexzpsc.us-east-1.elasticbeanstalk.com/' // product
    'http://producer-env.je3asdeqyw.us-east-1.elasticbeanstalk.com/' // developer
    'https://stageapi.dibuses.com/' //stage
    'http://192.168.1.199:5000/'
    'http://23.227.199.167:9095/'
    */

  //for run as production do   ng s -o --env=prod
  //for run as stage  ng s -o --env=stage
  //for run as ng s -o --env=local
  protected serviceBaseUrl = environment.serviceBaseUrl;
  // added by behrooz to have production and stage version
  // protected serviceBaseUrl =  'http://tips-pc:5000/';

  public constructor(private actionUrl: string, private baseUrl: string = '') {
    super();
  }

  ngOnDestroy() {}

  public SetActionUrl(actionUrl: string) {
    this.actionUrl = actionUrl;
  }

  public getServiceUrl(actionUrl: string = null): string {
    if (actionUrl === null) {
      return this.serviceBaseUrl + this.actionUrl;
    } else {
      return this.serviceBaseUrl + actionUrl;
    }
  }

  // tslint:disable-next-line:member-ordering
  private LogData: {
    logs: ILog[];
  };

  public log(methodName: string, description: string) {
    const log = new ILog();

    log.Description = description;
    log.MethodName = methodName;
    this.LogData.logs.push(log);
  }

  public httpErrorHandling(error: HttpErrorResponse) {}
}

class ILog {
  MethodName: string;
  Description: string;
}
