import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice-service';
import { PaymentdetailDialogComponent } from '../../dialog/salesreport/paymentdetail-dialog/paymentdetail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../../../services/general-service';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-salesreport',
  imports: [CommonModule, FormsModule],
  templateUrl: './salesreport.component.html',
  styleUrl: './salesreport.component.scss',
})
export class SalesreportComponent {
  private invoiceservice = inject(InvoiceService);
  private dialog = inject(MatDialog);
  private generalservice = inject(GeneralService);

  dailySalesData: any[] = [];
  salesLoading: boolean = false;

  totalRow: any = {};

  years: number[] = [];
  selectedyear: number = new Date().getFullYear();
  selectedmonth: number = new Date().getMonth() + 1;
  reportType: string = '1';
  shopid: string = '';

  datefrom: string = '';
  dateto: string = '';

  @ViewChild('DateFrom')
  set dateFrom(el: ElementRef | undefined) {
    if (!el) return;

    this.objFromDate = flatpickr(el.nativeElement, {
      dateFormat: 'd M Y',
      defaultDate: this.datefrom,
      allowInput: true,
      onChange: (_, dateStr) => {
        this.datefrom = dateStr;
      },
    });
  }

  @ViewChild('DateTo')
  set dateTo(el: ElementRef | undefined) {
    if (!el) return;

    this.objToDate = flatpickr(el.nativeElement, {
      dateFormat: 'd M Y',
      defaultDate: this.dateto,
      allowInput: true,
      onChange: (_, dateStr) => {
        this.dateto = dateStr;
      },
    });
  }
  private objFromDate: any;
  private objToDate: any;

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  ngOnInit(): void {
    this.generalservice.setPageTitle('Sales Report');
    this.selectedyear = new Date().getFullYear();
    this.datefrom = this.generalservice.getOneMonthBeforeFormattedDate();
    this.dateto = this.generalservice.getFormattedDate();

    for (let year = this.selectedyear; year >= 2024; year--) {
      this.years.push(year);
    }

    this.loadReport();
  }

  loadReport() {
    this.salesLoading = true;
    const model = {
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
      ReportType: this.reportType,
      ShopID: this.shopid,
      FromDate: this.datefrom,
      ToDate: this.dateto,
    };

    this.invoiceservice.getSalesReport(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.dailySalesData = response.data?.data;
          this.calculateTotalRow();
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
      complete: () => {
        this.salesLoading = false;
      },
    });
  }

  calculateTotalRow() {
    const t = {
      TotalClient: 0,
      TreatmentQty: 0,
      TreatmentAmount: 0,
      MedicineQty: 0,
      MedicineAmount: 0,
      SkinCareQty: 0,
      SkinCareAmount: 0,

      S1TotalMembershipSales: 0,
      S1TotalSales: 0,
      S1TotalDiscount: 0,
      S1TotalPayment: 0,

      S2TotalMembershipSales: 0,
      S2TotalSales: 0,
      S2TotalDiscount: 0,
      S2TotalPayment: 0,

      TotalMembershipSales: 0,
      TotalSales: 0,
      TotalDiscount: 0,
      TotalPayment: 0,
    };

    for (const r of this.dailySalesData) {
      t.TotalClient += r.TotalClient;

      t.TreatmentQty += r.TreatmentQty;
      t.TreatmentAmount += r.TreatmentAmount;

      t.MedicineQty += r.MedicineQty;
      t.MedicineAmount += r.MedicineAmount;

      t.SkinCareQty += r.SkinCareQty;
      t.SkinCareAmount += r.SkinCareAmount;

      t.S1TotalMembershipSales += r.S1TotalMembershipSales;
      t.S1TotalSales += r.S1TotalSales;
      t.S1TotalDiscount += r.S1TotalDiscount;
      t.S1TotalPayment += r.S1TotalPayment;

      t.S2TotalMembershipSales += r.S2TotalMembershipSales;
      t.S2TotalSales += r.S2TotalSales;
      t.S2TotalDiscount += r.S2TotalDiscount;
      t.S2TotalPayment += r.S2TotalPayment;

      t.TotalMembershipSales += r.TotalMembershipSales;
      t.TotalSales += r.TotalSales;
      t.TotalDiscount += r.TotalDiscount;
      t.TotalPayment += r.TotalPayment;
    }

    this.totalRow = t;
  }

  openIncomeDetail(row: any): void {
    var paymentDate: string = '';
    var paymentMonth: string = '';
    var paymentYear: string = '';

    if (this.reportType === '1') {
      paymentDate = row.PaymentDate?.toString() || '';
    } else if (this.reportType === '2') {
      paymentMonth = row.PaymentDate?.toString() || '';
      paymentYear = this.selectedyear.toString();
    } else {
      paymentYear = row.PaymentDate?.toString() || '';
    }

    const details = {
      InvoiceNo: '',
      PaymentDate: paymentDate,
      PaymentMonth: paymentMonth,
      PaymentYear: paymentYear,
      ShopID: this.shopid,
    };

    this.dialog.open(PaymentdetailDialogComponent, {
      data: details,
      width: '90%',
      maxWidth: '95vw',
      height: '70%',
      maxHeight: '90vh',
      autoFocus: false,
    });
  }
}
