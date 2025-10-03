import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  map,
  Observable,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiservice = inject(ApiService);
  private router = inject(Router);

  constructor() {}

  login(model: any): Observable<any> {
    return this.apiservice
      .request(ApiUrls.endpoints.admin_login, ApiUrls.requestType.POST, model)
      .pipe(
        map((response) => {
          if (response.status && response.data.accessToken) {
            localStorage.setItem('tb-accessToken', response.data.accessToken);
          }
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  logout() {
    localStorage.removeItem('tb-accessToken');

    this.router.navigate(['/users/login']);
  }

  adminUpdatePassword(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.admin_changepassword,
      ApiUrls.requestType.POST,
      model
    );
  }
}
