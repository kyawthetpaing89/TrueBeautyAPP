import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ClientService } from '../../../../services/client-service';
import { GeneralService } from '../../../../services/general-service';
import { DialogService } from '../../../../services/dialog-service';
import { Validator } from '../../../../utilities/validator';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { client_get_model } from '../../../../models/client-model';

@Component({
  selector: 'app-clientregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clientregister-dialog.component.html',
  styleUrl: './clientregister-dialog.component.scss',
})
export class ClientregisterDialogComponent {
  @ViewChild('txtDOB') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  clientID: string = '';
  clientName: string = '';
  gender: string = '1';
  dob: string = '';
  phoneNo: string = '';
  address: string = '';

  mode: string = '';

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClientregisterDialogComponent>,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        allowInput: true,
      });
    });
  }

  ngOnInit(): void {
    this.mode = this.data.Mode || 'New';
    this.loadClientInfo();
  }

  private loadClientInfo() {
    if (this.data.Mode === 'New') {
      this.clientID = '';
      this.clientName = '';
      this.gender = '1';
      this.dob = '';
      this.phoneNo = '';
      this.address = '';
    } else if (this.data.Mode === 'Edit' || this.data.Mode === 'Delete') {
      this.clientID = this.data.ClientID;
      this.getClientInfo();
    }
  }

  getClientInfo() {
    const model = client_get_model({
      ClientID: this.data.ClientID,
      Name: '',
      Gender: '',
      ShopID: '',
      PhoneNo: '',
    });

    this.clientservice.getClient(model).subscribe({
      next: (response) => {
        if (response.status) {
          let clientdata = response.data?.data;
          if (clientdata && clientdata.length > 0) {
            this.clientID = clientdata[0].ClientID;
            this.clientName = clientdata[0].Name.toString();
            this.gender = clientdata[0].Gender;
            this.dob = clientdata[0].DOB;
            this.phoneNo = clientdata[0].PhoneNo;
            this.address = clientdata[0].Address;
            const targetDate = new Date(this.dob);
            this.flatpickrInstance.setDate(targetDate, true);
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
      ClientID: this.clientID,
      Name: this.clientName,
      Gender: this.gender,
      DOB: this.dob ?? '',
      PhoneNo: this.phoneNo,
      Address: this.address ?? '',
      LoginID: this.generalservice.getLoginID(),
    };

    this.clientservice
      .ClientProcess(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
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
    if (Validator.isEmpty(this.clientName)) {
      const htmlContent = `
              <p>
                Client Name is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.phoneNo)) {
      const htmlContent = `
              <p>
                Phone Number is required.
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
