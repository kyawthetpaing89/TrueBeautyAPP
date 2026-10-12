import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MembershipService } from '../../../services/membership-service';
import { GeneralService } from '../../../services/general-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validator } from '../../../utilities/validator';
import { membership_print_model } from '../../../models/membership-model';

@Component({
  selector: 'app-membership-transaction-print',
  imports: [CommonModule, FormsModule],
  templateUrl: './membership-transaction-print.component.html',
  styleUrl: './membership-transaction-print.component.scss',
})
export class MembershipTransactionPrintComponent {
  membershipID: string = '';
  clientName: string = '';
  joinedDate: string = '';
  expiredDate: string = '';
  address: string = '';
  phoneNo: string = '';
  totalAfterDiscount: number = 0;

  private membershipservice = inject(MembershipService);
  generalservice = inject(GeneralService);

  transactionData: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.membershipID = this.route.snapshot.paramMap.get('membershipID') || '';

    if (Validator.isEmpty(this.membershipID)) {
      this.router.navigate(['/error404']);
    }

    this.loadMembershipTransaction();
  }

  loadMembershipTransaction() {
    const model = membership_print_model({
      MembershipID: this.membershipID,
    });

    this.membershipservice.printMembershipTransaction(model).subscribe({
      next: (response) => {
        if (response.status) {
          this.transactionData = response.data?.data;
          if (response.data.length <= 0) {
            this.router.navigate(['/error404']);
          } else {
            debugger;
            this.clientName = this.transactionData[0].ClientName;
            this.joinedDate = this.transactionData[0].StartDate;
            this.expiredDate = this.transactionData[0].ExpiredDate;
            this.address = this.transactionData[0].Address;
            this.phoneNo = this.transactionData[0].PhoneNo;

            // ✅ calculate total
            this.totalAfterDiscount = this.transactionData.reduce(
              (sum: number, item: any) => sum + (item.AfterDiscount || 0),
              0,
            );
          }
        } else {
          console.error(
            'Failed to fetch membership transaction:',
            response.message,
          );
        }
      },
      error: (error) => {
        console.error('Error fetching membership transaction:', error);
      },
    });
  }
}
