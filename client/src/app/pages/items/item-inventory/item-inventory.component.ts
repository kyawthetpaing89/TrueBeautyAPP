import { Component, inject } from '@angular/core';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { item_getinventory_model } from '../../../models/item-model';

@Component({
  selector: 'app-item-inventory',
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './item-inventory.component.html',
  styleUrl: './item-inventory.component.scss',
})
export class ItemInventoryComponent {
  private itemservice = inject(ItemService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  selectedTab: string = 'M';
  search_itemname: string = '';
  search_itemcode: string = '';

  itemLoading: boolean = false;
  itemData: any[] = [];

  medicineData: any[] = [];
  skincareData: any[] = [];
  othersData: any[] = [];

  sortAsc: boolean = true;
  sortColumn: string = 'ItemName';

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Inventory');
    this.loadItemList();
  }

  clear(): void {
    this.search_itemname = '';
    this.search_itemcode = '';
    this.loadItemList();
  }

  loadItemList() {
    const model = item_getinventory_model({
      ItemCD: this.search_itemcode,
      ItemName: this.search_itemname,
      ItemType: 'M,S,O',
    });

    this.itemLoading = true;

    this.itemservice
      .getItemInventory(model)
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

    this.onSort(this.sortColumn, false);
  }
}
