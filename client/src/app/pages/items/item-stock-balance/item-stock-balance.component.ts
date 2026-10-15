import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { DialogService } from '../../../services/dialog-service';
import { finalize } from 'rxjs';
import {
  item_getstockbalance_model,
  item_stockclosingprocess_model,
} from '../../../models/item-model';
import { StockregisterDialogComponent } from '../../dialog/item/stockregister-dialog/stockregister-dialog.component';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-item-stock-balance',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './item-stock-balance.component.html',
  styleUrl: './item-stock-balance.component.scss',
})
export class ItemStockBalanceComponent {
  private dialog = inject(MatDialog);
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);

  itemCD: string = '';
  selectedTab: string = 'M';

  userrole: string = '';
  shopid: string = '';

  itemStockBalanceData: any[] = [];
  itemStockBalanceLoading: boolean = false;

  sortAsc: boolean = true;
  sortColumn: string = 'Balance';

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Stock Balance');

    this.userrole = this.generalservice.getUserRole() ?? '';
    this.shopid = this.generalservice.getShopID() ?? '';

    this.loadItemStockBalance();
  }

  loadItemStockBalance() {
    this.itemStockBalanceLoading = true;
    const model = item_getstockbalance_model({
      ShopID: this.shopid,
    });

    this.itemservice
      .getItemStockBalance(model)
      .pipe(
        finalize(() => {
          this.itemStockBalanceLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.itemStockBalanceData = response.data?.data;

            this.onSort(this.sortColumn, false);
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

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.itemStockBalanceData,
      this.sortAsc,
      toggle
    );
    this.itemStockBalanceData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  get filteredItemStockBalanceData(): any[] {
    let data = this.itemStockBalanceData.filter(
      (row) => row.ItemType === this.selectedTab
    );

    if (this.itemCD) {
      const filter = this.itemCD.toLowerCase();
      data = data.filter(
        (row) =>
          row.ItemCD?.toLowerCase().includes(filter) ||
          row.ItemName?.toLowerCase().includes(filter)
      );
    }

    return data;
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }

  clearSearch() {
    this.itemCD = '';
  }

  exportStockBalance() {
    const model = item_getstockbalance_model({
      ShopID: this.shopid,
    });

    this.itemservice.exportItemStockBalance(model);
  }

  shopIdChange(id: string) {
    this.shopid = id;
    this.loadItemStockBalance();
  }

  stockClosing(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Stock Closing',
        htmlContent: `<p>Are you sure you want to close the stock for all shops? This cannot be undone.</p>`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.processStockClosing();
      }
    });
  }

  processStockClosing() {
    this.itemStockBalanceLoading = true;

    const model = item_stockclosingprocess_model({
      CreatedBy: this.generalservice.getLoginID(),
    });

    this.itemservice
      .itemStockClosingProcess(model)
      .pipe(
        finalize(() => {
          this.itemStockBalanceLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.dialogservice.showMessage(
              'Success',
              response.data?.data?.[0]?.MessageText ?? 'Stock closing completed.'
            );
            this.loadItemStockBalance();
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          console.error('Error processing stock closing:', error);
          this.dialogservice.showMessage(
            'Error',
            error.error?.errors?.['item']
          );
        },
      });
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

  openAddStockDialog(row: any): void {
    const dialogRef = this.dialog.open(StockregisterDialogComponent, {
      data: {
        ShopID: this.shopid,
        ItemCD: row.ItemCD,
        ItemName: row.ItemName,
        Balance: row.Balance,
      },
      width: '400px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.status) {
        this.loadItemStockBalance();
      }
    });
  }
}
