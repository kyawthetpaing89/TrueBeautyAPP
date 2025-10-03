import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ItemService } from '../../../../services/item-service';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../../services/general-service';
import { Validator } from '../../../../utilities/validator';
import { DialogService } from '../../../../services/dialog-service';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-itemregister-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule],
  templateUrl: './itemregister-dialog.component.html',
  styleUrl: './itemregister-dialog.component.scss',
})
export class ItemregisterDialogComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  itemCD: string = '';
  itemName: string = '';
  quantity: string = '';
  description: string = '';
  price: string = '';
  itemType: string = this.data.ItemType || 'T';
  mode: string = '';
  itemTypeName: string =
    this.data.ItemType === 'T'
      ? 'Treatment'
      : this.data.ItemType === 'M'
      ? 'Medicine'
      : 'Skin Care';

  isSubmitting: boolean = false;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ItemregisterDialogComponent>
  ) {}

  ngOnInit(): void {
    this.mode = this.data.Mode || 'New';
    this.loadItemInfo();
  }

  loadItemInfo() {
    if (this.data.Mode === 'New') {
      this.itemCD = '';
      this.itemName = '';
      this.quantity = '';
      this.description = '';
      this.price = '';
    } else if (this.data.Mode === 'Edit' || this.data.Mode === 'Delete') {
      this.itemCD = this.data.ItemCD;
      this.getItemInfo();
    }
  }

  getItemInfo() {
    const model = {
      ItemCD: this.data.ItemCD,
      ItemName: '',
      ItemType: '',
      InstructionCD: '',
    };

    this.itemservice.getItem(model).subscribe({
      next: (response) => {
        if (response.status) {
          let itemdata = response.data?.data;
          if (itemdata && itemdata.length > 0) {
            this.itemName = itemdata[0].ItemName;
            this.quantity = itemdata[0].Quantity.toLocaleString();
            this.description = itemdata[0].Description;
            this.price = itemdata[0].Price.toLocaleString();
            this.itemType = itemdata[0].ItemType.toString();
          } else {
            console.warn('No item data found for the given ItemCD');
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  async save() {
    if (!this.saveErrorCheck()) return;

    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const model = {
      Mode: this.mode,
      ItemCD: this.itemCD,
      ItemName: this.itemName,
      ItemType: this.itemType,
      Quantity: this.quantity.replace(/,/g, '').toString(),
      Description: this.description ?? '',
      Price: this.price.replace(/,/g, '').toString(),
      LoginID: this.generalservice.getLoginID(),
    };

    this.itemservice
      .ItemProcess(model)
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
            this.dialogRef.close(true);
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          console.error('Error processing item:', error);
          this.dialogservice.showMessage('Error', 'Failed to process item.');
        },
      });
  }

  onQuantityChange(value: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    this.quantity =
      this.generalservice.formatWithThousandSeparator(numericValue);
  }

  onPriceChange(value: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    this.price = this.generalservice.formatWithThousandSeparator(numericValue);
  }

  saveErrorCheck() {
    if (Validator.isEmpty(this.itemName)) {
      const htmlContent = `
            <p>
              Item Name is required.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.quantity)) {
      const htmlContent = `
            <p>
              Quantity is required.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.price)) {
      const htmlContent = `
            <p>
              Price is required.
            </p>
          `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Delete') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this item?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
