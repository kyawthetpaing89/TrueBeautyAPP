import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import flatpickr from 'flatpickr';
import { Validator } from '../../../../utilities/validator';
import { finalize } from 'rxjs';
import {
  item_getstockbalance_model,
  item_stockprocess_model,
} from '../../../../models/item-model';

@Component({
  selector: 'app-stockregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './stockregister-dialog.component.html',
  styleUrl: './stockregister-dialog.component.scss',
})
export class StockregisterDialogComponent {
  @ViewChild('txtStockUpdateDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  shopid: string = this.data.ShopID;
  stockUpdateDate: string = '';
  filterText: string = '';

  stockBalanceData: any[] = [];
  stockBalanceLoading: boolean = false;

  isSubmitting: boolean = false;

  constructor(private dialogRef: MatDialogRef<StockregisterDialogComponent>) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.stockUpdateDate,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.stockUpdateDate = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.stockUpdateDate = this.generalservice.getFormattedDate();
    this.loadItemStockBalance();
  }

  loadItemStockBalance() {
    this.stockBalanceLoading = true;
    const model = item_getstockbalance_model({
      ShopID: this.shopid,
    });

    this.itemservice
      .getItemStockBalance(model)
      .pipe(
        finalize(() => {
          this.stockBalanceLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.stockBalanceData = (response.data?.data ?? []).map(
              (row: any) => ({
                ...row,
                AddQty: 0,
              })
            );
          } else {
            console.error(
              'Failed to fetch item stock balance:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error fetching item stock balance:', error);
        },
      });
  }

  getNewBalance(row: any): number {
    return (row.QtyBalance || 0) + (row.AddQty || 0);
  }

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

  get filteredStockBalanceData(): any[] {
    if (!this.filterText) {
      return this.stockBalanceData;
    }

    const filter = this.filterText.toLowerCase();
    return this.stockBalanceData.filter(
      (row) =>
        row.ItemCD?.toLowerCase().includes(filter) ||
        row.ItemName?.toLowerCase().includes(filter)
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save() {
    if (!this.saveErrorcheck()) return;

    this.isSubmitting = true;

    const shopDetailJson = JSON.stringify(
      this.stockBalanceData.map((row) => ({
        ItemCD: row.ItemCD,
        AddedQty: row.AddQty || 0,
        FinalQty: this.getNewBalance(row),
      }))
    );

    const model = item_stockprocess_model({
      Mode: 'New',
      ShopID: this.shopid,
      StockUpdateDate: this.stockUpdateDate,
      CreatedBy: this.generalservice.getLoginID(),
      ShopDetailJson: shopDetailJson,
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
    if (Validator.isEmpty(this.stockUpdateDate)) {
      const htmlContent = `
            <p>
              Stock Update Date is required.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
