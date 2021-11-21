import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError, EMPTY } from 'rxjs';
// import { AlertService } from "../modules/alert/shared/services/alert.service";
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';

// هدل خطاها
@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!window.navigator.onLine) {
      this.userService.userLogout();
      this.router.navigate(['/login']);
      return EMPTY;
    }

    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          // this.userService.userLogout();
          // this.router.navigate(['/login']);
          return EMPTY;
        }

        if (err instanceof HttpErrorResponse && err.status === 404) {
          // this.userService.userLogout();
          // this.router.navigate(['/login']);
          return EMPTY;
        }

        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.userService.userLogout();
          this.router.navigate(['/login']);
          return EMPTY;
        }

        return throwError(err);
      })
    );
  }
}
