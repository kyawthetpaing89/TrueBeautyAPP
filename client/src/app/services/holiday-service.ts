import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private apiservice = inject(ApiService);

  getHoliday(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.holiday_get,
      ApiUrls.requestType.POST,
      model
    );
  }

  holidayProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.holiday_process,
      ApiUrls.requestType.POST,
      model
    );
  }
}
