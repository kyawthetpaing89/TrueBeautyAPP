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
import { DialogService } from '../../../../services/dialog-service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clienttreatmenthistory-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clienttreatmenthistory-dialog.component.html',
  styleUrl: './clienttreatmenthistory-dialog.component.scss',
})
export class ClienttreatmenthistoryDialogComponent {
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  clienttreatmentLoading: boolean = false;
  clienttreatmentData: any[] = [];

  isChange: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClienttreatmenthistoryDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClientTreatment();
  }

  loadClientTreatment() {
    this.clienttreatmentLoading = true;
    const model = {
      InvoiceNo: this.data.InvoiceNo,
      SEQ: this.data.SEQ,
    };

    this.clientservice
      .getClientTreatment(model)
      .pipe(
        finalize(() => {
          this.clienttreatmentLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.clienttreatmentData = response.data?.data;
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
    this.dialogRef.close(this.isChange);
  }

  deleteCheckin(row: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: `<p>Are you sure you want to delete this treatment check-in?</p>`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteCheckinConfirm(row);
      }
    });
  }

  deleteCheckinConfirm(row: any) {
    const model = {
      ID: row.ID.toString(),
      InvoiceNo: '',
      ClientID: '',
      SEQ: '',
      TreatmentDate: '',
      Mode: 'Delete',
      LoginID: this.generalservice.getLoginID(),
    };

    this.clientservice.ClientTreatmentCheckinProcess(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.dialogservice.showMessage(
            'Success',
            response.data?.data?.[0]?.MessageText
          );

          this.isChange = true;
          this.loadClientTreatment();
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }
}
