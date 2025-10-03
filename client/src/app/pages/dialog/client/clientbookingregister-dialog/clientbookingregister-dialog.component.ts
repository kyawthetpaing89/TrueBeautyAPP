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
import { ClientsearchDialogComponent } from '../clientsearch-dialog/clientsearch-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize, firstValueFrom } from 'rxjs';
import { ClientService } from '../../../../services/client-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import { Validator } from '../../../../utilities/validator';
import { clientbooking_process_model } from '../../../../models/client-model';

@Component({
  selector: 'app-clientbookingregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clientbookingregister-dialog.component.html',
  styleUrl: './clientbookingregister-dialog.component.scss',
})
export class ClientbookingregisterDialogComponent {
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  bookingcd: string = '';
  clientid: string = '';
  clientname: string = '';
  bookingdate: string = this.data.BookingDate || '';
  bookingslot: string = this.data.BookingSlots;
  note: string = '';
  cancelreason: string = '';

  event: any = this.data.Event || null;

  mode: string = this.data.Mode || 'New';

  slotTimes: { index: number; label: string }[] = [
    { index: 9, label: '09:00 AM - 10:00 AM' },
    { index: 10, label: '10:00 AM - 11:00 AM' },
    { index: 11, label: '11:00 AM - 12:00 PM' },
    { index: 12, label: '12:00 PM - 01:00 PM' },
    { index: 13, label: '01:00 PM - 02:00 PM' },
    { index: 14, label: '02:00 PM - 03:00 PM' },
    { index: 15, label: '03:00 PM - 04:00 PM' },
    { index: 16, label: '04:00 PM - 05:00 PM' },
    { index: 17, label: '05:00 PM - 06:00 PM' },
  ];

  selectedSlotIndex: number | null = null;

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClientbookingregisterDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.event) {
      this.mode = 'Cancel';
      this.bookingcd = this.event.extendedProps.BookingCD || '';
      this.clientid = this.event.extendedProps.ClientID || '';
      this.clientname = this.event.extendedProps.Name || '';
      this.note = this.event.extendedProps.Notes || '';
      this.bookingslot = this.event.extendedProps.BookingSlot || '';
      this.selectedSlotIndex = parseInt(this.bookingslot, 10);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openClientSearchDialog(): void {
    const param = {};

    const dialogRef = this.dialog.open(ClientsearchDialogComponent, {
      data: param,
      width: '90%',
      maxWidth: '95vw',
      height: '73%',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((selectedrow) => {
      if (selectedrow) {
        this.clientid = selectedrow.ClientID;
        this.clientname = selectedrow.Name;
      }
    });
  }

  selectSlot(index: number) {
    this.selectedSlotIndex = index;
  }

  async save() {
    if (!this.saveErrorCheck()) return;
    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const model = clientbooking_process_model({
      BookingCD: this.bookingcd,
      ClientID: this.clientid,
      BookingDate: this.bookingdate,
      BookingSlot: this.selectedSlotIndex?.toString(),
      Notes: this.note,
      CancelReason: this.cancelreason,
      LoginID: this.generalservice.getLoginID(),
      Mode: this.mode,
    });

    this.clientservice
      .clientBookingProcess(model)
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
          this.dialogservice.showMessage('Error', error.error.errors['item']);
        },
      });
  }

  saveErrorCheck() {
    if (this.mode === 'Cancel' && Validator.isEmpty(this.cancelreason)) {
      const htmlContent = `
                <p>
                  Cancel reason is required.
                </p>
              `;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.clientid)) {
      const htmlContent = `
                <p>
                  Client ID is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (this.selectedSlotIndex === null) {
      const htmlContent = `
                <p>
                  Booking time is required.
                </p>
              `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  async deleteConfirm(): Promise<boolean> {
    if (this.mode !== 'Cancel') return true;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to cancel this booking?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
