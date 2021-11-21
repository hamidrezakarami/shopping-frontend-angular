import { Injectable, ErrorHandler } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
  Route,
  ActivatedRoute,
} from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      })
    );
  }

  constructor(
    public errorHandler: ErrorHandler,
    private globalService: GlobalService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true
    if (localStorage.currentUser) {
      const token = JSON.parse(localStorage.currentUser).Token || null;
      if (this.globalService.token || token) {
        return true;
      }
    }
    this.router.navigate(['login']);
    return false;
  }
}
