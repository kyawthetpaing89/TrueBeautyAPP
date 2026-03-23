import { Component, inject } from '@angular/core';
import { GeneralService } from '../../../services/general-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  membership_get_model,
  membership_process_model,
} from '../../../models/membership-model';
import { MembershipService } from '../../../services/membership-service';
import { finalize, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MembershipregisterDialogComponent } from '../../dialog/membership/membershipregister-dialog/membershipregister-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MembershiptransactionDialogComponent } from '../../dialog/membership/membershiptransaction-dialog/membershiptransaction-dialog.component';
import { MembershipclientDialogComponent } from '../../dialog/membership/membershipclient-dialog/membershipclient-dialog.component';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog-service';
import { MembershiprenewDialogComponent } from '../../dialog/membership/membershiprenew-dialog/membershiprenew-dialog.component';

@Component({
  selector: 'app-membership-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './membership-list.component.html',
  styleUrl: './membership-list.component.scss',
})
export class MembershipListComponent {
  private dialog = inject(MatDialog);
  generalservice = inject(GeneralService);
  membershipservice = inject(MembershipService);
  dialogservice = inject(DialogService);

  membershipDataLoading: boolean = false;
  membershipData: any[] = [];

  membershipTypeData: any[] = [];
  membershipTypeItemData: any[] = [];

  clientID: string = '';

  isSubmitting: boolean = false;

  //searching
  searchMembershipId: string = '';
  searchClientIDName: string = '';
  searchMembershipType: string = '';
  searchStatus: string = '1';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Membership List');
    this.loadMembership();
    this.loadMembershipType();
    this.loadMembershipTypeItem();
  }

  loadMembershipType() {
    this.membershipservice.getMembershipType().subscribe({
      next: (response) => {
        if (response.status) {
          this.membershipTypeData = response.data?.data;
        } else {
          console.error(
            'Failed to fetch membership type data:',
            response.message,
          );
        }
      },
      error: (error) => {
        console.error('Error fetching membership type data:', error);
      },
    });
  }

  loadMembershipTypeItem() {
    this.membershipservice.getMembershipTypeItem().subscribe({
      next: (response) => {
        if (response.status) {
          this.membershipTypeItemData = response.data?.data;
        } else {
          console.error(
            'Failed to fetch membership type data:',
            response.message,
          );
        }
      },
      error: (error) => {
        console.error('Error fetching membership type data:', error);
      },
    });
  }

  loadMembership() {
    this.membershipDataLoading = true;

    const model = membership_get_model({
      MembershipID: this.searchMembershipId,
      ClientID: this.searchClientIDName,
      MembershipTypeID: this.searchMembershipType,
      Status: this.searchStatus,
    });

    this.membershipservice
      .getMembership(model)
      .pipe(
        finalize(() => {
          this.membershipDataLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.membershipData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  newMembership() {
    const param = {
      MembershipTypeItemData: this.membershipTypeItemData,
    };

    const dialogRef = this.dialog.open(MembershipregisterDialogComponent, {
      data: param,
      width: '35%',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadMembership();
      }
    });
  }

  openTransactionLog(row: any) {
    const param = {
      MembershipID: row.MembershipID,
    };

    const dialogRef = this.dialog.open(MembershiptransactionDialogComponent, {
      data: param,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
      }
    });
  }

  openRenewMembership(row: any) {
    const param = {
      MembershipTypeItemData: this.membershipTypeItemData,
      MembershipData: row,
    };

    const dialogRef = this.dialog.open(MembershiprenewDialogComponent, {
      data: param,
      width: '60%',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadMembership();
      }
    });
  }

  openMemberList(action: string, row: any) {
    const param = {
      MembershipID: row.MembershipID,
      Balance: row.Balance,
    };

    const dialogRef = this.dialog.open(MembershipclientDialogComponent, {
      data: param,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
      }
    });
  }

  async cancelMembership(row: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Membership',
        htmlContent: `<p>Are you sure you want to cancel this membership? The balance will be set to zero.</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      this.cancelConfirm(row);
    }
  }

  cancelConfirm(row: any): void {
    this.isSubmitting = true;

    const model = membership_process_model({
      MembershipID: row.MembershipID,
      LoginID: this.generalservice.getLoginID(),
      Mode: 'Cancel',
    });

    this.membershipservice
      .membershipProcess(model)
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

            this.loadMembership();
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          debugger;
          this.dialogservice.showMessage('Error', error.error.message);
        },
      });
  }

  clearSearch() {
    this.searchMembershipId = '';
    this.searchClientIDName = '';
    this.searchMembershipType = '';
    this.searchStatus = '1';

    this.loadMembership();
  }

  exportMembership() {}
}
