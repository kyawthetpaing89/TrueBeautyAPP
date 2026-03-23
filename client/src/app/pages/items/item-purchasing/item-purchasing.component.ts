import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemlistMultiselectComponent } from '../../dialog/item/itemlist-multiselect/itemlist-multiselect.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import flatpickr from 'flatpickr';
import { item_getpurchasing_model } from '../../../models/item-model';
import { DialogService } from '../../../services/dialog-service';
import { finalize } from 'rxjs';
import { ItempurchasingPaymentComponent } from '../../dialog/item/itempurchasing-payment/itempurchasing-payment.component';
import { ItempurchasingPaymentlogComponent } from '../../dialog/item/itempurchasing-paymentlog/itempurchasing-paymentlog.component';

@Component({
  selector: 'app-item-purchasing',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './item-purchasing.component.html',
  styleUrl: './item-purchasing.component.scss',
})
export class ItemPurchasingComponent {
  @ViewChild('purchaseDateFrom') startDate!: ElementRef;
  @ViewChild('purchaseDateTo') endDate!: ElementRef;
  private purchasestartDate: any;
  private purchaseendDate: any;

  private dialog = inject(MatDialog);
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);

  purchaseID: string = '';
  purchaseDateFrom: string = '';
  purchaseDateTo: string = '';

  itemPurchaseData: any[] = [];
  itemPurchaseLoading: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'CreatedDate';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.purchasestartDate = flatpickr(this.startDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.purchaseDateFrom,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.purchaseDateFrom = dateStr;
        },
      });

      this.purchaseendDate = flatpickr(this.endDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.purchaseDateTo,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.purchaseDateTo = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Purchasing');

    this.purchaseDateFrom =
      this.generalservice.getOneMonthBeforeFormattedDate();
    this.purchaseDateTo = this.generalservice.getFormattedDate();
    this.loadItemPurchaseList();
  }

  loadItemPurchaseList() {
    this.itemPurchaseLoading = true;
    const model = item_getpurchasing_model({
      PurchaseID: this.purchaseID,
      PurchaseDateFrom: this.purchaseDateFrom,
      PurchaseDateTo: this.purchaseDateTo,
    });

    this.itemservice
      .getItemPurchasing(model)
      .pipe(
        finalize(() => {
          this.itemPurchaseLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.itemPurchaseData = response.data?.data;

            this.onSort(this.sortColumn, false);
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  loadDetail(purchaseID: string, mode: string) {}

  clearSearch() {
    this.purchaseID = '';
    this.purchaseDateFrom = '';
    this.purchaseDateTo = '';

    this.loadItemPurchaseList();
  }

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.itemPurchaseData,
      this.sortAsc,
      toggle,
    );
    this.itemPurchaseData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  openPaymentLogDialog(row?: any): void {
    const param = {
      PurchaseID: row.PurchaseID,
    };

    const dialogRef = this.dialog.open(ItempurchasingPaymentlogComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItemPurchaseList();
      }
    });
  }

  openItemPurchasingPaymentDialog(row?: any): void {
    const param = {
      Mode: 'New',
      PurchaseID: row.PurchaseID,
      TotalAmount: row.TotalAmount,
      PaidAmount: row.PaidAmount,
      Balance: row.Balance,
    };

    const dialogRef = this.dialog.open(ItempurchasingPaymentComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItemPurchaseList();
      }
    });
  }

  openItemMultiSelectRegisterDialog(mode: string, row?: any): void {
    const param = {
      Mode: mode,
      PurchaseID: mode !== 'New' ? row.PurchaseID : '',
      PurchaseDate: mode !== 'New' ? row.PurchaseDate : '',
      Notes: mode !== 'New' ? row.Notes : '',
    };

    const dialogRef = this.dialog.open(ItemlistMultiselectComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
      width: '90%',
      height: '80%',
      maxWidth: '1500px',
      minWidth: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.dialogservice.showMessage(
          'Success',
          result.data?.data?.[0]?.MessageText,
        );

        this.loadItemPurchaseList();
      }
    });
  }
}
