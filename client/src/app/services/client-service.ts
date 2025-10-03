import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiservice = inject(ApiService);

  getPaymentDetail(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_getpaymentdetail,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClient(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_get,
      ApiUrls.requestType.POST,
      model
    );
  }

  ClientProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_process,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClientTreatmentCheckin(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_gettreatmentcheckin,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClientTreatment(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_gettreatment,
      ApiUrls.requestType.POST,
      model
    );
  }

  ClientTreatmentCheckinProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_treatmentcheckinprocess,
      ApiUrls.requestType.POST,
      model
    );
  }

  getDoctorInstruction(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_getdoctorinstruction,
      ApiUrls.requestType.POST,
      model
    );
  }

  processDoctorInstruction(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_processdoctorinstruction,
      ApiUrls.requestType.POST,
      model
    );
  }

  processClientPayment(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_paymentprocess,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClientDashboardInfo(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_getdashboardinfo,
      ApiUrls.requestType.GET
    );
  }

  getClientBooking(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_getbooking,
      ApiUrls.requestType.POST,
      model
    );
  }

  clientBookingProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_bookinprocess,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClientReport(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.client_getreport,
      ApiUrls.requestType.POST,
      model
    );
  }
}
