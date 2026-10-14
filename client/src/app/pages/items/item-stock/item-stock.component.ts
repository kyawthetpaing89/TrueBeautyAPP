import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-item-stock',
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './item-stock.component.html',
  styleUrl: './item-stock.component.scss',
})
export class ItemStockComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);

  itemStockData: any[] = [];
  itemStockLoading: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'TransactionDate';

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Stock History');

    this.loadItemStockHistory();
  }

  loadItemStockHistory() {
    this.itemStockLoading = true;

    this.itemservice
      .getItemStockHistory()
      .pipe(
        finalize(() => {
          this.itemStockLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.itemStockData = response.data?.data;

            this.onSort(this.sortColumn, false);
          } else {
            console.error(
              'Failed to fetch item stock history:',
              response.message
            );
          }
        },
        error: (error) => {
          console.error('Error fetching item stock history:', error);
        },
      });
  }

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.itemStockData,
      this.sortAsc,
      toggle
    );
    this.itemStockData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }
}
