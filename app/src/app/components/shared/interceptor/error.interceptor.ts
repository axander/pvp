import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SpinnerService } from 'src/app/services/spinner.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private spinner: SpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)

      .pipe(

        catchError((error: HttpErrorResponse) => {

          let errorMessage = '';

          if (error.error instanceof ErrorEvent) {

            // client-side error

            errorMessage = `Error: ${error.error.message}`;

          } else {

            // server-side error

            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

          }

          switch (error.status) {
            case 403:
              //location.href = environment.urlCoreHome + '/login';
              break;
            default:
              break;
          }
          return throwError(request.url.indexOf('refuse') < 0 ? errorMessage : error.status);

        })

      )

  }

}