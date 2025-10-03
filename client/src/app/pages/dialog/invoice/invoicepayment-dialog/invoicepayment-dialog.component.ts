import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import { Validator } from '../../../../utilities/validator';
import { InvoiceService } from '../../../../services/invoice-service';
import { ClientService } from '../../../../services/client-service';
import { clientpayment_get_model } from '../../../../models/client-model';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-invoicepayment-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './invoicepayment-dialog.component.html',
  styleUrl: './invoicepayment-dialog.component.scss',
})
export class InvoicepaymentDialogComponent {
  @ViewChild('txtPaymentDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private invoiceservice = inject(InvoiceService);
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  transactionID: string = '';
  invoiceNo: string = this.data.InvoiceNo;
  clientID: string = this.data.ClientID;
  paymentdate: string = this.generalservice.getFormattedDate();
  _amount: number = 0;

  mode: string = '';

  isSubmitting: boolean = false;

  get amount(): string {
    return this._amount.toLocaleString();
  }

  set amount(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._amount = isNaN(numeric) ? 0 : numeric;
  }

  constructor(
    private dialogRef: MatDialogRef<InvoicepaymentDialogComponent>,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
      dateFormat: 'd M Y',
      altFormat: 'F j, Y',
      allowInput: true,
      defaultDate: this.paymentdate || '', // set initially if available
      onChange: (selectedDates, dateStr) => {
        this.paymentdate = dateStr;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.mode = this.data.Mode || 'New';

    if (this.mode !== 'New') {
      this.transactionID = this.data.TransactionID;
      this.paymentdate = this.data.PaymentDate;
      this.amount = this.data.Amount;

      if (this.flatpickrInstance) {
        this.flatpickrInstance.setDate(this.paymentdate, true);
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async save() {
    if (!this.saveErrorCheck()) return;

    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const model = clientpayment_get_model({
      TransactionID: this.transactionID,
      ClientID: this.clientID,
      InvoiceNo: this.invoiceNo,
      PaymentDate: this.paymentdate,
      Amount: this.amount,
      Mode: this.mode,
      LoginID: this.generalservice.getLoginID(),
    });

    this.clientservice.processClientPayment(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogservice.showMessage(
            'Success',
            response.data?.data?.[0]?.MessageText
          );
          this.dialogRef.close(true);
        } else {
          this.dialogservice.showMessage('Error', response.message);
        }
      },
      error: (error) => {
        console.error('Error processing item:', error);
        this.dialogservice.showMessage('Error', error.error.errors['item']);
      },
    });
  }

  saveErrorCheck() {
    if (Validator.isEmpty(this.paymentdate)) {
      const htmlContent = `
              <p>
                Payment Date is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.amount)) {
      const htmlContent = `
              <p>
                Amount is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Delete') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this item?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
