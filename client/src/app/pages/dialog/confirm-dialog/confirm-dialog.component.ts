import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // For mat-button
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  sanitizedHtml: SafeHtml;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; htmlContent: string },
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private sanitizer: DomSanitizer
  ) {
    // Sanitize the HTML content to ensure it's safe to bind
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(
      data.htmlContent
    );
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
