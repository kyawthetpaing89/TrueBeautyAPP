import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ClientService } from '../../../../services/client-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-paymentdetail-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon],
  templateUrl: './paymentdetail-dialog.component.html',
  styleUrl: './paymentdetail-dialog.component.scss',
})
export class PaymentdetailDialogComponent {
  private clientservice = inject(ClientService);
  private data = inject(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<PaymentdetailDialogComponent>) {}

  paymentDetail: any[] = [];
  groupedPayments: { [date: string]: any[] } = {};

  ngOnInit(): void {
    this.loadPaymentDetails();
  }

  loadPaymentDetails() {
    const model = {
      InvoiceNo: '',
      PaymentDate: this.data.PaymentDate,
      PaymentMonth: this.data.PaymentMonth,
      PaymentYear: this.data.PaymentYear,
    };

    this.clientservice.getPaymentDetail(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.paymentDetail = response.data?.data;
          this.groupPaymentsByDate();
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  groupPaymentsByDate(): void {
    if (!Array.isArray(this.paymentDetail)) return;

    this.paymentDetail.forEach((row) => {
      const rawDate = row.PaymentDate;

      if (!rawDate) return;

      const dateKey = rawDate;

      if (!this.groupedPayments[dateKey]) {
        this.groupedPayments[dateKey] = [];
      }

      this.groupedPayments[dateKey].push(row);
    });
  }

  sortDescByDate = (a: { key: string }, b: { key: string }): number => {
    return new Date(b.key).getTime() - new Date(a.key).getTime();
  };

  getGroupTotal(group: any[]): number {
    return group.reduce((sum, item) => sum + (item.Amount || 0), 0);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
