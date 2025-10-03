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
import { ClientregisterDialogComponent } from '../../dialog/client/clientregister-dialog/clientregister-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { client_get_model } from '../../../models/client-model';
import { MatIcon } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { GeneralService } from '../../../services/general-service';

@Component({
  selector: 'app-clientlist',
  imports: [CommonModule, FormsModule, RouterModule, MatIcon],
  templateUrl: './clientlist.component.html',
  styleUrl: './clientlist.component.scss',
})
export class ClientlistComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  search_clientID: string = '';
  search_clientName: string = '';
  search_gender: string = '';
  search_phoneNo: string = '';

  clientDataLoading: boolean = false;
  clientData: any[] = [];

  keepscroller: boolean = false;

  sortAsc: boolean = false;
  sortColumn: string = 'CreatedDate';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Client List');
    this.loadClientList();
  }

  loadClientList() {
    this.clientDataLoading = true;
    const model = client_get_model({
      ClientID: this.search_clientID,
      Name: this.search_clientName,
      Gender: this.search_gender,
      PhoneNo: this.search_phoneNo,
    });

    let currentScrollTop = this.generalservice.getCurrentScroll(
      this.scrollContainer
    );

    this.clientservice
      .getClient(model)
      .pipe(
        finalize(() => {
          this.clientDataLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.clientData = response.data?.data;

            this.onSort(this.sortColumn, false);

            if (this.keepscroller) {
              this.generalservice.setCurrentScroll(
                this.scrollContainer,
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
    const result = this.generalservice.sortData(
      column,
      this.clientData,
      this.sortAsc,
      toggle
    );
    this.clientData = result.sortedData;
    this.sortAsc = result.sortAsc;
  }

  search() {
    this.keepscroller = false;
    this.loadClientList();
  }

  clearsearch() {
    this.search_clientID = '';
    this.search_clientName = '';
    this.search_gender = '';
    this.search_phoneNo = '';
    this.keepscroller = false;
    this.loadClientList();
  }

  openRegisterDialog(mode: string, row: any): void {
    const param = {
      Mode: mode,
      ClientID: row.ClientID?.toString() || '',
    };

    const dialogRef = this.dialog.open(ClientregisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (mode === 'New') {
          this.keepscroller = false;
          this.sortColumn = 'CreatedDate';
          this.sortAsc = false;
          this.loadClientList();
        } else {
          this.keepscroller = true;
          this.loadClientList();
        }
      }
    });
  }
}
