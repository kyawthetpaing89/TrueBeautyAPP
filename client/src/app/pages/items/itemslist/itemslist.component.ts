import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ItemService } from '../../../services/item-service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemregisterDialogComponent } from '../../dialog/item/itemregister-dialog/itemregister-dialog.component';
import { GeneralService } from '../../../services/general-service';
import { item_export_model, item_get_model } from '../../../models/item-model';
import { finalize } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { ItempricelogDialogComponent } from '../../dialog/item/itempricelog-dialog/itempricelog-dialog.component';

@Component({
  selector: 'app-itemslist',
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './itemslist.component.html',
  styleUrl: './itemslist.component.scss',
})
export class ItemslistComponent {
  @ViewChild('treatmentScroll') private treatmentScroll!: ElementRef;
  @ViewChild('medicineScroll') private medicineScroll!: ElementRef;
  @ViewChild('skincareScroll') private skincareScroll!: ElementRef;
  @ViewChild('othersScroll') private othersScroll!: ElementRef;

  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  selectedTab: string = 'T';
  search_itemname: string = '';
  search_itemcode: string = '';

  itemLoading: boolean = false;
  itemData: any[] = [];
  treatmentData: any[] = [];
  medicineData: any[] = [];
  skincareData: any[] = [];
  othersData: any[] = [];

  sortAsc: boolean = true;
  sortColumn: string = 'ItemName';

  keepscroller: boolean = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item List');
    this.loadItemList();
  }

  loadItemList() {
    const model = item_get_model({
      ItemCD: this.search_itemcode,
      ItemName: this.search_itemname,
    });

    this.itemLoading = true;

    let currentScrollTop = this.generalservice.getCurrentScroll(
      this.getCurrentScrollElement()!
    );

    this.itemservice
      .getItem(model)
      .pipe(
        finalize(() => {
          this.itemLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.itemData = response.data?.data;
            this.onTabChange(this.selectedTab);
            this.onSort(this.sortColumn, false);

            if (this.keepscroller) {
              this.generalservice.setCurrentScroll(
                this.getCurrentScrollElement(),
                this.renderer,
                currentScrollTop
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

    let key: string = '';
    switch (this.selectedTab) {
      case 'T':
        key = 'treatmentData';
        break;
      case 'M':
        key = 'medicineData';
        break;
      case 'S':
        key = 'skincareData';
        break;
      case 'O':
        key = 'othersData';
        break;
      default:
        return;
    }

    const result = this.generalservice.sortData(
      column,
      (this as any)[key],
      this.sortAsc,
      toggle
    );

    (this as any)[key] = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;

    switch (tab) {
      case 'T':
        this.treatmentData = this.itemData.filter((x) => x.ItemType === 'T');
        break;
      case 'M':
        this.medicineData = this.itemData.filter((x) => x.ItemType === 'M');
        break;
      case 'S':
        this.skincareData = this.itemData.filter((x) => x.ItemType === 'S');
        break;
      case 'O':
        this.othersData = this.itemData.filter((x) => x.ItemType === 'O');
        break;
    }
  }

  clear(): void {
    this.search_itemname = '';
    this.search_itemcode = '';
    this.loadItemList();
  }

  openRegisterDialog(mode: string, row: any): void {
    const param = {
      Mode: mode,
      ItemCD: row.ItemCD?.toString() || '',
      ItemType: this.selectedTab,
    };

    const dialogRef = this.dialog.open(ItemregisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (mode === 'New') {
          this.keepscroller = false;
          this.sortColumn = 'CreatedDate';
          this.sortAsc = false;
          this.loadItemList();
        } else {
          this.keepscroller = true;
          this.loadItemList();
        }
      }
    });
  }

  openPriceLogDialog(row: any): void {
    const param = {
      ItemCD: row.ItemCD?.toString() || '',
    };

    const dialogRef = this.dialog.open(ItempricelogDialogComponent, {
      data: param,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
      }
    });
  }

  private getCurrentScrollElement(): ElementRef | null {
    switch (this.selectedTab) {
      case 'T':
        return this.treatmentScroll;
      case 'M':
        return this.medicineScroll;
      case 'S':
        return this.skincareScroll;
      case 'O':
        return this.othersScroll;
      default:
        return null;
    }
  }

  exportItem() {
    const model = item_export_model({
      ItemCD: this.search_itemcode,
      ItemName: this.search_itemname,
    });

    this.itemservice.itemExport(model);
  }
}
