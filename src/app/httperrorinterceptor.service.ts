import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// import { MatsnakbarComponent } from './matsnakbar/matsnakbar.component';
import { HomeService } from './services/home.service';
import { MatsnakbarComponent } from './matsnakbar/matsnakbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './popup/error/error.component';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatsnakbarComponent,
    private homeService: HomeService,
    private dialog: MatDialog
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        this.homeService.loader.next(true);
        if (event.type == HttpEventType.Response) {
          if (event.status === 200) {
            this.homeService.loader.next(false);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.homeService.loader.next(false);
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
          console.log('this is server side error');
          if (error.status && error.message) {
            errorMsg = `Error Code: ${error.status}, Status: ${error.statusText}`;
          } else {
            errorMsg =
              'There is a problem in loading this page please contact Application Administrator';
          }
        }
        // this.snackBar.openSnackBar(errorMsg, 'Close', 'red-snackbar');
        this.openErrorDialog(errorMsg);
        return throwError(errorMsg);
      })
    );
  }

  openErrorDialog(errorMsg: string) {
    const dialogRef = this.dialog.open(ErrorComponent, {
      width: '420px',
      height: 'auto',
      data: errorMsg,
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
