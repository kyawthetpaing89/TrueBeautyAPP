import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../../services/invoice-service';
import { GeneralService } from '../../../services/general-service';
import { MatDialog } from '@angular/material/dialog';
import {
  invoice_copy_model,
  invoice_export_model,
  invoice_get_model,
} from '../../../models/invoice-model';
import flatpickr from 'flatpickr';
import { Router } from '@angular/router';
import { item_get_model } from '../../../models/item-model';
import { ItemService } from '../../../services/item-service';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../services/dialog-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-invoicelist',
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './invoicelist.component.html',
  styleUrl: './invoicelist.component.scss',
})
export class InvoicelistComponent {
  @ViewChild('invoiceDateFrom') startDate!: ElementRef;
  @ViewChild('invoiceDateTo') endDate!: ElementRef;
  private invoicestartDate: any;
  private invoiceendDate: any;

  private invoiceservice = inject(InvoiceService);
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  private dialogservice = inject(DialogService);
  private dialog = inject(MatDialog);

  invoiceNo: string = '';
  invoiceDateFrom: string = '';
  invoiceDateTo: string = '';
  clientIDName: string = '';
  treatmentCD: string = '';
  medicineCD: string = '';
  skincareCD: string = '';

  itemData: any[] = [];
  treatmentData: any[] = [];
  medicineData: any[] = [];
  skincareData: any[] = [];

  invoiceData: any[] = [];
  invoiceLoading: boolean = false;

  groupedInvoices: any[] = [];

  sortAsc: boolean = false;
  sortColumn: string = 'InvoiceDate';

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.invoicestartDate = flatpickr(this.startDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.invoiceDateFrom,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.invoiceDateFrom = dateStr;
        },
      });

      this.invoiceendDate = flatpickr(this.endDate.nativeElement, {
        dateFormat: 'd M Y',
        altFormat: 'F j, Y',
        defaultDate: this.invoiceDateTo,
        allowInput: true,
        onChange: (selectedDates, dateStr) => {
          this.invoiceDateTo = dateStr;
        },
      });
    });
  }

  ngOnInit(): void {
    this.generalservice.setPageTitle('Invoice List');
    this.loadItem();

    this.invoiceDateFrom = this.generalservice.getOneWeekBeforeFormattedDate();
    this.invoiceDateTo = this.generalservice.getFormattedDate();
    this.loadInvoice();
  }

  loadItem() {
    const model = item_get_model({});

    this.itemservice.getItem(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.itemData = response.data?.data;
          this.treatmentData = this.itemData.filter((x) => x.ItemType === 'T');
          this.medicineData = this.itemData.filter((x) => x.ItemType === 'M');
          this.skincareData = this.itemData.filter((x) => x.ItemType === 'S');
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadInvoice() {
    this.invoiceLoading = true;
    const model = invoice_get_model({
      InvoiceNo: this.invoiceNo,
      InvoiceDateFrom: this.invoiceDateFrom,
      InvoiceDateTo: this.invoiceDateTo,
      ClientIDName: this.clientIDName,
      TreatmentCD: this.treatmentCD,
      MedicineCD: this.medicineCD,
      SkincareCD: this.skincareCD,
    });

    this.invoiceservice.getInvoice(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.invoiceLoading = false;
          this.invoiceData = response.data?.data;

          this.onSort(this.sortColumn, false);

          this.groupInvoicesByDate();
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  groupInvoicesByDate() {
    const groups: { [key: string]: any[] } = {};

    this.invoiceData.forEach((row) => {
      // Normalize to only yyyy-MM-dd (ignore time)
      const dateOnly = new Date(row.FormattedInvoiceDate)
        .toISOString()
        .split('T')[0];

      if (!groups[dateOnly]) {
        groups[dateOnly] = [];
      }
      groups[dateOnly].push(row);
    });

    this.groupedInvoices = Object.keys(groups).map((date) => {
      const rows = groups[date];
      return {
        date,
        rows,
        totals: {
          TotalPrice: rows.reduce((sum, r) => sum + r.TotalPrice, 0),
          TotalPayment: rows.reduce((sum, r) => sum + r.TotalPayment, 0),
          Discount: rows.reduce((sum, r) => sum + r.Discount, 0),
          OutstandingBalance: rows.reduce(
            (sum, r) => sum + r.OutstandingBalance,
            0
          ),
        },
      };
    });
  }

  newInvoice() {
    this.router.navigate(['/invoice/invoice-register']);
  }

  async gotoregister(invoiceNo: string, mode: string) {
    if (mode === 'copy') {
      if (await this.copyConfirm()) {
        const model = invoice_copy_model({
          InvoiceNo: invoiceNo,
        });

        this.invoiceservice
          .invoiceCopy(model)
          .pipe(finalize(() => {}))
          .subscribe({
            next: (response) => {
              if (response.status) {
                if (this.generalservice.getUserRole() === 'admin') {
                  this.router.navigate([
                    '/invoice/invoice-register',
                    response.data?.data?.[0]?.InvoiceNo,
                    'Edit',
                  ]);
                } else {
                  this.router.navigate([
                    '/invoice/invoice-register',
                    response.data?.data?.[0]?.InvoiceNo,
                    mode,
                  ]);
                }
              } else {
                const htmlContent = `
                <p>
                  Copy Failed.
                </p>
                `;

                this.dialogservice.showMessage('Error', htmlContent);
              }
            },
            error: (error) => {
              const htmlContent = `
                <p>
                  Copy Failed.
                </p>
                `;

              this.dialogservice.showMessage('Error', htmlContent);
            },
          });
      }
    } else {
      this.router.navigate(['/invoice/invoice-register', invoiceNo, mode]);
    }
  }

  onSort(column: string, toggle: boolean = true) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.invoiceData,
      this.sortAsc,
      toggle
    );
    this.invoiceData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  async copyConfirm(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Copying',
        htmlContent: `<p>Are you sure you want to Copy this invoice?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  clearSearch() {
    this.invoiceNo = '';

    this.invoiceDateFrom = this.generalservice.getOneWeekBeforeFormattedDate();
    this.invoicestartDate.setDate(this.invoiceDateFrom, true);
    this.invoiceDateTo = this.generalservice.getFormattedDate();
    this.invoiceendDate.setDate(this.invoiceDateTo, true);

    this.clientIDName = '';
    this.treatmentCD = '';
    this.medicineCD = '';
    this.skincareCD = '';

    this.loadInvoice();
  }

  gotoprint(invoiceNo: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/invoice/invoice-print', invoiceNo])
    );
    window.open(url, '_blank');
  }

  exportInvoice() {
    const model = invoice_export_model({
      InvoiceNo: this.invoiceNo,
      InvoiceDateFrom: this.invoiceDateFrom,
      InvoiceDateTo: this.invoiceDateTo,
      ClientIDName: this.clientIDName,
      TreatmentCD: this.treatmentCD,
      MedicineCD: this.medicineCD,
      SkincareCD: this.skincareCD,
    });

    this.invoiceservice.invoiceExport(model);
  }
}
