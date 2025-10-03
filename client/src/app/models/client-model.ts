interface client_get_model {
  ClientID: string;
  Name: string;
  Gender: string;
  PhoneNo: string;
}

export function client_get_model(
  overrides: Partial<client_get_model> = {}
): client_get_model {
  return {
    ClientID: '',
    Name: '',
    Gender: '',
    PhoneNo: '',
    ...overrides,
  };
}

interface clientpayment_get_model {
  TransactionID: string;
  InvoiceNo: string;
  ClientID: string;
  PaymentDate: string;
  Amount: string;
  Mode: string;
  LoginID: string;
}

export function clientpayment_get_model(
  overrides: Partial<clientpayment_get_model> = {}
): clientpayment_get_model {
  return {
    TransactionID: '',
    InvoiceNo: '',
    ClientID: '',
    PaymentDate: '',
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
  overrides: Partial<clientbooking_get_model> = {}
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
  overrides: Partial<clientbooking_process_model> = {}
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
