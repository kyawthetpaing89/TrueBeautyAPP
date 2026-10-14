import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../../services/item-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import { Validator } from '../../../../utilities/validator';
import { finalize } from 'rxjs';
import { item_stockprocess_model } from '../../../../models/item-model';

@Component({
  selector: 'app-stockregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './stockregister-dialog.component.html',
  styleUrl: './stockregister-dialog.component.scss',
})
export class StockregisterDialogComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  shopid: string = this.data.ShopID;
  itemCD: string = this.data.ItemCD;
  itemName: string = this.data.ItemName;
  balance: number = this.data.Balance || 0;
  addedQty: number | null = null;

  isSubmitting: boolean = false;

  constructor(private dialogRef: MatDialogRef<StockregisterDialogComponent>) {}

  get shopLabel(): string {
    switch (this.shopid) {
      case '001':
        return 'Shop 1';
      case '002':
        return 'Shop 2';
      default:
        return this.shopid;
    }
  }

  get newBalance(): number {
    return this.balance + (this.addedQty || 0);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save() {
    if (!this.saveErrorcheck()) return;

    this.isSubmitting = true;

    const model = item_stockprocess_model({
      Mode: 'New',
      ShopID: this.shopid,
      ItemCD: this.itemCD,
      AddedQty: this.addedQty ?? 0,
      CreatedBy: this.generalservice.getLoginID(),
    });

    this.itemservice
      .itemStockProcess(model)
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
            this.dialogRef.close(response);
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          console.error('Error processing stock:', error);
          this.dialogservice.showMessage(
            'Error',
            error.error?.errors?.['item']
          );
        },
      });
  }

  saveErrorcheck() {
    if (Validator.isEmpty(this.addedQty)) {
      const htmlContent = `
            <p>
              Added Qty is required.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
