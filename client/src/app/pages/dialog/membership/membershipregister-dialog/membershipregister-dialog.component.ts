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
import { MembershipService } from '../../../../services/membership-service';
import { GeneralService } from '../../../../services/general-service';
import flatpickr from 'flatpickr';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ClientsearchDialogComponent } from '../../client/clientsearch-dialog/clientsearch-dialog.component';
import { DialogService } from '../../../../services/dialog-service';
import { membership_process_model } from '../../../../models/membership-model';

@Component({
  selector: 'app-membershipregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './membershipregister-dialog.component.html',
  styleUrl: './membershipregister-dialog.component.scss',
})
export class MembershipregisterDialogComponent {
  private dialog = inject(MatDialog);
  dialogservice = inject(DialogService);
  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  @ViewChild('txtStartDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  membershipID: string = '';
  clientID: string = '';
  clientName: string = '';
  membershipType: string = '';

  selectedMembershipTypeID: string = '';
  selectedAmount: string = '';
  selectedCashBack: string = '';

  amount: string = '';
  cashback: string = '';
  total: string = '';

  validForMonths: string = '';
  startDate: string = '';
  expiredDate: string = '';

  note: string = '';

  membershipTypeItemData: any[] = [];
  membershipTypeData: any[] = [];
  membershipAmount: any[] = [];
  membershipCashback: any[] = [];

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<MembershipregisterDialogComponent>,
  ) {}

  ngAfterViewInit(): void {
    this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
      dateFormat: 'd M Y',
      allowInput: true,
      defaultDate: this.startDate,
      onChange: (selectedDates, dateStr) => {
        this.startDate = dateStr;
        this.calculateExpiredDate();
      },
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Membership Register');
    this.startDate = this.generalservice.getFormattedDate();

    this.membershipTypeItemData = this.data.MembershipTypeItemData;
    // distinct membership type
    this.membershipTypeData = Array.from(
      new Map(
        this.membershipTypeItemData.map((x) => [
          x.MembershipTypeID,
          {
            MembershipTypeID: x.MembershipTypeID,
            Description: x.Description,
          },
        ]),
      ).values(),
    );

    // set first membership as default
    if (this.membershipTypeItemData.length > 0) {
      let first = this.membershipTypeItemData[0];

      this.selectedMembershipTypeID = first.MembershipTypeID;
      this.onMembershipTypeChange(first);
    }
  }

  onMembershipTypeChange(first: any | null) {
    if (!first) {
      first = this.membershipTypeItemData.filter(
        (x) => x.MembershipTypeID === this.selectedMembershipTypeID,
      )[0];
    }

    this.validForMonths = first.DurationMonths;

    this.membershipAmount = this.membershipTypeItemData.filter(
      (x) =>
        x.MembershipTypeID === this.selectedMembershipTypeID &&
        x.IsCashBack === false,
    );

    this.membershipCashback = this.membershipTypeItemData.filter(
      (x) =>
        x.MembershipTypeID === this.selectedMembershipTypeID &&
        x.IsCashBack === true,
    );

    first = this.membershipAmount[0];
    this.selectedAmount = first.ItemCD;

    first = this.membershipCashback[0];
    this.selectedCashBack = first.ItemCD;

    this.calculateTotal();
    this.calculateExpiredDate();
  }

  onCashbackChange() {
    this.calculateTotal();
  }

  calculateExpiredDate() {
    if (this.startDate && this.validForMonths) {
      const start = new Date(this.startDate);
      const validMonths = parseInt(this.validForMonths, 10);

      if (!isNaN(validMonths)) {
        start.setMonth(start.getMonth() + validMonths);
        this.expiredDate = this.generalservice.getFormattedDate(start);
      } else {
        this.expiredDate = '';
      }
    } else {
      this.expiredDate = '';
    }
  }

  calculateTotal() {
    debugger;
    const amount = this.membershipTypeItemData.find(
      (x) => x.ItemCD === this.selectedAmount,
    );

    const cashback = this.membershipTypeItemData.find(
      (x) => x.ItemCD === this.selectedCashBack,
    );

    const total = (amount?.Price || 0) + (cashback?.Price || 0);

    this.total = total.toLocaleString();
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
        this.clientID = selectedrow.ClientID;
        this.clientName = selectedrow.Name;
      }
    });
  }

  save(): void {
    if (!this.saveErrorCheck()) {
      return;
    }

    this.isSubmitting = true;

    const model = membership_process_model({
      ClientID: this.clientID,
      MembershipTypeID: this.selectedMembershipTypeID,
      StartDate: this.startDate,
      ExpiredDate: this.expiredDate,
      AmountItemCD: this.selectedAmount,
      CashbackItemCD: this.selectedCashBack,
      Note: this.note,
      LoginID: this.generalservice.getLoginID(),
      Mode: 'Register',
    });
    debugger;
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
            this.dialogRef.close(true);
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          this.dialogservice.showMessage('Error', error.error.message);
        },
      });
  }

  saveErrorCheck(): boolean {
    if (!this.clientID) {
      const htmlContent = `<p>Client is required.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (!this.validForMonths || this.validForMonths === '0') {
      const htmlContent = `<p>Valid for months is required.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (!this.startDate) {
      const htmlContent = `<p>Start date is required.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
