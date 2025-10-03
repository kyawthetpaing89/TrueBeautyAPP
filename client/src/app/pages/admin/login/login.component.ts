import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DialogService } from '../../../services/dialog-service';
import { AdminService } from '../../../services/admin-service';
import { Router, RouterModule } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Validator } from '../../../utilities/validator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general-service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  dialogservice = inject(DialogService);
  userservice = inject(AdminService);
  generalservice = inject(GeneralService);
  router = inject(Router);
  title = inject(Title);

  userid: string = '';
  password: string = '';

  isSubmitting: boolean = false;

  ngOnInit() {
    this.title.setTitle('Login');
  }

  loginAction() {
    if (!this.loginErrorCheck()) {
      return;
    }

    const deviceIdKey = 'device-id';
    let deviceId = (localStorage.getItem(deviceIdKey) as string) ?? uuidv4();

    localStorage.setItem(deviceIdKey, deviceId);

    const _model = {
      LoginID: this.userid,
      LoginPassword: this.password,
      DeviceID: deviceId,
    };

    this.userservice.login(_model).subscribe({
      next: (response) => {
        if (response.status) {
          this.isSubmitting = false;

          if (this.generalservice.getUserRole() === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/invoice/invoicelist']);
          }
        } else {
          const htmlContent = `
          <p>
            Invalid User ID or Password.
          </p>
        `;

          this.dialogservice.showMessage('Error', htmlContent);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        const htmlContent = `
          <p>
            Invalid User ID or Password.
          </p>
        `;

        this.dialogservice.showMessage('Error', htmlContent);
        this.isSubmitting = false;
      },
    });
  }

  loginErrorCheck() {
    if (Validator.isEmpty(this.userid)) {
      const htmlContent = `
          <p>
            User ID is required.
          </p>
        `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    if (Validator.isEmpty(this.password)) {
      const htmlContent = `
          <p>
            Password is required.
          </p>
        `;

      this.dialogservice.showMessage('Error', htmlContent);
      return false;
    }

    return true;
  }
}
