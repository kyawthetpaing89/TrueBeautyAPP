import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../../../services/employee-service';
import { GeneralService } from '../../../../services/general-service';
import { employee_get_model } from '../../../../models/employee-model';
import { EmployeeregisterDialogComponent } from '../../../dialog/payroll/employee/employeeregister-dialog/employeeregister-dialog.component';

@Component({
  selector: 'app-employeelist',
  imports: [CommonModule, FormsModule, RouterModule, MatIcon],
  templateUrl: './employeelist.component.html',
  styleUrl: './employeelist.component.scss',
})
export class EmployeelistComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private employeeservice = inject(EmployeeService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  search_employeeID: string = '';
  search_employeeName: string = '';
  search_position: string = '';

  employeeDataLoading: boolean = false;
  employeeData: any[] = [];
  positionData: any[] = [];
  bankData: any[] = [];

  keepscroller: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'EmployeeName';

  showsalary: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Employee List');
    this.loadPosition();
    this.loadBank();
    this.loadEmployeeList();
  }

  loadPosition() {
    this.employeeservice.getPosition().subscribe({
      next: (response) => {
        if (response.status) {
          this.positionData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadBank() {
    this.employeeservice.getBank().subscribe({
      next: (response) => {
        if (response.status) {
          this.bankData = response.data?.data;
        } else {
          console.error('Failed to fetch bank:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching bank:', error);
      },
    });
  }

  loadEmployeeList() {
    this.employeeDataLoading = true;
    const model = employee_get_model({
      EmployeeID: this.search_employeeID,
      EmployeeName: this.search_employeeName,
      PositionCD: this.search_position,
    });

    let currentScrollTop = this.generalservice.getCurrentScroll(
      this.scrollContainer,
    );

    this.employeeservice
      .getEmployee(model)
      .pipe(
        finalize(() => {
          this.employeeDataLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.employeeData = response.data?.data;

            this.onSort(this.sortColumn, false);

            if (this.keepscroller) {
              this.generalservice.setCurrentScroll(
                this.scrollContainer,
                this.renderer,
                currentScrollTop,
              );
            }
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.employeeData,
      this.sortAsc,
      toggle,
    );
    this.employeeData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  search() {
    this.keepscroller = false;
    this.loadEmployeeList();
  }

  clearsearch() {
    this.search_employeeID = '';
    this.search_employeeName = '';
    this.search_position = '';
    this.keepscroller = false;
    this.loadEmployeeList();
  }

  openRegisterDialog(mode: string, row: any): void {
    this.cdr.detach();
    const param = {
      Mode: mode,
      EmployeeID: row.EmployeeID?.toString() || '',
      PositionData: this.positionData,
      BankData: this.bankData,
    };
    const dialogRef = this.dialog.open(EmployeeregisterDialogComponent, {
      data: param,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.cdr.reattach();
      if (result === true) {
        if (mode === 'New') {
          this.keepscroller = false;
          this.sortColumn = 'CreatedDate';
          this.sortAsc = false;
          this.loadEmployeeList();
        } else {
          this.keepscroller = true;
          this.loadEmployeeList();
        }
      }
    });
  }

  toggleSalary(): void {
    this.showsalary = !this.showsalary;
  }
}
