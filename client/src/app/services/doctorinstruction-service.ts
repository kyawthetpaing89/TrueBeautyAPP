import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class DoctorInstructionService {
  private apiservice = inject(ApiService);

  getLastInstruction(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.doctorinstruction_getlast,
      ApiUrls.requestType.POST,
      model
    );
  }
}
