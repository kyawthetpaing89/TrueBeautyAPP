import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class MemberCardService {
  private apiservice = inject(ApiService);

  getMemberCard(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membercard_get,
      ApiUrls.requestType.GET,
    );
  }
}
