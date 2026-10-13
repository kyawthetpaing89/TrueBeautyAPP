import { Component, inject } from '@angular/core';
import { ItemService } from '../../../../services/item-service';
import { GeneralService } from '../../../../services/general-service';
import { item_getstockdetail_model } from '../../../../models/item-model';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stockdetail-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule],
  templateUrl: './stockdetail-dialog.component.html',
  styleUrl: './stockdetail-dialog.component.scss',
})
export class StockdetailDialogComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  stockCD: string = this.data.StockCD;
  stockDetailLoading: boolean = false;

  stockDetailData: any[] = [];

  constructor(private dialogRef: MatDialogRef<StockdetailDialogComponent>) {}

  ngOnInit(): void {
    this.loadStockDetail();
  }

  loadStockDetail() {
    const model = item_getstockdetail_model({
      StockCD: this.stockCD,
    });

    this.stockDetailLoading = true;

    this.itemservice
      .getStockDetail(model)
      .pipe(
        finalize(() => {
          this.stockDetailLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.stockDetailData = response.data?.data;
          } else {
            console.error('Failed to fetch stock detail:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching stock detail:', error);
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
