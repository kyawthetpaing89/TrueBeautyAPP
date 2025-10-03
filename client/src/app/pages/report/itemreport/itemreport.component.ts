import { Component, inject } from '@angular/core';
import { ItemService } from '../../../services/item-service';
import { GeneralService } from '../../../services/general-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-itemreport',
  imports: [CommonModule, FormsModule],
  templateUrl: './itemreport.component.html',
  styleUrl: './itemreport.component.scss',
})
export class ItemreportComponent {
  private itemservice = inject(ItemService);
  private generalservice = inject(GeneralService);

  years: number[] = [];
  selectedyear: number = 0;
  selectedmonth: number = 0;
  reportType: string = 'T';

  itemData: any[] = [];
  itemLoading: boolean = false;

  months = [
    { value: 0, name: 'All' },
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  ngOnInit(): void {
    this.generalservice.setPageTitle('Item Report');
    for (let year = new Date().getFullYear(); year >= 2024; year--) {
      this.years.push(year);
    }

    this.loadReport();
  }

  loadReport() {
    this.itemLoading = true;
    const model = {
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
      ReportType: this.reportType,
    };

    this.itemservice.getItemTopSelling(model).subscribe({
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
      complete: () => {
        this.itemLoading = false;
      },
    });
  }
}
