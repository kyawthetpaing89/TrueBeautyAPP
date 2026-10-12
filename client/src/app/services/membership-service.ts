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

  printMembershipTransaction(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.membershiptransaction_print,
      ApiUrls.requestType.POST,
      model,
    );
  }

  membershipExport(model: any) {
    this.apiservice
      .downloadFile(ApiUrls.endpoints.membership_export, model)
      .subscribe((blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;

        const now = new Date();

        const pad = (n: number) => n.toString().padStart(2, '0');

        const timestamp = [
          pad(now.getDate()),
          pad(now.getMonth() + 1),
          now.getFullYear(),
          pad(now.getHours()),
          pad(now.getMinutes()),
          pad(now.getSeconds()),
        ].join('');

        a.download = `membership_${timestamp}.xlsx`;
        a.click();

        URL.revokeObjectURL(objectUrl);
      });
  }
}
