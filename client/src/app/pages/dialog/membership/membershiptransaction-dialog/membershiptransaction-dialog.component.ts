import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MembershipService } from '../../../../services/membership-service';
import { GeneralService } from '../../../../services/general-service';
import { membershiptransaction_get_model } from '../../../../models/membership-model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-membershiptransaction-dialog',
  imports: [CommonModule, MatDialogModule, MatIcon, FormsModule],
  templateUrl: './membershiptransaction-dialog.component.html',
  styleUrl: './membershiptransaction-dialog.component.scss',
})
export class MembershiptransactionDialogComponent {
  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  membershipID: string = '';
  membershipTransactionLoading: boolean = false;

  membershipTransactionData: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<MembershiptransactionDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.membershipID = this.data.MembershipID;
    this.loadMembershipTransaction();
  }

  loadMembershipTransaction() {
    const model = membershiptransaction_get_model({
      MembershipID: this.membershipID,
    });

    this.membershipTransactionLoading = true;

    this.membershipservice
      .getMembershipTransaction(model)
      .pipe(
        finalize(() => {
          this.membershipTransactionLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.membershipTransactionData = response.data?.data;
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
}
