import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GeneralService } from '../../../services/general-service';
import { MembershipService } from '../../../services/membership-service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { MembershiptyperegisterDialogComponent } from '../../dialog/membership/membershiptyperegister-dialog/membershiptyperegister-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-membership-typelist',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './membership-typelist.component.html',
  styleUrl: './membership-typelist.component.scss',
})
export class MembershipTypelistComponent {
  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  membershipTypeDataLoading: boolean = false;
  membershipTypeData: any[] = [];

  ngOnInit(): void {
    this.generalservice.setPageTitle('Membership Type List');
    this.loadMembershipType();
  }

  loadMembershipType() {
    this.membershipTypeDataLoading = true;

    this.membershipservice
      .getMembershipType()
      .pipe(
        finalize(() => {
          this.membershipTypeDataLoading = false;
        }),
      )
      .subscribe({
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

  openMembershipTypeDialog(mode: string, row?: any): void {
    const param = {
      row: row,
    };

    const dialogRef = this.dialog.open(MembershiptyperegisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadMembershipType();
      }
    });
  }
}
