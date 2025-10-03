import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice-service';
import { PaymentdetailDialogComponent } from '../../dialog/salesreport/paymentdetail-dialog/paymentdetail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../../../services/general-service';

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

  years: number[] = [];
  selectedyear: number = new Date().getFullYear();
  selectedmonth: number = new Date().getMonth() + 1;
  reportType: string = '1';

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
    };

    this.invoiceservice.getSalesReport(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.dailySalesData = response.data?.data;
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
