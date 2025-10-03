import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  sanitizedHtml: SafeHtml;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; htmlContent: string },
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    private sanitizer: DomSanitizer
  ) {
    // Sanitize the HTML content to ensure it's safe to bind
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(
      data.htmlContent
    );
  }

  onClose(): void {
    this.dialogRef.close(true);
  }
}
