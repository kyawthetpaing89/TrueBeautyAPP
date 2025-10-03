import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client-service';
import { MatDialog } from '@angular/material/dialog';
import { ClienttreatmenthistoryDialogComponent } from '../../dialog/client/clienttreatmenthistory-dialog/clienttreatmenthistory-dialog.component';
import { ClienttreatmentcheckinDialogComponent } from '../../dialog/client/clienttreatmentcheckin-dialog/clienttreatmentcheckin-dialog.component';
import { finalize } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { GeneralService } from '../../../services/general-service';

@Component({
  standalone: true,
  selector: 'app-treatment-checkin',
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './treatment-checkin.component.html',
  styleUrl: './treatment-checkin.component.scss',
})
export class TreatmentCheckinComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  clientLoading: boolean = false;
  clientData: any[] = [];

  search_invoiceNo: string = '';
  search_clientID: string = '';
  search_clientName: string = '';
  search_phoneNo: string = '';
  search_balance: string = '1';

  sortAsc: boolean = true;
  sortColumn: string = 'InvoiceNo';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Treatment Check-in');
    this.loadTreatmentCheckin();
  }

  loadTreatmentCheckin(keepsorting: boolean = false) {
    this.clientLoading = true;
    const model = {
      InvoiceNo: this.search_invoiceNo,
      ClientID: this.search_clientID,
      ClientName: this.search_clientName,
      PhoneNo: this.search_phoneNo,
      Balance: this.search_balance,
    };

    let currentScrollTop = this.generalservice.getCurrentScroll(
      this.scrollContainer
    );

    this.clientservice
      .getClientTreatmentCheckin(model)
      .pipe(
        finalize(() => {
          this.clientLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.clientData = response.data?.data;
            if (!keepsorting) {
              this.onSort(this.sortColumn);
            }

            this.generalservice.setCurrentScroll(
              this.scrollContainer,
              this.renderer,
              currentScrollTop
            );
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  onSort(column: string) {
    this.sortColumn = column;
    const result = this.generalservice.sortData(
      column,
      this.clientData,
      this.sortAsc
    );
    this.clientData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  clearsearch() {
    this.search_invoiceNo = '';
    this.search_clientID = '';
    this.search_clientName = '';
    this.search_phoneNo = '';
    this.search_balance = '1';

    this.loadTreatmentCheckin();
  }

  openTreatmentHistoryDialog(row: any): void {
    const param = {
      InvoiceNo: row.InvoiceNo?.toString() || '',
      SEQ: row.SEQ?.toString() || '',
    };

    const dialogRef = this.dialog.open(ClienttreatmenthistoryDialogComponent, {
      data: param,
      width: '50%',
      maxWidth: '95vw',
      maxHeight: '70%',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadTreatmentCheckin();
      }
    });
  }

  openTreatmentCheckinDialog(row: any): void {
    const param = {
      InvoiceNo: row.InvoiceNo?.toString() || '',
      ClientID: row.ClientID?.toString() || '',
      SEQ: row.SEQ?.toString() || '',
      ClientName: row.ClientName?.toString() || '',
      ItemName: row.ItemName?.toString() || '',
    };

    const dialogRef = this.dialog.open(ClienttreatmentcheckinDialogComponent, {
      data: param,
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadTreatmentCheckin(true);
      }
    });
  }
}
