import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../utilities/api-url';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = ApiUrls.baseUrl;
  http = inject(HttpClient);

  request(
    endpoint: string,
    method: string,
    payload: any = null
  ): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = this.createHeaders();

    return this.makeHttpRequest(url, method, payload, headers);
  }

  downloadFile(endpoint: string, payload: any = null): Observable<Blob> {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = this.createHeaders();

    return this.http.post(url, payload, {
      headers,
      responseType: 'blob', // important for binary files
      withCredentials: true,
    });
  }

  private createHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('cims-accessToken');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  private makeHttpRequest(
    url: string,
    method: string,
    payload: any,
    headers: HttpHeaders
  ): Observable<any> {
    const options = { headers, withCredentials: true }; // Add withCredentials

    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post(url, payload, options);
      case 'GET':
        return this.http.get(url, options);
      case 'PUT':
        return this.http.put(url, payload, options);
      case 'DELETE':
        return this.http.delete(url, options);
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }
}
