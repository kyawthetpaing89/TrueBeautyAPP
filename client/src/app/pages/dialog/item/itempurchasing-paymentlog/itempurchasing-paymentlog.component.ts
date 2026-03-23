import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import {
  item_getpurchasingpayment_model,
  itempurchasingpayment_model,
} from '../../../../models/item-model';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../../services/dialog-service';

@Component({
  selector: 'app-itempurchasing-paymentlog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule],
  templateUrl: './itempurchasing-paymentlog.component.html',
  styleUrl: './itempurchasing-paymentlog.component.scss',
})
export class ItempurchasingPaymentlogComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  purchaseID: string = this.data.PurchaseID;
  paymentLogLoading: boolean = false;
  ischanged: boolean = false;

  paymentLogData: any[] = [];

  isSubmitting: boolean = false;
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ItempurchasingPaymentlogComponent>,
  ) {}

  ngOnInit(): void {
    this.loadPaymentLog();
  }

  loadPaymentLog() {
    const model = item_getpurchasingpayment_model({
      PurchaseID: this.purchaseID,
    });

    this.paymentLogLoading = true;

    this.itemservice
      .getItemPurchasingPayment(model)
      .pipe(
        finalize(() => {
          this.paymentLogLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.paymentLogData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  async deletePayment(row?: any) {
    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    const model = itempurchasingpayment_model({
      TransactionID: row.TransactionID,
      PurchaseID: '',
      PaymentDate: '',
      Amount: '',
      Notes: '',
      Mode: 'Delete',
      LoginID: this.generalservice.getLoginID(),
    });

    this.itemservice
      .itemPurchasingPaymentProcess(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.ischanged = true;
            this.loadPaymentLog();
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

  closeDialog(): void {
    this.dialogRef.close(this.ischanged);
  }

  async deleteConfirm(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this payment?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
