interface item_get_model {
  ItemCD: string;
  ItemName: string;
  ItemType: string;
  InstructionCD: string;
}

export function item_get_model(
  overrides: Partial<item_get_model> = {}
): item_get_model {
  return {
    ItemCD: '',
    ItemName: '',
    ItemType: '',
    InstructionCD: '',
    ...overrides,
  };
}

interface item_getpricelog_model {
  ItemCD: string;
}

export function item_getpricelog_model(
  overrides: Partial<item_getpricelog_model> = {}
): item_getpricelog_model {
  return {
    ItemCD: '',
    ...overrides,
  };
}

interface item_export_model {
  ItemCD: string;
  ItemName: string;
}

export function item_export_model(
  overrides: Partial<item_export_model> = {}
): item_export_model {
  return {
    ItemCD: '',
    ItemName: '',
    ...overrides,
  };
}

interface item_getpurchasing_model {
  PurchaseID: string;
  PurchaseDateFrom: string;
  PurchaseDateTo: string;
}

export function item_getpurchasing_model(
  overrides: Partial<item_getpurchasing_model> = {}
): item_getpurchasing_model {
  return {
    PurchaseID: '',
    PurchaseDateFrom: '',
    PurchaseDateTo: '',
    ...overrides,
  };
}

interface item_purchasingprocess_model {
  Mode: string;
  PurchaseID: string;
  PurchaseDate: string;
  Notes: string;
  ItemJson: string;
  LoginID: string;
}

export function item_purchasingprocess_model(
  overrides: Partial<item_purchasingprocess_model> = {}
): item_purchasingprocess_model {
  return {
    Mode: '',
    PurchaseID: '',
    PurchaseDate: '',
    Notes: '',
    ItemJson: '',
    LoginID: '',
    ...overrides,
  };
}

interface item_getpurchasedlist_model {
  ItemCD: string;
  ItemName: string;
  PurchaseID: string;
}

export function item_getpurchasedlist_model(
  overrides: Partial<item_getpurchasedlist_model> = {}
): item_getpurchasedlist_model {
  return {
    ItemCD: '',
    ItemName: '',
    PurchaseID: '',
    ...overrides,
  };
}

interface item_getusage_model {
  UsageID: string;
  ItemCD: string;
  DateUsedFrom: string;
  DateUsedTo: string;
}

export function item_getusage_model(
  overrides: Partial<item_getusage_model> = {}
): item_getusage_model {
  return {
    UsageID: '',
    ItemCD: '',
    DateUsedFrom: '',
    DateUsedTo: '',
    ...overrides,
  };
}

interface itemusage_process_model {
  UsageID: string;
  ItemCD: string;
  Quantity: string;
  DateUsed: string;
  Notes: string;
  Mode: string;
  LoginID: string;
}

export function itemusage_process_model(
  overrides: Partial<itemusage_process_model> = {}
): itemusage_process_model {
  return {
    UsageID: '',
    ItemCD: '',
    Quantity: '',
    DateUsed: '',
    Notes: '',
    Mode: '',
    LoginID: '',
    ...overrides,
  };
}

interface item_getinventory_model {
  ItemCD: string;
  ItemName: string;
  ItemType: string;
}

export function item_getinventory_model(
  overrides: Partial<item_getinventory_model> = {}
): item_getinventory_model {
  return {
    ItemCD: '',
    ItemName: '',
    ItemType: '',
    ...overrides,
  };
}

interface itempurchasingpayment_model {
  TransactionID: string;
  PaymentID: string;
  PurchaseID: string;
  PaymentDate: string;
  Amount: string;
  Notes: string;
  LoginID: string;
  Mode: string;
}

export function itempurchasingpayment_model(
  overrides: Partial<itempurchasingpayment_model> = {}
): itempurchasingpayment_model {
  return {
    TransactionID: '',
    PaymentID: '',
    PurchaseID: '',
    PaymentDate: '',
    Amount: '',
    Notes: '',
    LoginID: '',
    Mode: '',
    ...overrides,
  };
}

interface item_getpurchasingpayment_model {
  PurchaseID: string;
}

export function item_getpurchasingpayment_model(
  overrides: Partial<item_getpurchasingpayment_model> = {}
): item_getpurchasingpayment_model {
  return {
    PurchaseID: '',
    ...overrides,
  };
}

interface item_getstockhistory_model {
  StockUpdateDateFrom: string;
  StockUpdateDateTo: string;
}

export function item_getstockhistory_model(
  overrides: Partial<item_getstockhistory_model> = {}
): item_getstockhistory_model {
  return {
    StockUpdateDateFrom: '',
    StockUpdateDateTo: '',
    ...overrides,
  };
}

interface item_getstockbalance_model {
  ShopID: string;
}

export function item_getstockbalance_model(
  overrides: Partial<item_getstockbalance_model> = {}
): item_getstockbalance_model {
  return {
    ShopID: '',
    ...overrides,
  };
}

interface item_getstockdetail_model {
  StockCD: string;
}

export function item_getstockdetail_model(
  overrides: Partial<item_getstockdetail_model> = {}
): item_getstockdetail_model {
  return {
    StockCD: '',
    ...overrides,
  };
}

interface item_stockprocess_model {
  Mode: string;
  ShopID: string;
  ItemCD: string;
  AddedQty: string;
  CreatedBy: string;
}

export function item_stockprocess_model(
  overrides: Partial<item_stockprocess_model> = {}
): item_stockprocess_model {
  return {
    Mode: '',
    ShopID: '',
    ItemCD: '',
    AddedQty: '',
    CreatedBy: '',
    ...overrides,
  };
}
