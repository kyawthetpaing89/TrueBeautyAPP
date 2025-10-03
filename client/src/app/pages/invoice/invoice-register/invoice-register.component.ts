import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice-service';
import { GeneralService } from '../../../services/general-service';
import { DialogService } from '../../../services/dialog-service';
import { ClientsearchDialogComponent } from '../../dialog/client/clientsearch-dialog/clientsearch-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import flatpickr from 'flatpickr';
import { item_get_model } from '../../../models/item-model';
import { ItemService } from '../../../services/item-service';
import { ClientService } from '../../../services/client-service';
import { InvoicedetailDialogComponent } from '../../dialog/invoice/invoicedetail-dialog/invoicedetail-dialog.component';
import { doctorinstruction_getlast_model } from '../../../models/doctorinstruction-model';
import { DoctorInstructionService } from '../../../services/doctorinstruction-service';
import {
  invoice_copyconfirm_model,
  invoice_get_model,
  invoice_process_model,
  invoicedetail_get_model,
} from '../../../models/invoice-model';
import { InvoicepaymentDialogComponent } from '../../dialog/invoice/invoicepayment-dialog/invoicepayment-dialog.component';
import { Validator } from '../../../utilities/validator';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-invoice-register',
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './invoice-register.component.html',
  styleUrl: './invoice-register.component.scss',
})
export class InvoiceRegisterComponent {
  @ViewChild('txtInvoiceDate') datePickerRef!: ElementRef;
  private flatpickrInstance: any;

  private invoiceservice = inject(InvoiceService);
  private itemservice = inject(ItemService);
  private clientservice = inject(ClientService);
  private doctorinstructionservice = inject(DoctorInstructionService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);
  private dialog = inject(MatDialog);

  copyinvoiceNo: string = '';

  invoiceNo: string = '';
  invoiceDate: string = this.generalservice.getFormattedDateTime();
  clientID: string = '';
  clientName: string = '';

  totalAmount: string = '';
  totalPayment: string = '';
  discount: string = '';
  outstandingBalance: string = '';
  notes: string = '';

  doctorName: string = '';
  instructionDate: string = '';
  instructions: string = '';
  instructionNotes: string = '';

  mode: string = '';
  itemData: any[] = [];

  invoiceDetailLoading: boolean = false;
  invoiceDetailData: any[] = [];

  paymentDetailLoading: boolean = false;
  paymentDetailData: any[] = [];

  isSubmitting: boolean = false;

  isalllow = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngAfterViewInit(): void {
    this.flatpickrInstance = flatpickr(this.datePickerRef.nativeElement, {
      enableTime: true, // Enables time selection
      time_24hr: true, // Optional: 24-hour format (vs AM/PM)
      enableSeconds: false, // Enables seconds
      dateFormat: 'd M Y H:i', // Format with time (H=hour, i=minute, S=second)
      defaultDate: this.generalservice.getFormattedDateTime(),
      allowInput: true,
    });
  }

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path ?? '';
    if (path.endsWith('/copy')) {
      this.mode = 'Copy';
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path.endsWith('/edit')) {
      this.mode = 'Edit';
      if (this.generalservice.getUserRole() !== 'admin') {
        this.router.navigate(['/error404']);
      }
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path.endsWith('/detail')) {
      this.mode = 'Detail';
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path.endsWith('/delete')) {
      this.mode = 'Delete';
      if (this.generalservice.getUserRole() !== 'admin') {
        this.router.navigate(['/error404']);
      }
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path.endsWith('/deleterequest')) {
      this.mode = 'DeleteRequest';
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path.endsWith('/deleteapproval')) {
      this.mode = 'DeleteApproval';
      this.invoiceNo = this.route.snapshot.paramMap.get('invoiceNo') || '';
      this.loadDetail();
    } else if (path === 'invoice-register') {
      this.mode = 'New';
    } else {
      // Invalid path mode — redirect to error
      this.router.navigate(['/error404']);
    }

