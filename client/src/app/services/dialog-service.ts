import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../pages/dialog/alert-dialog/alert-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../pages/dialog/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private hasDialogBeenShown: boolean = false;

  constructor(private dialog: MatDialog) {}

  // Show the dialog only once per state
  showAlert(
    loginUrl: string = '/member/login',
    registerUrl: string = '/member/register'
  ) {
    // If dialog has already been shown, return and don't show it again
    if (this.hasDialogBeenShown) {
      return;
    }

    this.hasDialogBeenShown = true; // Set flag to prevent future dialogs until reset

    const htmlContent = `
      <p>
        Please <a href="${loginUrl}" target="_blank" style="color: blue; text-decoration: underline; cursor: pointer;">log in</a> if you have an account, or 
        <a href="${registerUrl}" target="_blank" style="color: blue; text-decoration: underline; cursor: pointer;">register</a> to use this feature.
      </p>
    `;

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { title: 'Alert', htmlContent },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.hasDialogBeenShown = false;
    });
  }

  showConfirm(title: string, htmlContent: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, htmlContent },
    });

    return dialogRef.afterClosed();
  }

  showMessage(title: string, message: string) {
    const htmlContent = `
      <p>
        ${message}
      </p>
    `;

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { title: title, htmlContent },
    });

    return dialogRef.afterClosed();
  }

  showError(statusCode: number) {
    let defaultMessage = 'Something went wrong. Please try again.';

    switch (statusCode) {
      case 400:
        defaultMessage = 'Invalid request. Please check your input.';
        break;
      case 405:
        defaultMessage = 'Method not allowed. Contact support.';
        break;
      case 500:
        defaultMessage = 'Server error. Please try again later.';
        break;
    }

    const htmlContent = `
      <p>
        ${defaultMessage}
      </p>
    `;

    this.dialog.open(AlertDialogComponent, {
      data: { title: 'Error', htmlContent },
    });
  }
}
