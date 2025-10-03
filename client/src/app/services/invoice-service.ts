import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiservice = inject(ApiService);

  getMonthlySales(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_monthlysales,
      ApiUrls.requestType.POST,
      model
    );
  }

  getClientData(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_clientdata,
      ApiUrls.requestType.POST,
      model
    );
  }

  getTopSellingItems(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_topsellingitem,
      ApiUrls.requestType.POST,
      model
    );
  }

  getSalesReport(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_salesreport,
      ApiUrls.requestType.POST,
      model
    );
  }

  getInvoice(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_get,
      ApiUrls.requestType.POST,
      model
    );
  }

  getInvoiceDetail(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_getinvoicedetail,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceDetailProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoicedetail_process,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_process,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceCopy(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_copy,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceCopyAccessCheck(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_copyaccesscheck,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceCopyConfirm(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.invoice_copyconfirm,
      ApiUrls.requestType.POST,
      model
    );
  }

  invoiceExport(model: any) {
    this.apiservice
      .downloadFile(ApiUrls.endpoints.invoice_export, model)
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

        a.download = `invoice_${timestamp}.xlsx`;
        a.click();

        URL.revokeObjectURL(objectUrl);
      });
  }
}
