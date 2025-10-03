import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ClientService } from '../../../../services/client-service';
import { GeneralService } from '../../../../services/general-service';
import { ItemService } from '../../../../services/item-service';
import { DialogService } from '../../../../services/dialog-service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-treatmentinstruction-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './treatmentinstruction-dialog.component.html',
  styleUrl: './treatmentinstruction-dialog.component.scss',
})
export class TreatmentinstructionDialogComponent {
  private clientservice = inject(ClientService);
  private itemservice = inject(ItemService);
  dialogservice = inject(DialogService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  private data = inject(MAT_DIALOG_DATA);

  treatmentData: any[] = [];
  medicineData: any[] = [];
  itemLoading: boolean = false;

  mode: string = this.data.Mode;
  instructionCD: string = this.data.InstructionCD;
  clientID: string = this.data.ClientID;
  notes: string = this.data.Notes;

  isSubmitting: boolean = false;

  sortTreatmentAsc: boolean = true;
  sortTreatmentColumn: string = 'ItemName';

  sortMedicineAsc: boolean = true;
  sortMedicineColumn: string = 'ItemName';

  constructor(
    private dialogRef: MatDialogRef<TreatmentinstructionDialogComponent>
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  onTreatmentSort(column: string) {
    this.sortTreatmentColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.treatmentData,
      this.sortTreatmentAsc
    );
    this.treatmentData = result.sortedData;
    this.sortTreatmentAsc = result.sortAsc;
  }

  onMedicineSort(column: string) {
    this.sortMedicineColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.medicineData,
      this.sortMedicineAsc
    );
    this.medicineData = result.sortedData;
    this.sortMedicineAsc = result.sortAsc;
  }

  loadItem() {
    this.itemLoading = true;
    const model = {
      ItemCD: '',
      ItemName: '',
      ItemType: 'T,M',
      InstructionCD: this.instructionCD,
    };

    this.itemservice
      .getItem(model)
      .pipe(
        finalize(() => {
          this.itemLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            const itemdata = response.data?.data;

            this.treatmentData = itemdata.filter(
              (x: any) => x.ItemType === 'T'
            );
            this.medicineData = itemdata.filter((x: any) => x.ItemType === 'M');

            this.onTreatmentSort(this.sortTreatmentColumn);
            this.onMedicineSort(this.sortMedicineColumn);
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  async save() {
    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;
    const model = {
      Mode: this.mode,
      ClientID: this.clientID,
      ItemList: this.getCheckedItems(),
      Notes: this.notes,
      LoginID: this.generalservice.getLoginID(),
      InstructionCD: this.instructionCD,
    };

    this.clientservice
      .processDoctorInstruction(model)
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
          this.dialogservice.showMessage('Error', error.error.errors['item']);
        },
      });
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Delete') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this instruction?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  getCheckedItems(): string {
    const checkedItemCDs: string[] = [];

    // From treatmentData
    this.treatmentData.forEach((row) => {
      if (row.IsInstruction === '1' && row.ItemCD) {
        checkedItemCDs.push(row.ItemCD);
      }
    });

    // From medicineData
    this.medicineData.forEach((row) => {
      if (row.IsInstruction === '1' && row.ItemCD) {
        checkedItemCDs.push(row.ItemCD);
      }
    });

    return JSON.stringify(checkedItemCDs);
  }

  toggleInstruction(row: any): void {
    if (this.mode !== 'Delete') {
      row.IsInstruction = row.IsInstruction === '1' ? '0' : '1';
    }
  }
}
