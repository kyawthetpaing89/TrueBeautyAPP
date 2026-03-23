import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/login/login.component';
import { LayoutComponent } from './pages/shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SalesreportComponent } from './pages/report/salesreport/salesreport.component';
import { ItemslistComponent } from './pages/items/itemslist/itemslist.component';
import { ClientlistComponent } from './pages/client/clientlist/clientlist.component';
import { TreatmentCheckinComponent } from './pages/client/treatment-checkin/treatment-checkin.component';
import { ClienttreatmentComponent } from './pages/client/clienttreatment/clienttreatment.component';
import { InvoicelistComponent } from './pages/invoice/invoicelist/invoicelist.component';
import { InvoiceRegisterComponent } from './pages/invoice/invoice-register/invoice-register.component';
import { Error404Component } from './pages/error/error404/error404.component';
import { InvoicePrintComponent } from './pages/invoice/invoice-print/invoice-print.component';
import { MyprofileComponent } from './pages/admin/myprofile/myprofile.component';
import { ItemPurchasingComponent } from './pages/items/item-purchasing/item-purchasing.component';
import { ItemUsagelistComponent } from './pages/items/item-usagelist/item-usagelist.component';
import { ItemInventoryComponent } from './pages/items/item-inventory/item-inventory.component';
import { HolidaylistComponent } from './pages/holidays/holidaylist/holidaylist.component';
import { ClientbookinglistComponent } from './pages/client/clientbookinglist/clientbookinglist.component';
import { ClientreportComponent } from './pages/report/clientreport/clientreport.component';
import { ItemreportComponent } from './pages/report/itemreport/itemreport.component';
import { PayrollLayoutComponent } from './pages/payroll/shared/layout/layout.component';
import { EmployeelistComponent } from './pages/payroll/employee/employeelist/employeelist.component';
import { MembershipTypelistComponent } from './pages/membership/membership-typelist/membership-typelist.component';
import { MembershipListComponent } from './pages/membership/membership-list/membership-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'users/login', pathMatch: 'full' },
  {
    path: 'items',
    component: LayoutComponent,
    children: [
      { path: 'itemlist', component: ItemslistComponent },
      { path: 'itempurchasing', component: ItemPurchasingComponent },
      { path: 'itemusage', component: ItemUsagelistComponent },
      { path: 'iteminventory', component: ItemInventoryComponent },
    ],
  },
  {
    path: 'client',
    component: LayoutComponent,
    children: [
      { path: 'clientlist', component: ClientlistComponent },
      { path: 'treatmentcheckin', component: TreatmentCheckinComponent },
      {
        path: 'clienttreatment/:clientID',
        component: ClienttreatmentComponent,
      },
      { path: 'clientbooking', component: ClientbookinglistComponent },
    ],
  },
  {
    path: 'membership',
    component: LayoutComponent,
    children: [
      { path: 'membershiptype', component: MembershipTypelistComponent },
      { path: 'membershiplist', component: MembershipListComponent },
    ],
  },
  {
    path: 'invoice',
    component: LayoutComponent,
    children: [
      { path: 'invoicelist', component: InvoicelistComponent },
      {
        path: 'invoice-register/:shopID',
        component: InvoiceRegisterComponent,
      }, //New
      {
        path: 'invoice-register/:invoiceNo/copy',
        component: InvoiceRegisterComponent,
      }, //Copy
      {
        path: 'invoice-register/:invoiceNo/edit',
        component: InvoiceRegisterComponent,
      }, //Edit
      {
        path: 'invoice-register/:invoiceNo/detail',
        component: InvoiceRegisterComponent,
      }, //Detail
      {
        path: 'invoice-register/:invoiceNo/delete',
        component: InvoiceRegisterComponent,
      }, //Delete
      {
        path: 'invoice-register/:invoiceNo/deleterequest',
        component: InvoiceRegisterComponent,
      }, //Delete Request
      {
        path: 'invoice-register/:invoiceNo/deleteapproval',
        component: InvoiceRegisterComponent,
      }, //Delete Approval
    ],
  },
  {
    path: 'invoice',
    children: [
      {
        path: 'invoice-print/:invoiceNo',
        component: InvoicePrintComponent,
      }, //Invoice Print
    ],
  },
  {
    path: 'holidays',
    component: LayoutComponent,
    children: [
      {
        path: 'holidaylist',
        component: HolidaylistComponent,
      },
    ],
  },
  {
    path: 'users',
    children: [{ path: 'login', component: LoginComponent }],
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [{ path: 'myprofile', component: MyprofileComponent }],
  },
  {
    path: 'reports',
    component: LayoutComponent,
    children: [
      { path: 'salesreport', component: SalesreportComponent },
      { path: 'clientreport', component: ClientreportComponent },
      { path: 'itemreport', component: ItemreportComponent },
    ],
  },
  {
    path: 'payroll/employee',
    component: PayrollLayoutComponent,
    children: [{ path: 'employeelist', component: EmployeelistComponent }],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route
      { path: 'dashboard', component: DashboardComponent },
      { path: 'salesreport', component: SalesreportComponent },
      { path: 'error404', component: Error404Component },
    ],
  },
  { path: '**', redirectTo: 'users/login' },
];
