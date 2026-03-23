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
    type: ChartType.LineChart,
    columns: ['Month', 'Total Sales', 'Total Income'],
    data: [['', 0, 0]],
    options: {
      title: `Monthly Sales (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth line
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      colors: ['#42A5F5', '#66BB6A'], // blue + green
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      hAxis: {
        title: 'Month',
        slantedText: true,
        slantedTextAngle: 30,
        textStyle: { color: '#444' },
        titleTextStyle: { italic: false, color: '#333' },
      },
      vAxis: {
        title: 'Amount',
        textStyle: { color: '#555' },
        gridlines: { color: '#e0e0e0' },
        format: 'short', // 500k, 1M
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
      },
    },
  };

  compareMonthlyIncomeChart = {
    type: ChartType.LineChart,
    columns: ['Month', 'Shop 1 Income', 'Shop 2 Income'],
    data: [['', 0, 0]],
    options: {
      title: `Shop 1 vs Shop 2 Income (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth lines
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      colors: ['#1E88E5', '#FBC02D'], // blue + yellow
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      hAxis: {
        title: 'Month',
        slantedText: true,
        slantedTextAngle: 30,
        textStyle: { color: '#444' },
        titleTextStyle: { italic: false, color: '#333' },
      },
      vAxis: {
        title: 'Income',
        gridlines: { color: '#e0e0e0' },
        textStyle: { color: '#555' },
        format: 'short',
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
      },
    },
  };

  compareMonthlySalesChart = {
    type: ChartType.LineChart,
    columns: ['Month', 'Shop 1 Sales', 'Shop 2 Sales'],
    data: [['', 0, 0]],
    options: {
      title: `Shop 1 vs Shop 2 Sales (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth lines
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      colors: ['#1E88E5', '#FBC02D'], // blue + yellow
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      hAxis: {
        title: 'Month',
        slantedText: true,
        slantedTextAngle: 30,
        textStyle: { color: '#444' },
        titleTextStyle: { italic: false, color: '#333' },
      },
      vAxis: {
        title: 'Sales',
        gridlines: { color: '#e0e0e0' },
        textStyle: { color: '#555' },
        format: 'short',
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
      },
    },
  };

  clientdatachart = {
    type: ChartType.LineChart,
    columns: ['Month', 'Client', 'Treatment', 'Medicine', 'Skincare'],
    data: [['', 0, 0, 0, 0]],
    options: {
      title: `Client Visits / Treatment Sales Count (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth lines
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      colors: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      hAxis: {
        title: 'Month',
        textStyle: { fontSize: 12 },
      },
      vAxis: {
        title: 'Count',
        gridlines: { color: '#e0e0e0' },
        textStyle: { color: '#555' },
        format: 'short',
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
      },
    },
  };

  s1clientdatachart = {
    type: ChartType.LineChart,
    columns: ['Month', 'Client', 'Treatment', 'Medicine', 'Skincare'],
    data: [['', 0, 0, 0, 0]],
    options: {
      title: `Client Visits / Treatment Sales Count (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth lines
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      colors: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      hAxis: {
        title: 'Month',
        textStyle: { fontSize: 12 },
      },
      vAxis: {
        title: 'Count',
        gridlines: { color: '#e0e0e0' },
        textStyle: { color: '#555' },
        format: 'short',
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
      },
    },
  };

  s2clientdatachart = {
    type: ChartType.LineChart,
    columns: ['Month', 'Client', 'Treatment', 'Medicine', 'Skincare'],
    data: [['', 0, 0, 0, 0]],
    options: {
      title: `Client Visits / Treatment Sales Count (${this.selectedyear})`,
      height: 300,
      curveType: 'function', // smooth lines
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 12, bold: true },
      },
      backgroundColor: '#fafafa',
      chartArea: { left: 50, top: 40, width: '85%', height: '70%' },
      colors: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722'],
      pointSize: 6,
      lineWidth: 3,
      series: {
        0: { pointShape: 'circle' },
        1: { pointShape: 'triangle' },
      },
      hAxis: {
        title: 'Month',
        textStyle: { fontSize: 12 },
      },
      vAxis: {
        title: 'Count',
        gridlines: { color: '#e0e0e0' },
        textStyle: { color: '#555' },
        format: 'short',
        viewWindow: { min: 0 },
      },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
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

          // Chart 2: Shop 1 vs Shop 2 Income
          const allMonths = [...new Set(sales.map((x: any) => x.Month))];
          const compareIncomeData = allMonths.map((month) => {
            const s1 = sales.find(
              (x: any) => x.Month === month && x.ShopID === '001',
            );
            const s2 = sales.find(
              (x: any) => x.Month === month && x.ShopID === '002',
            );
            return [month, s1?.TotalIncome || 0, s2?.TotalIncome || 0];
          });

          this.compareMonthlyIncomeChart.data = compareIncomeData;

          const compareSalesData = allMonths.map((month) => {
            const s1 = sales.find(
              (x: any) => x.Month === month && x.ShopID === '001',
            );
            const s2 = sales.find(
              (x: any) => x.Month === month && x.ShopID === '002',
            );
            return [month, s1?.TotalSales || 0, s2?.TotalSales || 0];
          });

          this.compareMonthlySalesChart.data = compareSalesData;
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
          // 1. Filter sales to include ONLY the shops you want to sum (001 and 002)
          const combinedSales = sales.filter(
            (s: any) => s.ShopID === '001' || s.ShopID === '002',
          );

          // 2. Use a Map to aggregate data by Month
          const monthlyAggregations = new Map<string, any>();

          combinedSales.forEach((sale: any) => {
            const month = sale.Month;

            // Initialize the monthly entry if it doesn't exist
            if (!monthlyAggregations.has(month)) {
              monthlyAggregations.set(month, {
                Month: month,
                TotalClient: 0,
                TotalTreatment: 0,
                TotalMedicine: 0,
                TotalSkincare: 0,
              });
            }

            // Get the current aggregated object for the month
            const aggregated = monthlyAggregations.get(month);

            // Sum the values
            aggregated.TotalClient += sale.TotalClient;
            aggregated.TotalTreatment += sale.TotalTreatment;
            aggregated.TotalMedicine += sale.TotalMedicine;
            aggregated.TotalSkincare += sale.TotalSkincare;
          });

          // 3. Map the aggregated data to the final chart format
          this.clientdatachart.data = Array.from(
            monthlyAggregations.values(),
          ).map((monthlyData: any) => [
            monthlyData.Month,
            monthlyData.TotalClient,
            monthlyData.TotalTreatment,
            monthlyData.TotalMedicine,
            monthlyData.TotalSkincare,
          ]);

          // ✅ Shop 1
          const shop1Sales = sales.filter((s: any) => s.ShopID === '001');
          this.s1clientdatachart.data = shop1Sales.map((sale: any) => [
            sale.Month,
            sale.TotalClient,
            sale.TotalTreatment,
            sale.TotalMedicine,
            sale.TotalSkincare,
          ]);

          // ✅ Shop 2
          const shop2Sales = sales.filter((s: any) => s.ShopID === '002');
          this.s2clientdatachart.data = shop2Sales.map((sale: any) => [
            sale.Month,
            sale.TotalClient,
            sale.TotalTreatment,
            sale.TotalMedicine,
            sale.TotalSkincare,
          ]);
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
            (sale: any) => sale.ItemType === 'T',
          );
          if (Array.isArray(treatmentsales)) {
            this.topsellingtreatmentchart.data = treatmentsales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ],
            );
          }

          const medicinesales = sales.filter(
            (sale: any) => sale.ItemType === 'M',
          );
          if (Array.isArray(medicinesales)) {
            this.topsellingmedicinechart.data = medicinesales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ],
            );
          }

          const skincaresales = sales.filter(
            (sale: any) => sale.ItemType === 'S',
          );
          if (Array.isArray(skincaresales)) {
            this.topsellingskincarechart.data = skincaresales.map(
              (sale: any) => [
                sale.ItemCD,
                sale.ItemName,
                sale.TotalQty,
                sale.TotalAmount,
              ],
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
      ]),
    );
    window.open(url, '_blank');
  }
}