    this.isalllow =
      this.mode == 'Copy' ||
      (this.generalservice.getUserRole() === 'admin' &&
        this.mode !== 'Delete' &&
        this.mode !== 'Detail' &&
        this.mode !== 'DeleteApproval');

    this.loadItem();
  }

  loadDetail() {
    this.loadInvoiceInfo();
    this.loadInvoiceDetail();
    this.loadDoctorLastInstruction();
    this.loadPaymentDetail();
  }

  loadInvoiceInfo() {
    const model = invoice_get_model({
      InvoiceNo: this.invoiceNo,
      DeleteFlg:
        this.mode === 'Copy' ? '2' : this.mode === 'DeleteApproval' ? '3' : '0',
    });

    this.invoiceservice.getInvoice(model).subscribe({
      next: (response) => {
        if (response.status) {
          const data = response.data?.data;
          if (data.length > 0) {
            this.clientID = data[0].ClientID;
            this.clientName = data[0].ClientName;
            this.invoiceDate = data[0].FormattedInvoiceDate;

            this.flatpickrInstance.setDate(this.invoiceDate, true);

            this.totalAmount = data[0].FTotalPrice;
            this.totalPayment = data[0].FTotalPayment;
            this.discount = data[0].FDiscount;
            this.outstandingBalance = data[0].FOutstandingBalance;
            this.notes = data[0].Notes;

            this.copyConfirm();
          } else {
            this.router.navigate(['/error404']);
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

  copyConfirm() {
    if (this.mode !== 'Copy') return;
    const model = invoice_copyconfirm_model({
      InvoiceNo: this.invoiceNo,
    });

    this.invoiceservice.invoiceCopyConfirm(model).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadDoctorLastInstruction() {
    const model = doctorinstruction_getlast_model({
      ClientID: this.clientID,
      InvoiceDate: this.invoiceDate,
    });

    this.doctorinstructionservice.getLastInstruction(model).subscribe({
      next: (response) => {
        if (response.status) {
          const data = response.data?.data;
          if (data.length > 0) {
            this.doctorName = data[0].DoctorName;
            this.instructionDate = data[0].FInstructionDate;
            this.instructions = data[0].ItemList;
            this.instructionNotes = data[0].Notes;
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

  loadItem() {
    const model = item_get_model({});

    this.itemservice.getItem(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.itemData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  loadInvoiceDetail() {
    this.invoiceDetailLoading = true;
    const model = invoicedetail_get_model({
      InvoiceNo: this.invoiceNo,
    });

    this.invoiceservice
      .getInvoiceDetail(model)
      .pipe(
        finalize(() => {
          this.invoiceDetailLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.invoiceDetailData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  loadPaymentDetail() {
    this.paymentDetailLoading = true;
    const model = invoicedetail_get_model({
      InvoiceNo: this.invoiceNo,
    });

    this.clientservice.getPaymentDetail(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.paymentDetailLoading = false;
          this.paymentDetailData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  getItemTotalAmount(): string {
    return this.invoiceDetailData
      .reduce((sum, item) => sum + Number(item.AfterDiscount || 0), 0)
      .toLocaleString();
  }

  getPaymentTotalAmount(): string {
    return this.paymentDetailData
      .reduce((sum, item) => sum + Number(item.Amount || 0), 0)
      .toLocaleString();
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
        this.loadDoctorLastInstruction();
      }
    });
  }

  async openItemAddDialog(
    itemType: string,
    mode: string,
    row: any
  ): Promise<void> {
    const isValid = await this.addItemErrorcheck();
    if (!isValid) return;

    const param = {
      InvoiceNo: this.invoiceNo,
      InvoiceDate: this.invoiceDate,
      ClientID: this.clientID,
      Discount: this.discount,
      Notes: this.notes,
      SEQ: row?.SEQ || '',
      ItemCD: row?.ItemCD || '',
      Quantity: row?.Quantity || '',
      UnitPrice: row?.UnitPrice || '',
      DiscountPercent: row?.DiscountPercent ?? 0,
      AdditionalDiscount: row?.AdditionalDiscount ?? 0,
      ItemType: itemType,
      ItemData: this.itemData.filter((item) => item.ItemType === itemType),
      Mode: mode,
    };

    const dialogRef = this.dialog.open(InvoicedetailDialogComponent, {
      data: param,
      height: '90%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        if (this.mode === 'New') {
          this.invoiceNo = result.InvoiceNo;
        }

        this.loadInvoiceInfo();
        this.loadInvoiceDetail();
      }
    });
  }

  async addItemErrorcheck(): Promise<boolean> {
    if (!this.clientID) {
      const htmlContent = `<p>ClientID is required.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (!this.invoiceDate) {
      const htmlContent = `<p>invoiceDate is required.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    const exists = await this.generalservice.checkClientExists(this.clientID);

    if (!exists) {
      const htmlContent = `<p>Client ID is not registered.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  addPayment(mode: string, row: any): void {
    if (Validator.isEmpty(this.invoiceNo)) {
      const htmlContent = `
                  <p>
                    InvoiceNo is required.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return;
    }

    if (Validator.isEmpty(this.clientID)) {
      const htmlContent = `
                  <p>
                    ClientID is required.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return;
    }

    if (mode === 'New' && this.invoiceDetailData.length <= 0) {
      const htmlContent = `<p>Please add items first.</p>`;
      this.dialogservice.showMessage('Error', htmlContent);
      return;
    }

    this.openPaymentRegisterDialog(mode, row);
  }

  openPaymentRegisterDialog(mode: string, row: any): void {
    const param = {
      InvoiceNo: this.invoiceNo,
      ClientID: this.clientID,
      TransactionID: row?.TransactionID || '',
      PaymentDate: row?.FPaymentDate || '',
      Amount: row?.FAmount || '',
      Mode: mode,
    };

    const dialogRef = this.dialog.open(InvoicepaymentDialogComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPaymentDetail();
        this.loadInvoiceInfo();
      }
    });
  }

  async save() {
    if (!this.saveErrorCheck()) return;

    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const loginID = this.generalservice.getLoginID();

    const model = invoice_process_model({
      InvoiceNo: this.invoiceNo,
      InvoiceDate: this.invoiceDate,
      ClientID: this.clientID,
      Notes: this.notes || '',
      Discount: this.discount,
      Mode: this.mode,
      LoginID: loginID,
    });

    this.invoiceservice
      .invoiceProcess(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.dialogservice.showMessage(
              response.data?.data?.[0]?.MessageType === 'error'
                ? 'Error'
                : 'Success',
              response.data?.data?.[0]?.MessageText
            );
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

  saveErrorCheck() {
    if (Validator.isEmpty(this.clientID.toString())) {
      const htmlContent = `
                  <p>
                    ClientID is required.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.invoiceDate.toString())) {
      const htmlContent = `
                  <p>
                    Invoice Date is required.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }

  async deleteConfirm(): Promise<boolean> {
    if (
      this.mode !== 'Delete' &&
      this.mode !== 'DeleteRequest' &&
      this.mode !== 'DeleteApproval'
    )
      return true;

    if (
      (this.mode === 'DeleteRequest' || this.mode === 'DeleteApproval') &&
      Validator.isEmpty(this.notes)
    ) {
      const htmlContent = `
                  <p>
                    Please provide a reason(AddNotes) for the request.
                  </p>
                `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    let htmlContent = '';
    if (this.mode === 'Delete' || this.mode === 'DeleteApproval') {
      htmlContent = `<p>Are you sure you want to delete this invoice?</p>`;
    } else if (this.mode === 'DeleteRequest') {
      htmlContent = `<p>Are you sure you want to request deletion of this invoice? Please add a note to justify the request.</p>`;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        htmlContent: htmlContent,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }

  gotoprint() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/invoice/invoice-print', this.invoiceNo])
    );
    window.open(url, '_blank');
  }
}
