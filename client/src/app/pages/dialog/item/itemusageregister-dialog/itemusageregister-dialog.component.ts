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
import { ItemService } from '../../../../services/item-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import flatpickr from 'flatpickr';
import { Validator } from '../../../../utilities/validator';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize, firstValueFrom } from 'rxjs';
import { itemusage_process_model } from '../../../../models/item-model';

@Component({
  selector: 'app-itemusageregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './itemusageregister-dialog.component.html',
  styleUrl: './itemusageregister-dialog.component.scss',
})
export class ItemusageregisterDialogComponent {
  @ViewChild('txtDateUsed') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  mode: string = this.data.Mode;
  usageid: string = this.data.UsageID;
  dateused: string = this.data.DateUsed;
  itemcd: string = this.data.ItemCD;
  quantity: string = this.data.Quantity;
  notes: string = this.data.Notes;
  itemData: any[] = this.data.ItemData;
  itemtype: string = 'M';

  selectedData: any[] = [];

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ItemusageregisterDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.dateused,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.dateused = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Usage');
    this.dateused = this.generalservice.getFormattedDate();
    this.onItemTypeChange();
  }

  onItemTypeChange() {
    debugger;
    this.selectedData = this.itemData.filter(
      (x) => x.ItemType === this.itemtype
    );

    this.itemcd = this.selectedData[0].ItemCD;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async save() {
    if (!this.saveErrorcheck()) return;
    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const loginID = this.generalservice.getLoginID();
    const model = itemusage_process_model({
      UsageID: this.usageid,
      ItemCD: this.itemcd,
      DateUsed: this.dateused,
      Quantity: this.quantity,
      Notes: this.notes,
      Mode: this.data.Mode,
      LoginID: loginID,
    });

    this.itemservice
      .itemUsageProcess(model)
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
            this.dialogRef.close(response);
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          console.error('Error processing item:', error);
          this.dialogservice.showMessage('Error', error.error.errors['item']);
        },
      });
  }

  saveErrorcheck() {
    if (Validator.isEmpty(this.dateused)) {
      const htmlContent = `
            <p>
              Date Used is required.
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

    return true;
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Delete') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this usage?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
