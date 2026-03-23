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
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import {
  client_getcurrentmembership_model,
  client_getmembercard_model,
  client_getmembercardtransactions_model,
} from '../../../../models/client-model';

@Component({
  selector: 'app-clientmembership-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './clientmembership-dialog.component.html',
  styleUrl: './clientmembership-dialog.component.scss',
})
export class ClientmembershipDialogComponent {
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  clientID: string = '';
  clientName: string = '';
  currentMembership: string = '';
  membershipBalance: string = '';
  joinedDate: string = '';

  membershipDataLoading: boolean = false;
  membershipData: any[] = [];

  currentmembershipDataLoading: boolean = false;
  currentmembershipData: any[] = [];

  membershipTransactionsDataLoading: boolean = false;
  membershipTransactionsData: any[] = [];

  selectedCard: string = '';
  memberCardData: any[] = this.data.MemberCards || [];
  membershipAmount: string = '';

  hascurrentMembership: boolean = false;
  isSubmitting: boolean = false;

  selectedClientMemberCardID!: number;
  totalTransactionsAmount: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ClientmembershipDialogComponent>,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.clientID = this.data.ClientID || '';
    this.clientName = this.data.ClientName || '';
    this.selectedCard =
      this.memberCardData.length > 0 ? this.memberCardData[0].MemberCardCD : '';

    this.loadCardAmount(this.selectedCard);
    this.getCurrentMembership();
    this.loadClientMemberCard();
  }

  getCurrentMembership(): void {
    const model = client_getcurrentmembership_model({
      ClientID: this.clientID,
    });

    this.clientservice
      .getClientCurrentMembership(model)
      .pipe(
        finalize(() => {
          this.currentmembershipDataLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.currentmembershipData = response.data?.data;
            this.checkHasCurrentMembership();
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  checkHasCurrentMembership(): void {
    if (!this.currentmembershipData?.length) {
      this.resetMembership();
      return;
    }

    const latestMembership = this.currentmembershipData[0];
    const balance = Number(latestMembership?.Balance ?? 0);

    if (balance <= 0) {
      this.resetMembership();
      return;
    }

    this.currentMembership = latestMembership?.Membership ?? '';
    this.membershipBalance = balance.toLocaleString();
    this.joinedDate = latestMembership?.JoinedDate ?? '';
    this.hascurrentMembership = true;
  }

  private resetMembership(): void {
    this.currentMembership = '';
    this.membershipBalance = '';
    this.joinedDate = '';
    this.hascurrentMembership = false;
  }

  loadClientMemberCard(): void {
    this.membershipDataLoading = true;

    const model = client_getmembercard_model({
      ClientID: this.clientID,
    });

    this.clientservice
      .getClientMemberCard(model)
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

  loadTransactions(clientmembercardID: number): void {
    this.selectedClientMemberCardID = clientmembercardID;
    this.membershipTransactionsDataLoading = true;

    const model = client_getmembercardtransactions_model({
      ClientMemberCardID: clientmembercardID.toString(),
    });

    this.clientservice
      .getClientMemberCardTransactions(model)
      .pipe(
        finalize(() => {
          this.membershipTransactionsDataLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.membershipTransactionsData = response.data?.data;

            // 🔥 Calculate total
            this.totalTransactionsAmount =
              this.membershipTransactionsData.reduce(
                (sum: number, item: any) => sum + Number(item.Amount || 0),
                0,
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

  loadCardAmount(cardCode: string): void {
    const selected = this.memberCardData.find(
      (card) => card.MemberCardCD === cardCode,
    );

    if (selected?.Amount != null) {
      const amountNumber = Number(selected.Total);
      this.membershipAmount = amountNumber.toLocaleString();
    } else {
      this.membershipAmount = '';
    }
  }

  async processConfirm(mode: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title:
          mode === 'Join'
            ? 'Confirm Membership Join'
            : 'Confirm Membership Cancel',
        htmlContent: `<p>Are you sure you want this client to ${mode.toLowerCase()} membership?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  async processMembership(mode: string) {
    const confirmed = await this.processConfirm(mode);
    if (!confirmed) return;

    this.isSubmitting = true;

    const model = {
      Mode: mode,
      ClientID: this.clientID,
      MemberCardCD: this.selectedCard,
      LoginID: this.generalservice.getLoginID() ?? '',
    };

    this.clientservice
      .clientMemberCardProcess(model)
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

            this.loadClientMemberCard();
            this.getCurrentMembership();
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}
