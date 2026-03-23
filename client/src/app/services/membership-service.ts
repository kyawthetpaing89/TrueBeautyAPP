import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private apiservice = inject(ApiService);

  getMembershipType(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershiptype_get,
      ApiUrls.requestType.GET,
    );
  }

  getMembershipTypeItem(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershiptypeitem_get,
      ApiUrls.requestType.GET,
    );
  }

  membershipTypeProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershiptype_process,
      ApiUrls.requestType.POST,
      model,
    );
  }

  getMembership(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membership_get,
      ApiUrls.requestType.POST,
      model,
    );
  }

  membershipProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membership_process,
      ApiUrls.requestType.POST,
      model,
    );
  }

  getMembershipTransaction(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershiptransaction_get,
      ApiUrls.requestType.POST,
      model,
    );
  }

  getMembershipClients(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershipclients_get,
      ApiUrls.requestType.POST,
      model,
    );
  }

  membershipClientsProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershipclients_process,
      ApiUrls.requestType.POST,
      model,
    );
  }

  getClientsActiveMembership(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershipclients_getactivemembership,
      ApiUrls.requestType.POST,
      model,
    );
  }
}
