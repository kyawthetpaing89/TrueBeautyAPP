import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Validator } from '../../../utilities/validator';
import { GeneralService } from '../../../services/general-service';
import { DialogService } from '../../../services/dialog-service';
import { admin_updatepassword_model } from '../../../models/admin-model';
import { AdminService } from '../../../services/admin-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-myprofile',
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.scss',
})
export class MyprofileComponent {
  adminservice = inject(AdminService);
  generalservice = inject(GeneralService);
  dialogservice = inject(DialogService);

  name: string = '';
  loginid: string = '';
  currentpassword: string = '';
  newpassword: string = '';
  confirmpassword: string = '';

  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.name = this.generalservice.getUserName();
    this.loginid = this.generalservice.getLoginID();
  }

  changepassword() {
    if (!this.errorcheck()) return;

    const model = admin_updatepassword_model({
      LoginID: this.loginid,
      CurrentPassword: this.currentpassword,
      LoginPassword: this.newpassword,
    });

    this.adminservice
      .adminUpdatePassword(model)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.dialogservice.showMessage(
              'Success',
              response.data?.data?.[0]?.MessageText
            );
          } else {
            this.dialogservice.showMessage('Error', response.message);
          }
        },
        error: (error) => {
          console.error('Error processing item:', error);
          this.dialogservice.showMessage('Error', error.error.errors['item']);
        },
      });
  }

  errorcheck() {
    if (Validator.isEmpty(this.currentpassword)) {
      const htmlContent = `
              <p>
                Current Password is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.newpassword)) {
      const htmlContent = `
              <p>
                New Password is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.confirmpassword)) {
      const htmlContent = `
              <p>
                Confirm Password is required.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (this.newpassword !== this.confirmpassword) {
      const htmlContent = `
              <p>
                New Password and confirm password do not match.
              </p>
            `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
