import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { finalize } from 'rxjs';
import { item_getstockbalance_model } from '../../../models/item-model';
import { StockregisterDialogComponent } from '../../dialog/item/stockregister-dialog/stockregister-dialog.component';

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

  itemCD: string = '';

  userrole: string = '';
  shopid: string = '';

  itemStockBalanceData: any[] = [];
  itemStockBalanceLoading: boolean = false;

  sortAsc: boolean = true;
  sortColumn: string = 'ItemCD';

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
    if (!this.itemCD) {
      return this.itemStockBalanceData;
    }

    return this.itemStockBalanceData.filter((row) =>
      row.ItemCD?.toLowerCase().includes(this.itemCD.toLowerCase())
    );
  }

  clearSearch() {
    this.itemCD = '';
  }

  shopIdChange(id: string) {
    this.shopid = id;
    this.loadItemStockBalance();
  }

  openAddStockDialog(): void {
    const dialogRef = this.dialog.open(StockregisterDialogComponent, {
      data: { ShopID: this.shopid },
      width: '70%',
      maxWidth: '95vw',
      maxHeight: '85%',
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
