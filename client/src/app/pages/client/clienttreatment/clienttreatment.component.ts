import { Component, inject } from '@angular/core';
import { ClientService } from '../../../services/client-service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general-service';
import { ClienttreatmenthistoryDialogComponent } from '../../dialog/client/clienttreatmenthistory-dialog/clienttreatmenthistory-dialog.component';
import { TreatmentinstructionDialogComponent } from '../../dialog/client/treatmentinstruction-dialog/treatmentinstruction-dialog.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-clienttreatment',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clienttreatment.component.html',
  styleUrl: './clienttreatment.component.scss',
})
export class ClienttreatmentComponent {
  private clientservice = inject(ClientService);
  generalservice = inject(GeneralService);
  private dialog = inject(MatDialog);

  param_clientID: string = '';

  clientID: string = '';
  clientName: string = '';
  gender: string = '';
  phoneNo: string = '';
  address: string = '';
  dob: string = '';

  doctorInstructionLoading: boolean = false;
  doctorInstructionData: any[] = [];

  treatmentLoading: boolean = false;
  treatmentHistoryData: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.generalservice.setPageTitle('Client Treatment');
    this.param_clientID = this.route.snapshot.paramMap.get('clientID') || '';
    this.loadClientInfo();
    this.loadDoctorInstruction();
    this.loadTreatmentHistory();
  }

  loadClientInfo() {
    const model = {
      ClientID: this.param_clientID,
    };

    this.clientservice.getClient(model).subscribe({
      next: (response) => {
        if (response.status) {
          if (response.data?.data.length > 0) {
            const clientData = response.data?.data[0];
            this.clientID = clientData.ClientID;
            this.clientName = clientData.Name;
            this.gender = clientData.GenderText;
            this.phoneNo = clientData.PhoneNo;
            this.dob = clientData.DOB;
            this.address = clientData.Address;
          } else {
            this.router.navigate(['/error404']);
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

  loadDoctorInstruction() {
    this.doctorInstructionLoading = true;
    const model = {
      ClientID: this.param_clientID,
    };

    this.clientservice
      .getDoctorInstruction(model)
      .pipe(
        finalize(() => {
          this.doctorInstructionLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.doctorInstructionData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
  }

  loadTreatmentHistory() {
    this.treatmentLoading = true;
    const model = {
      InvoiceNo: '',
      ClientID: this.param_clientID,
      ClientName: '',
      PhoneNo: '',
      Balance: '',
    };

    this.clientservice
      .getClientTreatmentCheckin(model)
      .pipe(
        finalize(() => {
          this.treatmentLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.treatmentHistoryData = response.data?.data;
          } else {
            console.error('Failed to fetch item summary:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching item summary:', error);
        },
      });
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
        this.loadTreatmentHistory();
      }
    });
  }

  openTreatmentInstruction(
    mode: string,
    instructionCD: string,
    notes: string
  ): void {
    const param = {
      ClientID: this.param_clientID,
      Mode: mode,
      InstructionCD: instructionCD,
      Notes: notes ?? '',
    };

    const dialogRef = this.dialog.open(TreatmentinstructionDialogComponent, {
      data: param,
      width: '80%',
      maxWidth: '95vw',
      maxHeight: '70%',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadDoctorInstruction();
      }
    });
  }
}
