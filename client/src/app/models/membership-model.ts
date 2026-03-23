interface membershiptype_process_model {
  MembershipTypeID: string;
  Description: string;
  DurationMonths: string;
  Amount: string;
  Cashback: string;
  LoginID: string;
}

export function membershiptype_process_model(
  overrides: Partial<membershiptype_process_model> = {},
): membershiptype_process_model {
  return {
    MembershipTypeID: '',
    Description: '',
    DurationMonths: '',
    Amount: '',
    Cashback: '',
    LoginID: '',
    ...overrides,
  };
}

interface membership_get_model {
  MembershipID: string;
  ClientID: string;
  MembershipTypeID: string;
  Status: string;
}

export function membership_get_model(
  overrides: Partial<membership_get_model> = {},
): membership_get_model {
  return {
    MembershipID: '',
    ClientID: '',
    MembershipTypeID: '',
    Status: '',
    ...overrides,
  };
}

interface membership_process_model {
  MembershipID: string;
  MembershipTypeID: string;
  StartDate: string;
  ExpiredDate: string;
  AmountItemCD: string;
  CashbackItemCD: string;
  Note: string;
  LoginID: string;
  Mode: string;
  ClientID: string;
}

export function membership_process_model(
  overrides: Partial<membership_process_model> = {},
): membership_process_model {
  return {
    MembershipID: '',
    MembershipTypeID: '',
    StartDate: '',
    ExpiredDate: '',
    AmountItemCD: '',
    CashbackItemCD: '',
    Note: '',
    LoginID: '',
    Mode: '',
    ClientID: '',
    ...overrides,
  };
}

interface membershiptransaction_get_model {
  MembershipID: string;
}

export function membershiptransaction_get_model(
  overrides: Partial<membershiptransaction_get_model> = {},
): membershiptransaction_get_model {
  return {
    MembershipID: '',
    ...overrides,
  };
}

interface membershipclients_get_model {
  MembershipID: string;
}

export function membershipclients_get_model(
  overrides: Partial<membershipclients_get_model> = {},
): membershipclients_get_model {
  return {
    MembershipID: '',
    ...overrides,
  };
}

interface membershipclients_process_model {
  MembershipID: string;
  ClientID: string;
  IsPrimary: string;
  LoginID: string;
  Mode: string;
}

export function membershipclients_process_model(
  overrides: Partial<membershipclients_process_model> = {},
): membershipclients_process_model {
  return {
    MembershipID: '',
    ClientID: '',
    IsPrimary: '',
    LoginID: '',
    Mode: '',
    ...overrides,
  };
}
