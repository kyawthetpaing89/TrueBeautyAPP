import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
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
import { ClientmembershipDialogComponent } from '../../dialog/client/clientmembership-dialog/clientmembership-dialog.component';
import { MemberCardService } from '../../../services/membercard-service';

@Component({
  selector: 'app-clientlist',
  imports: [CommonModule, FormsModule, RouterModule, MatIcon],
  templateUrl: './clientlist.component.html',
  styleUrl: './clientlist.component.scss',
})
export class ClientlistComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private clientservice = inject(ClientService);
  private membercardservice = inject(MemberCardService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  search_clientID: string = '';
  search_clientName: string = '';
  search_gender: string = '';
  search_phoneNo: string = '';
  search_shop: string = '';
  search_memberType: string = '';

  clientDataLoading: boolean = false;
  clientData: any[] = [];

  memberCardData: any[] = [];

  shopData: any[] = [];

  keepscroller: boolean = false;

  currentPage: number = 1;
  pageSize: number = 30;
  totalCount: number = 0;
  sortAsc: boolean = false;
  sortColumn: string = 'CreatedDate';

  gotoPageNumber: number = 1;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Client List');
    this.loadClientList();
    this.loadMemberCard();
  }

  loadMemberCard() {
    this.membercardservice.getMemberCard().subscribe({
      next: (response) => {
        if (response.status) {
          this.memberCardData = response.data?.data;
        } else {
          console.error('Failed to fetch member card data:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching member card data:', error);
      },
    });
  }

  loadClientList() {
    this.clientDataLoading = true;
    const model = client_get_model({
      ClientID: this.search_clientID,
      Name: this.search_clientName,
      Gender: this.search_gender,
      MemberType: this.search_memberType,
      ShopID: this.search_shop,
      PhoneNo: this.search_phoneNo,
      PageNo: this.currentPage,
      PageSize: this.pageSize,
      SortColumn: this.sortColumn,
      SortAsc: this.sortAsc,
    });

    let currentScrollTop = this.generalservice.getCurrentScroll(
      this.scrollContainer,
    );

    this.clientservice
      .getClient(model)
      .pipe(
        finalize(() => {
          this.clientDataLoading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.clientData = response.data?.data;
            this.totalCount = this.clientData[0].TotalCount || 0;

            if (this.keepscroller) {
              this.generalservice.setCurrentScroll(
                this.scrollContainer,
                this.renderer,
                currentScrollTop,
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

  nextPage() {
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadClientList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClientList();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClientList();
    }
  }

  jumpToPage() {
    const page = this.gotoPageNumber;
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadClientList();
    } else {
      // optional: reset input or show error
      this.gotoPageNumber = this.currentPage;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pageIndexes(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(
      this.currentPage - Math.floor(maxPagesToShow / 2),
      1,
    );
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }

    this.currentPage = 1;
    this.gotoPageNumber = 1;
    this.loadClientList();
  }

  search() {
    this.keepscroller = false;
    this.currentPage = 1;
    this.gotoPageNumber = 1;
    this.loadClientList();
  }

  clearsearch() {
    this.currentPage = 1;
    this.gotoPageNumber = 1;
    this.search_clientID = '';
    this.search_clientName = '';
    this.search_gender = '';
    this.search_memberType = '';
    this.search_phoneNo = '';
    this.keepscroller = false;
    this.loadClientList();
  }

  openRegisterDialog(mode: string, row: any): void {
    this.cdr.detach();
    const param = {
      Mode: mode,
      ClientID: row.ClientID?.toString() || '',
    };

    const dialogRef = this.dialog.open(ClientregisterDialogComponent, {
      data: param,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cdr.reattach();
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

  // openMembershipDialog(row: any): void {
  //   this.cdr.detach();
  //   const param = {
  //     ClientID: row.ClientID?.toString() || '',
  //     ClientName: row.Name?.toString() || '',
  //     MemberCards: this.memberCardData,
  //   };

  //   const dialogRef = this.dialog.open(ClientmembershipDialogComponent, {
  //     data: param,
  //     width: '80%',
  //     maxWidth: '95vw',
  //     maxHeight: '90%',
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.cdr.reattach();
  //     if (result === true) {
  //       this.keepscroller = false;
  //       this.loadClientList();
  //     }
  //   });
  // }
}
