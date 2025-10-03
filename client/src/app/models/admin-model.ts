interface admin_updatepassword_model {
  LoginID: string;
  CurrentPassword: string;
  LoginPassword: string;
}

export function admin_updatepassword_model(
  overrides: Partial<admin_updatepassword_model> = {}
): admin_updatepassword_model {
  return {
    LoginID: '',
    CurrentPassword: '',
    LoginPassword: '',
    ...overrides,
  };
}
