import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Define the interceptor function
export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  const token = localStorage.getItem('tb-accessToken');
  let clonedRequest = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to login if unauthorized
        router.navigate(['/users/login']);
      }
      return throwError(() => error);
    })
  );
};
