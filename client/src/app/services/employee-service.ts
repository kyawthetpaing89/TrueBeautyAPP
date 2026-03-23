import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiservice = inject(ApiService);

  getEmployee(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.employee_get,
      ApiUrls.requestType.POST,
      model
    );
  }

  getPosition(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.employeeposition_get,
      ApiUrls.requestType.GET
    );
  }

  getBank(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.employeebank_get,
      ApiUrls.requestType.GET
    );
  }

  employeeProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.employee_process,
      ApiUrls.requestType.POST,
      model
    );
  }
}
