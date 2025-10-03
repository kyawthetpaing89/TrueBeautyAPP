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
import { GeneralService } from '../../../../services/general-service';
import { HolidayService } from '../../../../services/holiday-service';
import { Validator } from '../../../../utilities/validator';
import { DialogService } from '../../../../services/dialog-service';
import { holiday_process_model } from '../../../../models/holiday-model';

@Component({
  selector: 'app-holidayregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './holidayregister-dialog.component.html',
  styleUrl: './holidayregister-dialog.component.scss',
})
export class HolidayregisterDialogComponent {
  private holidayservice = inject(HolidayService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);
  private dialogservice = inject(DialogService);

  holidayDate: string =
    this.generalservice.getFormattedDate(this.data.HolidayDate) || '';
  description: string = this.data.Description || '';
  mode: string = this.data.Mode || 'New';

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<HolidayregisterDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  save() {
    if (!this.saveErrorcheck()) return;

    const model = holiday_process_model({
      Mode: this.mode,
      HolidayDate: this.holidayDate,
      Description: this.description,
      LoginID: this.generalservice.getLoginID(),
    });

    this.holidayservice.holidayProcess(model).subscribe({
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
        this.dialogservice.showMessage('Error', error.error.errors['item']);
      },
    });
  }

  saveErrorcheck() {
    if (Validator.isEmpty(this.description)) {
      const htmlContent = `
                  <p>
                    Description is required.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
