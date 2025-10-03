import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../../services/item-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import { itempurchasingpayment_model } from '../../../../models/item-model';
import { finalize } from 'rxjs';
import { Validator } from '../../../../utilities/validator';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-itempurchasing-payment',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './itempurchasing-payment.component.html',
  styleUrl: './itempurchasing-payment.component.scss',
})
export class ItempurchasingPaymentComponent {
  @ViewChild('txtPaymentDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  transactionID: string = '';
  purchaseID: string = this.data.PurchaseID;
  paymentID: string = '';

  _amount: number = 0;
  _totalamount: number = this.data.TotalAmount || 0;
  _paidamount: number = this.data.PaidAmount || 0;
  _balance: number = this.data.Balance || 0;
  notes: string = '';
  mode: string = this.data.Mode;
  paymentDate: string =
    this.mode === 'New' ? this.generalservice.getFormattedDate() : '';

  isSubmitting: boolean = false;

  get totalamount(): string {
    return this._totalamount.toLocaleString();
  }

  set totalamount(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._totalamount = isNaN(numeric) ? 0 : numeric;
  }

  get balance(): string {
    return this._balance.toLocaleString();
  }

  set balance(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._balance = isNaN(numeric) ? 0 : numeric;
  }

  get paidamount(): string {
    return this._paidamount.toLocaleString();
  }

  set paidamount(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._paidamount = isNaN(numeric) ? 0 : numeric;
  }

  get amount(): string {
    return this._amount.toLocaleString();
  }

  set amount(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._amount = isNaN(numeric) ? 0 : numeric;
  }

  ngAfterViewInit(): void {
    this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
      dateFormat: 'd M Y',
      altFormat: 'F j, Y',
      allowInput: true,
      defaultDate: this.generalservice.getFormattedDateTime(),
      onChange: (selectedDates, dateStr) => {
        this.paymentDate = dateStr;
        this.cdr.detectChanges();
      },
    });
  }

  constructor(
    private dialogRef: MatDialogRef<ItempurchasingPaymentComponent>,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  async save() {
    if (!this.saveErrorCheck()) return;

    this.isSubmitting = true;

    const model = itempurchasingpayment_model({
      TransactionID: this.transactionID,
      PurchaseID: this.purchaseID,
      PaymentID: this.paymentID,
      PaymentDate: this.paymentDate,
      Amount: this.amount,
      Notes: this.notes,
      Mode: this.mode,
      LoginID: this.generalservice.getLoginID(),
    });

    this.itemservice
      .itemPurchasingPaymentProcess(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
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
    if (Validator.isEmpty(this.paymentDate)) {
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

    if (this._balance < 0) {
      const htmlContent = `
                <p>
                  Amount cannot be greater than Balance.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  amountChange() {
    this._balance = this._totalamount - (this._paidamount + this._amount);
  }
}
