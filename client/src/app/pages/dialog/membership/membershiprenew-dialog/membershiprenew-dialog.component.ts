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
import { DialogService } from '../../../../services/dialog-service';
import { MembershipService } from '../../../../services/membership-service';
import { GeneralService } from '../../../../services/general-service';
import flatpickr from 'flatpickr';
import { finalize } from 'rxjs';
import { membership_process_model } from '../../../../models/membership-model';

@Component({
  selector: 'app-membershiprenew-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './membershiprenew-dialog.component.html',
  styleUrl: './membershiprenew-dialog.component.scss',
})
export class MembershiprenewDialogComponent {
  private dialog = inject(MatDialog);
  dialogservice = inject(DialogService);
  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);
  private data = inject(MAT_DIALOG_DATA);

  @ViewChild('txtStartDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  membershipData: any;

  membershipID: string = '';
  selectedMembershipTypeID: string = '001';
  membershipType: string = '';

  amount: string = '';
  cashback: string = '';
  total: string = '';
  renewalamount: string = '';

  validForMonths: string = '';
  startDate: string = '';
  expiredDate: string = '';

  note: string = '';

  membershipTypeData: any[] = [];

  isSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<MembershiprenewDialogComponent>,
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
    this.membershipTypeData = this.data.MembershipTypeData;
    this.membershipData = this.data.MembershipData;
    this.note = this.membershipData.Note;

    if (this.membershipTypeData && this.membershipTypeData.length > 0) {
      this.selectedMembershipTypeID =
        this.membershipTypeData[0].MembershipTypeID;
      this.onMembershipTypeChange();
    }
  }

  onMembershipTypeChange() {
    const row = this.membershipTypeData?.find(
      (x) => x.MembershipTypeID == this.selectedMembershipTypeID,
    );

    if (row) {
      this.membershipType = row.MembershipType;
      this.amount = row.Amount.toLocaleString();
      this.cashback = row.Cashback.toLocaleString();
      this.validForMonths = row.DurationMonths;

      this.calculateTotal();
      this.calculateExpiredDate();
    }
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
    const amount = Number(this.amount?.replace(/,/g, '')) || 0;
    const cashback = Number(this.cashback?.replace(/,/g, '')) || 0;
    const balance =
      Number(this.membershipData?.Balance?.toString().replace(/,/g, '')) || 0;

    const total = amount + cashback;
    const renewal = total + balance;

    this.total = total.toLocaleString();
    this.renewalamount = renewal.toLocaleString();
  }

  save(): void {
    if (!this.saveErrorCheck()) {
      return;
    }

    this.isSubmitting = true;

    const model = membership_process_model({
      MembershipID: this.membershipData.MembershipID,
      ClientID: this.membershipData.PrimaryClientID,
      MembershipTypeID: this.selectedMembershipTypeID,
      StartDate: this.generalservice.getFormattedDate(this.startDate),
      ExpiredDate: this.generalservice.getFormattedDate(this.expiredDate),
      AmountItemCD: this.amount.toLocaleString(),
      CashbackItemCD: this.cashback ?? '0',
      Note: this.note,
      LoginID: this.generalservice.getLoginID(),
      Mode: 'Renewal',
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
          debugger;
          this.dialogservice.showMessage('Error', error.error.message);
        },
      });
  }

  saveErrorCheck(): boolean {
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
