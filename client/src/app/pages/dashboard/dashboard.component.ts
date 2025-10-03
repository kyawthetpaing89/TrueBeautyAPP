import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ItemService } from '../../services/item-service';
import { InvoiceService } from '../../services/invoice-service';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client-service';
import { invoice_get_model } from '../../models/invoice-model';
import { GeneralService } from '../../services/general-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, GoogleChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private itemservice = inject(ItemService);
  private invoiceservice = inject(InvoiceService);
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);

  years: number[] = [];
  selectedyear: number = new Date().getFullYear();
  selectedmonth: number = new Date().getMonth() + 1;
  selectedmonthtext: string = '';

  months = [
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

  itemchart = {
    type: ChartType.PieChart,
    columns: ['ItemType', 'Total'],
    data: [] as any[][],
    options: {
      title: 'Item Summary',
      height: 250,
      is3D: true,
      pieHole: 0.4,
      enableInteractivity: true,
    },
  };

  monthlysaleschart = {
    type: ChartType.ColumnChart,
    columns: ['Month', 'Total Sales', 'Total Income'],
    data: [['', 0, 0]],
    options: {
      title: `Monthly Sales (${this.selectedyear})`,
      height: 250,
      enableInteractivity: true,
      bar: {
        groupWidth: '70%',
      },
      colors: ['#42A5F5', '#66BB6A'],
      legend: { position: 'top' },
      hAxis: {
        title: 'Month',
      },
      vAxis: {
        title: 'Amount',
      },
    },
  };

  clientdatachart = {
    type: ChartType.ColumnChart,
    columns: ['Month', 'Client', 'Treatment', 'Medicine', 'Skincare'],
    data: [['', 0, 0, 0, 0]],
    options: {
      title: `Client Treatment Data (${this.selectedyear})`,
      height: 250,
      enableInteractivity: true,
      bar: {
        groupWidth: '80%',
      },
      colors: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
      legend: { position: 'top' },
      hAxis: {
        title: 'Month',
      },
      vAxis: {
        title: 'Amount',
      },
    },
  };

  topsellingtreatmentchart = {
    type: ChartType.Table,
    columns: ['Item Code', 'Item Name', 'Total Quantity', 'Total Amount'],
    data: [['', '', 0, 0]],
    options: {
      title: `Top Selling Treatments (${this.selectedyear} - ${this.selectedmonthtext})`,
      width: '100%',
      enableInteractivity: true,
      allowHtml: true,
    },
  };

  topsellingmedicinechart = {
    type: ChartType.Table,
    columns: ['Item Code', 'Item Name', 'Total Quantity', 'Total Amount'],
    data: [['', '', 0, 0]],
    options: {
      title: `Top Selling Medicines (${this.selectedyear} - ${this.selectedmonthtext})`,
      width: '100%',
      enableInteractivity: true,
      allowHtml: true,
    },
  };

  topsellingskincarechart = {
    type: ChartType.Table,
    columns: ['Item Code', 'Item Name', 'Total Quantity', 'Total Amount'],
    data: [['', '', 0, 0]],
    options: {
      title: `Top Selling Skincares (${this.selectedyear} - ${this.selectedmonthtext})`,
      width: '100%',
      enableInteractivity: true,
      allowHtml: true,
    },
  };

  topvisitors = {
    type: ChartType.Table,
    columns: ['ClientID', 'Name', 'Phone No', 'Total Frequent'],
    data: [['', '', 0, 0]],
    options: {
      title: `Top Visitors`,
      width: '100%',
      enableInteractivity: true,
      allowHtml: true,
    },
  };

  topspending = {
    type: ChartType.Table,
    columns: ['ClientID', 'Name', 'Phone No', 'Total Spending'],
    data: [['', '', 0, 0]],
    options: {
      title: `Top Spending`,
      width: '100%',
      enableInteractivity: true,
      allowHtml: true,
    },
  };

  invoiceData: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.generalservice.setPageTitle('Dashboard');

    this.selectedyear = new Date().getFullYear();
    for (let year = this.selectedyear; year >= 2024; year--) {
      this.years.push(year);
    }

    this.getItemSummary();
    this.loadCharts();
    this.loadInvoice();
  }

  loadInvoice() {
    const model = invoice_get_model({
      DeleteFlg: '3',
    });

    this.invoiceservice.getInvoice(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.invoiceData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
    });
  }

  getItemSummary(): void {
    this.itemservice.getItemSummary().subscribe({
      next: (response) => {
        if (response.status) {
          const items = response.data?.data;
          if (Array.isArray(items)) {
            this.itemchart.data = items.map((item: any) => [
              item.ItemType,
              item.Total,
            ]);
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

  loadCharts(): void {
    this.getselectedmonthtext();
    this.loadMonthlySales();
    this.loadClientData();
    this.loadTopSellingItems();
    this.loadTopClients();
  }

  loadMonthlySales(): void {
    const model = {
      YYYY: this.selectedyear.toString(),
    };

    this.invoiceservice.getMonthlySales(model).subscribe({
      next: (response) => {
        if (response.status) {
          const sales = response.data?.data; // access nested data
          if (Array.isArray(sales)) {
            this.monthlysaleschart.data = sales.map((sale: any) => [
              sale.Month,
              sale.TotalSales,
              sale.TotalIncome,
            ]);
          }
        } else {
          console.error('Failed to fetch monthly sales:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching monthly sales:', error);
      },
    });
  }

  loadClientData(): void {
    const model = {
      YYYY: this.selectedyear.toString(),
    };

    this.invoiceservice.getClientData(model).subscribe({
      next: (response) => {
        if (response.status) {
          const sales = response.data?.data;
          if (Array.isArray(sales)) {
            this.clientdatachart.data = sales.map((sale: any) => [
              sale.Month,
              sale.TotalClient,
              sale.TotalTreatment,
              sale.TotalMedicine,
              sale.TotalSkincare,
            ]);
          }
        } else {
          console.error('Failed to fetch monthly sales:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching monthly sales:', error);
      },
    });
  }

  loadTopSellingItems(): void {
    const model = {
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
    };

    this.invoiceservice.getTopSellingItems(model).subscribe({
      next: (response) => {
        if (response.status) {
          const sales = response.data?.data;

          const treatmentsales = sales.filter(
            (sale: any) => sale.ItemType === 'T'
          );
          if (Array.isArray(treatmentsales)) {
            this.topsellingtreatmentchart.data = treatmentsales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ]
            );
          }

          const medicinesales = sales.filter(
            (sale: any) => sale.ItemType === 'M'
          );
          if (Array.isArray(medicinesales)) {
            this.topsellingmedicinechart.data = medicinesales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ]
            );
          }

          const skincaresales = sales.filter(
            (sale: any) => sale.ItemType === 'S'
          );
          if (Array.isArray(skincaresales)) {
            this.topsellingskincarechart.data = skincaresales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ]
            );
          }
        } else {
          console.error('Failed to fetch monthly sales:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching monthly sales:', error);
      },
    });
  }

  loadTopClients(): void {
    const model = {};

    this.clientservice.getClientDashboardInfo().subscribe({
      next: (response) => {
        if (response.status) {
          const data = response.data?.data;
          const topvisitors = data.filter((sale: any) => sale.Type === 1);
          if (Array.isArray(topvisitors)) {
            this.topvisitors.data = topvisitors.map((sale: any) => [
              sale.ClientID,
              sale.Name,
              sale.PhoneNo,
              sale.Total,
            ]);
          }

          const topspending = data.filter((sale: any) => sale.Type === 2);
          if (Array.isArray(topspending)) {
            this.topspending.data = topspending.map((sale: any) => [
              sale.ClientID,
              sale.Name,
              sale.PhoneNo,
              sale.Total,
            ]);
          }
        } else {
          console.error('Failed to fetch monthly sales:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching monthly sales:', error);
      },
    });
  }

  getselectedmonthtext(): void {
    this.selectedmonthtext =
      this.months.find((m) => m.value === this.selectedmonth)?.name || '';
  }

  onMonthChange(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.selectedmonth = value;
    this.getselectedmonthtext();
    this.loadCharts();
  }

  gotoInvoiceDeleteApproval(invoiceNo: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/invoice/invoice-register',
        invoiceNo,
        'deleteapproval',
      ])
    );
    window.open(url, '_blank');
  }
}
