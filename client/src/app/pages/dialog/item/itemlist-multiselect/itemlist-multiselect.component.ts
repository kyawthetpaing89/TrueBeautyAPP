import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  item_getpurchasedlist_model,
  item_purchasingprocess_model,
} from '../../../../models/item-model';
import { ItemService } from '../../../../services/item-service';
import { finalize, firstValueFrom } from 'rxjs';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import flatpickr from 'flatpickr';
import { Validator } from '../../../../utilities/validator';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-itemlist-multiselect',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './itemlist-multiselect.component.html',
  styleUrl: './itemlist-multiselect.component.scss',
})
export class ItemlistMultiselectComponent {
  @ViewChild('purchaseDate') pdate!: ElementRef;
  private pdinstance: any;

  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<ItemlistMultiselectComponent>,
    private dialog: MatDialog
  ) {}

  mode: string = this.data.Mode;
  purchaseID: string = this.data.PurchaseID;
  itemCD: string = '';
  notes: string = this.data.Notes;
  itemName: string = '';
  purchaseDate: string = this.data.PurchaseDate
    ? this.generalservice.getFormattedDate()
    : '';
  totalamount: string = this.data.TotalAmount ?? '';
  payment: string = this.data.TotalQty ?? '';

  step: string = '1';

  itemData: any[] = [];
  selectedMap: {
    [itemCD: string]: {
      selected: boolean;
      qty?: string;
      amt?: string;
    };
  } = {};
  itemLoading: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'CreatedDate';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pdinstance = flatpickr(this.pdate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.purchaseDate,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.purchaseDate = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.purchaseDate = this.generalservice.getFormattedDate();
    this.loadItemList();
  }

  loadItemList() {
    this.itemLoading = true;
    const model = item_getpurchasedlist_model({
      ItemCD: this.itemCD,
      ItemName: this.itemName,
      PurchaseID: this.purchaseID,
    });

    this.itemservice
      .getItemPurchasedList(model)
      .pipe(
        finalize(() => {
          this.itemLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            const incoming = response.data?.data as any[];

            (incoming || []).forEach((item) => {
              if (item.selected === 1) {
                this.selectedMap[item.ItemCD] = {
                  selected: true,
                  qty: item.Quantity?.toString(),
                  amt: item.TotalAmount?.toString(),
                };
              }
            });

            this.itemData = incoming.map((item: any) => ({
              ...item,
              selected: !!this.selectedMap[item.ItemCD],
              quantity: 0,
              totalamount: 0,
            }));
            this.onSort(this.sortColumn, false);

            if (this.mode === 'Detail' || this.mode === 'Delete') {
              this.next();
            }
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
      this.itemData,
      this.sortAsc,
      toggle
    );
    this.itemData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  clearSearch() {
    this.itemCD = '';
    this.itemName = '';

    this.loadItemList();
  }

  closeDialog(): void {
    this.dialogRef.close('');
  }

  next() {
    if (!this.isItemselected()) return;

    this.step = '2';
    this.itemData = this.itemData?.filter((item) => item.selected) || [];
  }

  back() {
    this.step = '1';
    this.loadItemList();
  }

  async save() {
    if (!this.saveErrorcheck()) return;
    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    const itemJson = JSON.stringify(
      Object.entries(this.selectedMap).map(([itemCD, v]) => ({
        itemCD,
        qty: v.qty ?? '',
        amt: v.amt ?? '',
      }))
    );

    const model = item_purchasingprocess_model({
      Mode: this.mode,
      PurchaseID: this.purchaseID,
      PurchaseDate: this.purchaseDate,
      Notes: this.notes ?? '',
      ItemJson: itemJson,
      LoginID: this.generalservice.getLoginID(),
    });

    this.itemservice
      .itemPurchasingProcess(model)
      .pipe(finalize(() => {}))
      .subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Delete') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this purchase list?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  isItemselected() {
    if (this.mode === 'Detail' || this.mode === 'Delete') return true;

    const selectedCount = Object.values(this.selectedMap).filter(
      (item) => item.selected
    ).length;
    if (selectedCount <= 0) {
      const htmlContent = `
            <p>
              Please select at least one record.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  saveErrorcheck() {
    if (this.mode === 'Delete') return true;

    if (!this.isItemselected) return false;

    const hasEmptyQtyOrAmt = Object.values(this.selectedMap).some(
      (item) => item.selected && (!item.qty || !item.amt)
    );

    if (hasEmptyQtyOrAmt) {
      const htmlContent = `
            <p>
              Please fill the quantity and amount for all record.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.purchaseDate)) {
      const htmlContent = `
                <p>
                  Purchase Date is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  toggleSelection(row: any): void {
    row.selected = !row.selected;

    if (row.selected) {
      this.selectedMap[row.ItemCD] = {
        selected: true,
      };
    } else {
      delete this.selectedMap[row.ItemCD];
    }
  }

  onQtyChange(itemCD: string, value: string): void {
    if (this.selectedMap[itemCD]) {
      this.selectedMap[itemCD].qty = value;
    }
  }

  onFormattedAmtChange(itemCD: string, event: string): void {
    const raw = event.replace(/,/g, '');
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      this.selectedMap[itemCD].amt = num.toString();
    } else {
      this.selectedMap[itemCD].amt = '';
    }
  }
}
