import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { DialogService } from '../../../services/dialog-service';
import flatpickr from 'flatpickr';
import { finalize } from 'rxjs';
import {
  item_get_model,
  item_getusage_model,
} from '../../../models/item-model';
import { ItemusageregisterDialogComponent } from '../../dialog/item/itemusageregister-dialog/itemusageregister-dialog.component';

@Component({
  selector: 'app-item-usagelist',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './item-usagelist.component.html',
  styleUrl: './item-usagelist.component.scss',
})
export class ItemUsagelistComponent {
  @ViewChild('usageDateFrom') startDate!: ElementRef;
  @ViewChild('usageDateTo') endDate!: ElementRef;
  private usagestartDate: any;
  private usageendDate: any;

  private dialog = inject(MatDialog);
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);

  usageID: string = '';
  usageDateFrom: string = '';
  usageDateTo: string = '';
  itemCD: string = '';
  itemName: string = '';

  itemUsageData: any[] = [];
  itemUsageLoading: boolean = false;
  itemData: any[] = [];

  sortAsc: boolean = false;
  sortColumn: string = 'CreatedDate';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.usagestartDate = flatpickr(this.startDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.usageDateFrom,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.usageDateFrom = dateStr;
        },
      });

      this.usageendDate = flatpickr(this.endDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.usageDateTo,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.usageDateTo = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Purchasing');

    this.usageDateFrom = this.generalservice.getOneMonthBeforeFormattedDate();
    this.usageDateTo = this.generalservice.getFormattedDate();
    this.loadItemUsageList();
    this.loadItem();
  }

  loadItem() {
    const model = item_get_model({
      ItemType: 'M,S,O',
    });

    this.itemservice.getItem(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.itemData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadItemUsageList() {
    this.itemUsageLoading = true;
    const model = item_getusage_model({
      UsageID: this.usageID,
      DateUsedFrom: this.usageDateFrom,
      DateUsedTo: this.usageDateTo,
    });

    this.itemservice
      .getItemUsage(model)
      .pipe(
        finalize(() => {
          this.itemUsageLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.itemUsageData = response.data?.data;

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

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.itemUsageData,
      this.sortAsc,
      toggle
    );
    this.itemUsageData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  clearSearch() {
    this.usageID = '';
    this.itemCD = '';
    this.itemName = '';
    this.usageDateFrom = '';
    this.usageDateTo = '';

    this.loadItemUsageList();
  }

  openItemUsageRegisterDialog(mode: string, row?: any): void {
    const param = {
      Mode: mode,
      UsageID: mode !== 'New' ? row.UsageID : '',
      ItemCD: mode !== 'New' ? row.ItemCD : '',
      Quantity: mode !== 'New' ? row.Quantity : '',
      Notes: mode !== 'New' ? row.Notes : '',
      ItemData: this.itemData,
    };

    const dialogRef = this.dialog.open(ItemusageregisterDialogComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        this.dialogservice.showMessage(
          'Success',
          result.data?.data?.[0]?.MessageText
        );

        this.loadItemUsageList();
      }
    });
  }
}
