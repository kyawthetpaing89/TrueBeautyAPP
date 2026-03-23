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
import { MembershipService } from '../../../../services/membership-service';
import { GeneralService } from '../../../../services/general-service';
import {
  membershipclients_get_model,
  membershipclients_process_model,
} from '../../../../models/membership-model';
import { finalize, firstValueFrom } from 'rxjs';
import { ClientsearchDialogComponent } from '../../client/clientsearch-dialog/clientsearch-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-membershipclient-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule],
  templateUrl: './membershipclient-dialog.component.html',
  styleUrl: './membershipclient-dialog.component.scss',
})
export class MembershipclientDialogComponent {
  private dialog = inject(MatDialog);
  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  membershipID: string = '';
  clientID: string = '';
  membershipClientsLoading: boolean = false;
  balance: number = 0;

  membershipClientsData: any[] = [];

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<MembershipclientDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.membershipID = this.data.MembershipID;
    this.balance = this.data.Balance;
    this.loadMembershipClients();
  }

  loadMembershipClients() {
    const model = membershipclients_get_model({
      MembershipID: this.membershipID,
    });

    this.membershipClientsLoading = true;

    this.membershipservice
      .getMembershipClients(model)
      .pipe(
        finalize(() => {
          this.membershipClientsLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.membershipClientsData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  selectClient() {
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
        this.clientID = selectedrow.ClientID;
        this.processFamilyMember('New');
      }
    });
  }

  processFamilyMember(mode: string) {
    const model = membershipclients_process_model({
      MembershipID: this.membershipID,
      ClientID: this.clientID,
      IsPrimary: '0',
      LoginID: this.generalservice.getLoginID(),
      Mode: mode,
    });

    this.isSubmitting = true;

    this.membershipservice
      .membershipClientsProcess(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.loadMembershipClients();
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  async deleteMember(row: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Remove Membership',
        htmlContent: `<p>Are you sure you want to remove this client from membership?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.clientID = row.ClientID;
      this.processFamilyMember('Delete');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
