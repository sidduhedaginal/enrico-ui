import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, catchError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  TokenDetail: any;
  constructor(private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // let tokenKey =
    //   'oidc.user:https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/v2.0/:3800bb56-45cb-4c0a-bd89-7394b0d57720';
    // let data: any = localStorage.getItem(tokenKey);
    // this.TokenDetail = JSON.parse(data);

    // if (this.TokenDetail && this.TokenDetail.access_token) {
    //   req = req.clone({
    //     headers: req.headers.set(
    //       'Authorization',
    //       'bearer ' + this.TokenDetail.access_token
    //     ),
    //   });
    // }

    return next.handle(req).pipe(
      catchError((errordata) => {
        if (errordata.status === 401) {
          this.router.navigate(['unauth']);
        }
        return throwError(errordata);
      })
    );
  }
}
