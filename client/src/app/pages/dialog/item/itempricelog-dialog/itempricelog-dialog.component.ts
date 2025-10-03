import { Component, inject } from '@angular/core';
import { ItemService } from '../../../../services/item-service';
import { GeneralService } from '../../../../services/general-service';
import { item_getpricelog_model } from '../../../../models/item-model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-itempricelog-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule], 
  templateUrl: './itempricelog-dialog.component.html',
  styleUrl: './itempricelog-dialog.component.scss',
})
export class ItempricelogDialogComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  itemCD: string = this.data.ItemCD;
  priceLogLoading: boolean = false;

  priceLogData: any[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ItempricelogDialogComponent>
  ) {}

  ngOnInit(): void {
    this.loadItemPriceLog();
  }

  loadItemPriceLog() {
    const model = item_getpricelog_model({
      ItemCD: this.itemCD,
    });

    this.priceLogLoading = true;

    this.itemservice
      .getItemPriceLog(model)
      .pipe(
        finalize(() => {
          this.priceLogLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.priceLogData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
