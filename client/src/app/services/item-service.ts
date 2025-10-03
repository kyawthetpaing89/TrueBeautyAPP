import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiservice = inject(ApiService);

  getItem(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_get,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemSummary(): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getsummary,
      ApiUrls.requestType.GET
    );
  }

  ItemProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_process,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemPriceLog(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getpricelog,
      ApiUrls.requestType.POST,
      model
    );
  }

  itemExport(model: any) {
    this.apiservice
      .downloadFile(ApiUrls.endpoints.item_export, model)
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

        a.download = `item_${timestamp}.xlsx`;
        a.click();

        URL.revokeObjectURL(objectUrl);
      });
  }

  getItemPurchasing(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getpurchasing,
      ApiUrls.requestType.POST,
      model
    );
  }

  itemPurchasingProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_purchasingprocess,
      ApiUrls.requestType.POST,
      model
    );
  }
  getItemPurchasedList(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getpurchasedlist,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemUsage(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getusage,
      ApiUrls.requestType.POST,
      model
    );
  }

  itemUsageProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_usageprocess,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemInventory(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getinventory,
      ApiUrls.requestType.POST,
      model
    );
  }

  itemPurchasingPaymentProcess(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_purchasingpaymentprocess,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemPurchasingPayment(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_getpurchasingpayment,
      ApiUrls.requestType.POST,
      model
    );
  }

  getItemTopSelling(model: any): Observable<any> {
    return this.apiservice.request(
      ApiUrls.endpoints.item_gettopselling,
      ApiUrls.requestType.POST,
      model
    );
  }
}
