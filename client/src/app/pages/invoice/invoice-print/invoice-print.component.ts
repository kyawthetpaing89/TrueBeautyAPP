import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice-service';
import { GeneralService } from '../../../services/general-service';
import {
  invoice_get_model,
  invoicedetail_get_model,
} from '../../../models/invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client-service';
import { Validator } from '../../../utilities/validator';

@Component({
  selector: 'app-invoice-print',
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-print.component.html',
  styleUrl: './invoice-print.component.scss',
})
export class InvoicePrintComponent {
  private invoiceservice = inject(InvoiceService);
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);

  invoiceNo: string = '';
  invoiceData: any = [];
  invoiceDetailData: any[] = [];
  paymentDetailData: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';

    if (Validator.isEmpty(this.invoiceNo)) {
      this.router.navigate(['/error404']);
    }

    this.loadInvoice();
    this.loadInvoiceDetail();
    this.loadPaymentDetail();
  }

  loadInvoice() {
    const model = invoice_get_model({
      InvoiceNo: this.invoiceNo,
    });

    this.invoiceservice.getInvoice(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.invoiceData = response.data?.data[0];
          if (response.data?.data.length <= 0) {
            this.router.navigate(['/error404']);
          }
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadInvoiceDetail() {
    const model = invoicedetail_get_model({
      InvoiceNo: this.invoiceNo,
    });

    this.invoiceservice.getInvoiceDetail(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.invoiceDetailData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadPaymentDetail() {
    const model = invoicedetail_get_model({
      InvoiceNo: this.invoiceNo,
    });

    this.clientservice.getPaymentDetail(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.paymentDetailData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }
}
