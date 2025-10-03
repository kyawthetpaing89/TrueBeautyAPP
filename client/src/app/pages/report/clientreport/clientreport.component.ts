import { Component, inject } from '@angular/core';
import { GeneralService } from '../../../services/general-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client-service';

@Component({
  selector: 'app-clientreport',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientreport.component.html',
  styleUrl: './clientreport.component.scss',
})
export class ClientreportComponent {
  private clientservice = inject(ClientService);
  private generalservice = inject(GeneralService);

  years: number[] = [];
  selectedyear: number = 0;
  selectedmonth: number = 0;
  reportType: string = '1';

  clientReportData: any[] = [];
  clientLoading: boolean = false;

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
    this.generalservice.setPageTitle('Client Report');
    for (let year = new Date().getFullYear(); year >= 2024; year--) {
      this.years.push(year);
    }

    this.loadReport();
  }

  loadReport() {
    this.clientLoading = true;
    const model = {
      YYYY: this.selectedyear.toString(),
      MM: this.selectedmonth.toString(),
      ReportType: this.reportType,
    };

    debugger;
    this.clientservice.getClientReport(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.clientReportData = response.data?.data;
        } else {
          console.error('Failed to fetch item summary:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching item summary:', error);
      },
      complete: () => {
        this.clientLoading = false;
      },
    });
  }
}
