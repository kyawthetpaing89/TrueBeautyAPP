interface invoice_get_model {
  InvoiceNo: string;
  ShopID: string;
  InvoiceDateFrom: string;
  InvoiceDateTo: string;
  ClientID: string;
  ClientIDName: string;
  TreatmentCD: string;
  MedicineCD: string;
  SkincareCD: string;
  DeleteFlg: string;
}

export function invoice_get_model(
  overrides: Partial<invoice_get_model> = {}
): invoice_get_model {
  return {
    InvoiceNo: '',
    ShopID: '',
    InvoiceDateFrom: '',
    InvoiceDateTo: '',
    ClientID: '',
    ClientIDName: '',
    TreatmentCD: '',
    MedicineCD: '',
    SkincareCD: '',
    DeleteFlg: '0',
    ...overrides,
  };
}

interface invoice_export_model {
  InvoiceNo: string;
  InvoiceDateFrom: string;
  InvoiceDateTo: string;
  ClientID: string;
  ClientIDName: string;
  TreatmentCD: string;
  MedicineCD: string;
  SkincareCD: string;
}

export function invoice_export_model(
  overrides: Partial<invoice_export_model> = {}
): invoice_export_model {
  return {
    InvoiceNo: '',
    InvoiceDateFrom: '',
    InvoiceDateTo: '',
    ClientID: '',
    ClientIDName: '',
    TreatmentCD: '',
    MedicineCD: '',
    SkincareCD: '',
    ...overrides,
  };
}

interface invoicedetail_process_model {
  InvoiceNo: string;
  ShopID: string;
  InvoiceDate: string;
  ClientID: string;
  Notes: string;
  Discount: string;
  SEQ: string;
  ItemCD: string;
  UnitPrice: string;
  PackageQuantity: string;
  Quantity: string;
  TotalQuantity: string;
  TotalPrice: string;
  DiscountPercent: string;
  DiscountAmount: string;
  AdditionalDiscount: string;
  AfterDiscount: string;
  Mode: string;
  LoginID: string;
}

export function invoicedetail_process_model(
  overrides: Partial<invoicedetail_process_model> = {}
): invoicedetail_process_model {
  return {
    InvoiceNo: '',
    ShopID: '',
    InvoiceDate: '',
    ClientID: '',
    Notes: '',
    Discount: '',
    SEQ: '',
    ItemCD: '',
    UnitPrice: '',
    PackageQuantity: '',
    Quantity: '',
    TotalQuantity: '',
    TotalPrice: '',
    DiscountPercent: '',
    DiscountAmount: '',
    AdditionalDiscount: '',
    AfterDiscount: '',
    Mode: '',
    LoginID: '',
    ...overrides,
  };
}

interface invoicedetail_get_model {
  InvoiceNo: string;
  ClientID: string;
  ItemType: string;
}

export function invoicedetail_get_model(
  overrides: Partial<invoicedetail_get_model> = {}
): invoicedetail_get_model {
  return {
    InvoiceNo: '',
    ClientID: '',
    ItemType: '',
    ...overrides,
  };
}

interface invoice_process_model {
  InvoiceNo: string;
  InvoiceDate: string;
  ClientID: string;
  Notes: string;
  Discount: string;
  Mode: string;
  LoginID: string;
}

export function invoice_process_model(
  overrides: Partial<invoice_process_model> = {}
): invoice_process_model {
  return {
    InvoiceNo: '',
    InvoiceDate: '',
    ClientID: '',
    Notes: '',
    Discount: '',
    Mode: '',
    LoginID: '',
    ...overrides,
  };
}

interface invoice_copy_model {
  InvoiceNo: string;
  LoginID: string;
}

export function invoice_copy_model(
  overrides: Partial<invoice_copy_model> = {}
): invoice_copy_model {
  return {
    InvoiceNo: '',
    LoginID: '',
    ...overrides,
  };
}

interface invoice_copyaccesscheck_model {
  InvoiceNo: string;
  LoginID: string;
}

export function invoice_copyaccesscheck_model(
  overrides: Partial<invoice_copyaccesscheck_model> = {}
): invoice_copyaccesscheck_model {
  return {
    InvoiceNo: '',
    LoginID: '',
    ...overrides,
  };
}

interface invoice_copyconfirm_model {
  InvoiceNo: string;
}

export function invoice_copyconfirm_model(
  overrides: Partial<invoice_copyconfirm_model> = {}
): invoice_copyconfirm_model {
  return {
    InvoiceNo: '',
    ...overrides,
  };
}
