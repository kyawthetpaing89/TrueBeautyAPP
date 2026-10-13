import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import flatpickr from 'flatpickr';
import { finalize } from 'rxjs';
import { item_getstockhistory_model } from '../../../models/item-model';
import { StockdetailDialogComponent } from '../../dialog/item/stockdetail-dialog/stockdetail-dialog.component';

@Component({
  selector: 'app-item-stock',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './item-stock.component.html',
  styleUrl: './item-stock.component.scss',
})
export class ItemStockComponent {
  @ViewChild('stockDateFrom') startDate!: ElementRef;
  @ViewChild('stockDateTo') endDate!: ElementRef;
  private stockstartDate: any;
  private stockendDate: any;

  private dialog = inject(MatDialog);
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);

  stockDateFrom: string = '';
  stockDateTo: string = '';

  itemStockData: any[] = [];
  itemStockLoading: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'StockUpdateDate';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stockstartDate = flatpickr(this.startDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.stockDateFrom,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.stockDateFrom = dateStr;
        },
      });

      this.stockendDate = flatpickr(this.endDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.stockDateTo,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.stockDateTo = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Stock History');

    this.stockDateFrom = this.generalservice.getOneMonthBeforeFormattedDate();
    this.stockDateTo = this.generalservice.getFormattedDate();
    this.loadItemStockHistory();
  }

  loadItemStockHistory() {
    this.itemStockLoading = true;
    const model = item_getstockhistory_model({
      StockUpdateDateFrom: this.stockDateFrom,
      StockUpdateDateTo: this.stockDateTo,
    });

    this.itemservice
      .getItemStockHistory(model)
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

  clearSearch() {
    this.stockDateFrom = '';
    this.stockDateTo = '';

    this.loadItemStockHistory();
  }

  openStockDetailDialog(row: any): void {
    const param = {
      StockCD: row.StockCD,
    };

    this.dialog.open(StockdetailDialogComponent, {
      data: param,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
      disableClose: true,
    });
  }
}
