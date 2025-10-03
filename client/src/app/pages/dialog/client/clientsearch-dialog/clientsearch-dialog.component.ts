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
import { client_get_model } from '../../../../models/client-model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clientsearch-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clientsearch-dialog.component.html',
  styleUrl: './clientsearch-dialog.component.scss',
})
export class ClientsearchDialogComponent {
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  clientID: string = '';
  clientName: string = '';
  gender: string = '';
  phoneNo: string = '';

  clientData: any[] = [];
  clientLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClientsearchDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClientList();
  }

  loadClientList() {
    this.clientLoading = true;
    const model = client_get_model({
      ClientID: this.clientID,
      Name: this.clientName,
      Gender: this.gender,
      PhoneNo: this.phoneNo,
    });

    this.clientservice
      .getClient(model)
      .pipe(
        finalize(() => {
          this.clientLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.clientData = response.data?.data;
            this.clientData.sort(
              (a, b) =>
                new Date(b.CreatedDate).getTime() -
                new Date(a.CreatedDate).getTime()
            );
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  clientSelect(selectedrow: any) {
    this.dialogRef.close(selectedrow);
  }

  clearSearch() {
    this.clientID = '';
    this.clientName = '';
    this.gender = '';
    this.phoneNo = '';

    this.loadClientList();
  }

  closeDialog(): void {
    this.dialogRef.close('');
  }
}
