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
import { DialogService } from '../../../../services/dialog-service';
import { GeneralService } from '../../../../services/general-service';
import { Validator } from '../../../../utilities/validator';
import { invoicedetail_process_model } from '../../../../models/invoice-model';
import { InvoiceService } from '../../../../services/invoice-service';
import { finalize, firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-invoicedetail-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatIcon],
  templateUrl: './invoicedetail-dialog.component.html',
  styleUrl: './invoicedetail-dialog.component.scss',
})
export class InvoicedetailDialogComponent {
  dialogservice = inject(DialogService);
  generalservice = inject(GeneralService);
  invoiceservice = inject(InvoiceService);
  private data = inject(MAT_DIALOG_DATA);

  itemCD: string = '';
  _price: number = 0;
  packagequantity: number = 1;
  quantity: number = 1;
  totalquantity: number = 1;
  _totalprice: number = 1;
  _discountpercent: number = 0;

  _discountamount: number = 0;
  _additionaldiscount: number = 0;
  _afterdiscount: number = 0;

  isSubmitting: boolean = false;

  itemData: any[] = this.data.ItemData;
  mode: string = this.data.Mode;
  itemType: string = this.data.ItemType;
  shopID: string = this.data.ShopID;

  title1: string =
    this.mode === 'New' ? 'Add' : this.mode === 'Edit' ? 'Update' : 'Delete';
  title2: string =
    this.itemType === 'T'
      ? 'Treatment'
      : this.itemType === 'M'
        ? 'Medicine'
        : 'Skin Care';

  constructor(
    private dialogRef: MatDialogRef<InvoicedetailDialogComponent>,
    private dialog: MatDialog,
  ) {}

  get price(): string {
    return this._price.toLocaleString();
  }

  set price(value: string) {
    const numeric = parseFloat(value.toString().replace(/,/g, ''));
    this._price = isNaN(numeric) ? 0 : numeric;
  }

  get totalprice(): string {
    return this._totalprice.toLocaleString();
  }

  set totalprice(value: string) {
    const numeric = parseFloat(value.toString().replace(/,/g, ''));
    this._totalprice = isNaN(numeric) ? 0 : numeric;
  }

  set discountpercent(value: number) {
    this._discountpercent = value > 100 ? 100 : value;
    this.discountChange();
  }

  get discountpercent(): number {
    return this._discountpercent;
  }

  set discountamount(value: string) {
    const numeric = parseFloat(value.toString().replace(/,/g, ''));
    this._discountamount = isNaN(numeric) ? 0 : numeric;
  }

  get discountamount(): string {
    return this._discountamount.toLocaleString();
  }

  set additionaldiscount(value: string) {
    const numeric = parseFloat(value.toString().replace(/,/g, ''));
    this._additionaldiscount = isNaN(numeric) ? 0 : numeric;

    this.discountChange();
  }

  get additionaldiscount(): string {
    return this._additionaldiscount.toLocaleString();
  }

  set afterdiscount(value: string) {
    const numeric = parseFloat(value.replace(/,/g, ''));
    this._afterdiscount = isNaN(numeric) ? 0 : numeric;
  }

  get afterdiscount(): string {
    return this._afterdiscount.toLocaleString();
  }

  ngOnInit(): void {
    if (this.mode === 'New') {
      this.itemCD = this.itemData[0].ItemCD;
    } else {
      this.itemCD = this.data.ItemCD;
      this.quantity = this.data.Quantity;
      this.price = this.data.UnitPrice;
      this.discountpercent = this.data.DiscountPercent;
      this.additionaldiscount = this.data.AdditionalDiscount;
    }

    this.onItemChange();
  }

  closeDialog(): void {
    this.dialogRef.close('');
  }

  onItemChange() {
    const item = this.itemData.find((item) => item.ItemCD === this.itemCD);

    this.packagequantity = item.Quantity;
    this._price = item.Price;
    this.calculatedata();
  }

  calculatedata() {
    this.totalquantity = this.packagequantity * this.quantity;
    this._totalprice = this.quantity * this._price;

    this.discountChange();
  }

  discountChange() {
    this._discountamount = Math.round(
      (this._totalprice * this.discountpercent) / 100,
    );
    this._afterdiscount =
      this._totalprice - (this._discountamount + this._additionaldiscount);
  }

  async save() {
    if (!this.saveErrorCheck()) return;

    const confirmed = await this.deleteConfirm();
    if (!confirmed) return;

    this.isSubmitting = true;

    const loginID = this.generalservice.getLoginID();

    const model = invoicedetail_process_model({
      InvoiceNo: this.data.InvoiceNo,
      ShopID: this.shopID,
      InvoiceDate: this.data.InvoiceDate,
      ClientID: this.data.ClientID,
      Notes: this.data.Notes || '',
      Discount: this.data.Discount,
      SEQ: this.data.SEQ?.toString() ?? '',
      ItemCD: this.itemCD,
      UnitPrice: this.price,
      PackageQuantity: this.packagequantity.toString(),
      Quantity: this.quantity.toString(),
      TotalQuantity: this.totalquantity.toString(),
      TotalPrice: this.totalprice.toString(),
      DiscountPercent: this.discountpercent.toString(),
      DiscountAmount: this.discountamount.toString(),
      AdditionalDiscount: this.additionaldiscount.toString(),
      AfterDiscount: this.afterdiscount.toString(),
      Mode: this.data.Mode,
      LoginID: loginID,
    });

    this.invoiceservice
      .invoiceDetailProcess(model)
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
            this.dialogRef.close({
              success: true,
              InvoiceNo: response.data?.data?.[0]?.InvoiceNo,
            });
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
    if (Validator.isEmpty(this.quantity.toString())) {
      const htmlContent = `
                  <p>
                    Quantity is required.
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
        htmlContent: `<p>Are you sure you want to delete this item?</p>`,
      },
      disableClose: true,
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    return result === true;
  }
}
