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
import { EmployeeService } from '../../../../../services/employee-service';
import { GeneralService } from '../../../../../services/general-service';
import { DialogService } from '../../../../../services/dialog-service';
import flatpickr from 'flatpickr';
import { employee_get_model } from '../../../../../models/employee-model';
import { finalize, firstValueFrom } from 'rxjs';
import { Validator } from '../../../../../utilities/validator';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employeeregister-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './employeeregister-dialog.component.html',
  styleUrl: './employeeregister-dialog.component.scss',
})
export class EmployeeregisterDialogComponent {
  @ViewChild('txtDOB') dobref!: ElementRef;
  @ViewChild('txtJoinedDate') joineddateref!: ElementRef;

  private dobflatpickrInstance: any;
  private joineddateflatpickrInstance: any;

  private employeeservice = inject(EmployeeService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private data = inject(MAT_DIALOG_DATA);

  employeeID: string = '';
  employeeName: string = '';
  positionCD: string = '1';
  phoneNo: string = '';
  email: string = '';
  bankCD: string = '';
  bankAccount: string = '';
  dob: string = '';
  joinedDate: string = '';
  nrcNo: string = '';
  address: string = '';
  salary: string = '';

  mode: string = '';

  isSubmitting: boolean = false;

  positionData: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<EmployeeregisterDialogComponent>,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dobflatpickrInstance = flatpickr(this.dobref.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        allowInput: true,
      });

      this.joineddateflatpickrInstance = flatpickr(
        this.joineddateref.nativeElement,
        {
          dateFormat: 'd M Y',
          altFormat: 'F j, Y',
          allowInput: true,
        },
      );
    });
  }

  ngOnInit(): void {
    this.mode = this.data.Mode || 'New';
    this.positionData = this.data.PositionData || [];

    this.loadEmployeeInfo();
  }

  private loadEmployeeInfo() {
    if (this.data.Mode === 'New') {
      this.employeeID = '';
      this.employeeName = '';
      this.positionCD = this.positionData[0].PositionCD;
      this.phoneNo = '';
      this.email = '';
      this.bankCD = '';
      this.bankAccount = '';
      this.dob = '';
      this.joinedDate = '';
      this.nrcNo = '';
      this.address = '';
      this.salary = '';
    } else if (this.data.Mode === 'Edit' || this.data.Mode === 'Delete') {
      this.employeeID = this.data.EmployeeID;
      this.getEmployeeInfo();
    }
  }

  getEmployeeInfo() {
    const model = employee_get_model({
      EmployeeID: this.data.EmployeeID,
      EmployeeName: '',
      PositionCD: '',
    });

    this.employeeservice.getEmployee(model).subscribe({
      next: (response) => {
        if (response.status) {
          let employeedata = response.data?.data;
          if (employeedata && employeedata.length > 0) {
            this.employeeID = employeedata[0].EmployeeID;
            this.employeeName = employeedata[0].EmployeeName;
            this.positionCD = employeedata[0].PositionCD;
            this.phoneNo = employeedata[0].PhoneNo;
            this.email = employeedata[0].Email;
            this.bankCD = employeedata[0].BankCD;
            this.bankAccount = employeedata[0].BankAccount;
            this.dob = employeedata[0].DOB;
            this.joinedDate = employeedata[0].JoinedDate;
            this.nrcNo = employeedata[0].NRC;
            this.address = employeedata[0].Address;
            this.salary = employeedata[0].Salary.toLocaleString('en-US');

            const dob = new Date(this.dob);
            this.dobflatpickrInstance.setDate(dob, true);

            const joinedDate = new Date(this.joinedDate);
            this.joineddateflatpickrInstance.setDate(joinedDate, true);
          } else {
            console.warn('No Employee data found');
          }
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching employee:', error);
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
      EmployeeID: this.employeeID,
      EmployeeName: this.employeeName,
      PositionCD: this.positionCD ?? '',
      PhoneNo: this.phoneNo ?? '',
      Email: this.email ?? '',
      // BankCD: this.bankCD,
      // BankAccount: this.bankAccount,
      DOB: this.dob ?? '',
      JoinedDate: this.joinedDate ?? '',
      //NRC: this.nrcNo,
      Address: this.address ?? '',
      Salary: this.salary ?? '',
      LoginID: this.generalservice.getLoginID(),
      Mode: this.mode,
    };

    this.employeeservice
      .employeeProcess(model)
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
          this.dialogservice.showMessage('Error', error.error.errors['item']);
        },
      });
  }

  saveErrorCheck() {
    if (Validator.isEmpty(this.employeeName)) {
      const htmlContent = `
                <p>
                  Employee Name is required.
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
        htmlContent: `<p>Are you sure you want to delete this Employee?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  onSalaryChange(value: string) {
    const numericValue = value.replace(/[^0-9]/g, '');
    this.salary = this.generalservice.formatWithThousandSeparator(numericValue);
  }
}
