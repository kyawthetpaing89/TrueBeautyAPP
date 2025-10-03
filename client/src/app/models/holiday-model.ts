interface holiday_get_model {
  YYYY: string;
  MM: string;
}

export function holiday_get_model(
  overrides: Partial<holiday_get_model> = {}
): holiday_get_model {
  return {
    YYYY: '',
    MM: '',
    ...overrides,
  };
}

interface holiday_process_model {
  Mode: string;
  HolidayDate: string;
  Description: string;
  LoginID: string;
}

export function holiday_process_model(
  overrides: Partial<holiday_process_model> = {}
): holiday_process_model {
  return {
    Mode: '',
    HolidayDate: '',
    Description: '',
    LoginID: '',
    ...overrides,
  };
}
