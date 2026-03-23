interface client_get_model {
  ClientID: string;
  Name: string;
  Gender: string;
  ShopID: string;
  PhoneNo: string;
  MemberType: string;
  PageNo: number;
  PageSize: number;
  SortColumn: string;
  SortAsc: boolean;
}

export function client_get_model(
  overrides: Partial<client_get_model> = {},
): client_get_model {
  return {
    ClientID: '',
    Name: '',
    Gender: '',
    ShopID: '',
    PhoneNo: '',
    MemberType: '',
    PageNo: 1,
    PageSize: 100,
    SortColumn: 'ClientID',
    SortAsc: true,
    ...overrides,
  };
}

interface clientpayment_get_model {
  TransactionID: string;
  InvoiceNo: string;
  ClientID: string;
  PaymentDate: string;
  PaymentType: string;
  MembershipID: string;
  Amount: string;
  Mode: string;
  LoginID: string;
}

export function clientpayment_get_model(
  overrides: Partial<clientpayment_get_model> = {},
): clientpayment_get_model {
  return {
    TransactionID: '',
    InvoiceNo: '',
    ClientID: '',
    PaymentDate: '',
    PaymentType: '',
    MembershipID: '',
    Amount: '',
    Mode: '',
    LoginID: '',
    ...overrides,
  };
}

interface clientbooking_get_model {
  YYYY: string;
  MM: string;
}

export function clientbooking_get_model(
  overrides: Partial<clientbooking_get_model> = {},
): clientbooking_get_model {
  return {
    YYYY: '',
    MM: '',
    ...overrides,
  };
}

interface clientbooking_process_model {
  BookingCD: string;
  ClientID: string;
  BookingDate: string;
  BookingSlot: string;
  Notes: string;
  CancelReason: string;
  LoginID: string;
  Mode: string;
}

export function clientbooking_process_model(
  overrides: Partial<clientbooking_process_model> = {},
): clientbooking_process_model {
  return {
    BookingDate: '',
    BookingCD: '',
    ClientID: '',
    BookingSlot: '',
    Notes: '',
    CancelReason: '',
    LoginID: '',
    Mode: 'New',
    ...overrides,
  };
}

interface client_getcurrentmembership_model {
  ClientID: string;
}

export function client_getcurrentmembership_model(
  overrides: Partial<client_getcurrentmembership_model> = {},
): client_getcurrentmembership_model {
  return {
    ClientID: '',
    ...overrides,
  };
}

interface client_getmembercard_model {
  ClientID: string;
}

export function client_getmembercard_model(
  overrides: Partial<client_getmembercard_model> = {},
): client_getmembercard_model {
  return {
    ClientID: '',
    ...overrides,
  };
}

interface client_getmembercardtransactions_model {
  ClientMemberCardID: string;
}

export function client_getmembercardtransactions_model(
  overrides: Partial<client_getmembercardtransactions_model> = {},
): client_getmembercardtransactions_model {
  return {
    ClientMemberCardID: '',
    ...overrides,
  };
}
