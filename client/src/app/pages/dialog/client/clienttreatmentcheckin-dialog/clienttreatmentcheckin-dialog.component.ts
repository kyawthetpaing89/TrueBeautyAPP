import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ClientService } from '../../../../services/client-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import flatpickr from 'flatpickr';
import { Validator } from '../../../../utilities/validator';

@Component({
  selector: 'app-clienttreatmentcheckin-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clienttreatmentcheckin-dialog.component.html',
  styleUrl: './clienttreatmentcheckin-dialog.component.scss',
})
export class ClienttreatmentcheckinDialogComponent {
  @ViewChild('txtCheckinDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  id: string = this.data.ID;
  invoiceNo: string = this.data.InvoiceNo;
  seq: string = this.data.SEQ;
  clientID: string = this.data.ClientID;
  clientname: string = this.data.ClientName;
  itemName: string = this.data.ItemName;
  checkinDate: string = this.generalservice.getFormattedDate();

  constructor(
    private dialogRef: MatDialogRef<ClienttreatmentcheckinDialogComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // 1. Initialize Flatpickr
    this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
      dateFormat: 'd M Y',
      altFormat: 'F j, Y',
      allowInput: true,
      defaultDate: this.checkinDate,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save() {
    if (!this.saveErrorCheck()) return;
    const model = {
      Mode: 'Checkin',
      InvoiceNo: this.invoiceNo,
      ID: '',
      ClientID: this.clientID,
      SEQ: this.seq,
      TreatmentDate: this.checkinDate,
      LoginID: this.generalservice.getLoginID(),
    };

    this.clientservice.ClientTreatmentCheckinProcess(model).subscribe({
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

  saveErrorCheck() {
    if (Validator.isEmpty(this.checkinDate)) {
      const htmlContent = `
              <p>
                Check-in Date is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
