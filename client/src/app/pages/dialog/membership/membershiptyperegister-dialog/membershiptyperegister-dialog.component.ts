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
import { DialogService } from '../../../../services/dialog-service';
import { GeneralService } from '../../../../services/general-service';
import { Validator } from '../../../../utilities/validator';
import { membershiptype_process_model } from '../../../../models/membership-model';
import { MembershipService } from '../../../../services/membership-service';

@Component({
  selector: 'app-membershiptyperegister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './membershiptyperegister-dialog.component.html',
  styleUrl: './membershiptyperegister-dialog.component.scss',
})
export class MembershiptyperegisterDialogComponent {
  private data = inject(MAT_DIALOG_DATA);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  membershipservice = inject(MembershipService);

  row = this.data.row;

  membershipTypeID: string = this.row.MembershipTypeID || '';
  description: string = this.row.Description || '';
  durationMonths: string = this.row.DurationMonths || '';
  amount: string = this.row.Amount
    ? Number(this.row.Amount).toLocaleString()
    : '';

  cashback: string = this.row.Cashback
    ? Number(this.row.Cashback).toLocaleString()
    : '';

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<MembershiptyperegisterDialogComponent>,
    private dialog: MatDialog,
  ) {}

  save(): void {
    if (!this.saveErrorCheck()) return;

    this.isSubmitting = true;

    const model = membershiptype_process_model({
      MembershipTypeID: this.membershipTypeID,
      Description: this.description,
      DurationMonths: this.durationMonths,
      Amount: this.amount,
      Cashback: this.cashback,
      LoginID: this.generalservice.getLoginID(),
    });

    this.membershipservice.membershipTypeProcess(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogservice.showMessage(
            'Success',
            response.data?.data?.[0]?.MessageText,
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

  saveErrorCheck() {
    if (Validator.isEmpty(this.description)) {
      const htmlContent = `
                <p>
                  Description is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.durationMonths)) {
      const htmlContent = `
                <p>
                  Duration Months is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (!Validator.isPositiveNumber(this.durationMonths)) {
      const htmlContent = `
                <p>
                  Duration Months must be greater than zero.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.amount)) {
      const htmlContent = `
                <p>
                  Amount is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (!Validator.isPositiveNumber(this.amount)) {
      const htmlContent = `
                <p>
                  Amount must be greater than zero.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.cashback)) {
      const htmlContent = `
                <p>
                  Cashback is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
