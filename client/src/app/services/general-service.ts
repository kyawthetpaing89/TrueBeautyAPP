import { ElementRef, inject, Injectable, Renderer2 } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ClientService } from './client-service';
import { client_get_model } from '../models/client-model';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  clientservice = inject(ClientService);

  constructor(
    private location: Location,
    private router: Router,
    private titleService: Title
  ) {}

  setPageTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  formatWithThousandSeparator(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  allowNumbersOnly(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];

    if (allowedKeys.includes(event.key) || /^[0-9]$/.test(event.key)) {
      return; // Allow valid input
    }

    event.preventDefault(); // Block all others
  }

  getLoginID(): string {
    const token = localStorage.getItem('tb-accessToken');
    if (!token) return '';

    try {
      const decoded = jwtDecode<Record<string, any>>(token);
      return decoded['userid'];
    } catch {
      this.router.navigate(['/users/login']);
      return '';
    }
  }

  getUserName(): string {
    const token = localStorage.getItem('tb-accessToken');
    if (!token) return '';

    try {
      const decoded = jwtDecode<Record<string, any>>(token);
      return decoded['username'];
    } catch {
      this.router.navigate(['/users/login']);
      return '';
    }
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('tb-accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<Record<string, any>>(token);
      return decoded['userrole'];
    } catch {
      this.router.navigate(['/users/login']);
      return '';
    }
  }

  getShopID(): string | null {
    const token = localStorage.getItem('tb-accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<Record<string, any>>(token);
      return decoded['shopid'];
    } catch {
      this.router.navigate(['/users/login']);
      return '';
    }
  }

  getFormattedDate(inputDate?: Date | string): string {
    const date = inputDate ? new Date(inputDate) : new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., Jul
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  getFormattedDateTime(inputDate?: Date | string): string {
    const date = inputDate ? new Date(inputDate) : new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., Jul
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0'); // 24-hour
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }

  getOneWeekBeforeFormattedDate(): string {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.getFormattedDate(oneWeekAgo);
  }

  getOneMonthBeforeFormattedDate(): string {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.getFormattedDate(oneMonthAgo);
  }

  formatItemList(itemList: string): string {
    return itemList ? itemList.replace(/\|/g, '<br>') : '';
  }

  async checkClientExists(clientID: string) {
    const model = client_get_model({ ClientID: clientID });

    try {
      const response = await firstValueFrom(
        this.clientservice.getClient(model)
      );

      if (response.status) {
        if (response.data?.data.length <= 0) {
          return false;
        }
        return true;
      } else {
        console.error('Failed to fetch item summary:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Error fetching item summary:', error);
      return false;
    }
  }

  goBack(page?: string): void {
    switch (page) {
      case 'InvoiceList':
        this.router.navigate(['/invoice/invoicelist']);
        break;
      case 'ClientList':
        this.router.navigate(['/client/clientlist']);
        break;
      default:
        this.location.back();
    }
  }

  getCurrentScroll(scrollContainer: ElementRef) {
    let currentScrollTop = 0;
    if (scrollContainer && scrollContainer.nativeElement) {
      currentScrollTop = scrollContainer.nativeElement.scrollTop;
    }

    return currentScrollTop;
  }
  setCurrentScroll(
    scrollContainer: ElementRef<any> | null,
    renderer: Renderer2,
    currentScrollTop: any
  ) {
    if (scrollContainer && scrollContainer.nativeElement) {
      setTimeout(() => {
        renderer.setProperty(
          scrollContainer.nativeElement,
          'scrollTop',
          currentScrollTop
        );
      }, 0);
    }
  }
  sortData(
    column: string,
    data: any[],
    currentSortAsc: boolean,
    toggle: boolean = true
  ): { sortedData: any[]; sortAsc: boolean } {
    const sortAsc = toggle ? !currentSortAsc : currentSortAsc;

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'string') {
        return sortAsc
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortAsc ? valueA - valueB : valueB - valueA;
    });

    return { sortedData, sortAsc };
  }
}
