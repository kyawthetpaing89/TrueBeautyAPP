import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../services/general-service';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  generalservcie = inject(GeneralService);
  adminservcie = inject(AdminService);

  role: string = this.generalservcie.getUserRole() || '';

  constructor(private router: Router) {}

  isClientRouteActive(): boolean {
    return this.router.url.startsWith('/client');
  }

  isAdminRouteActive(): boolean {
    return this.router.url.startsWith('/admin');
  }

  isItemRouteActive(): boolean {
    return this.router.url.startsWith('/item');
  }

  isReportRouteActive(): boolean {
    return this.router.url.startsWith('/reports');
  }

  logout() {
    this.adminservcie.logout();
  }
}
