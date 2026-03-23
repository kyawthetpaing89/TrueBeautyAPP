interface employee_get_model {
  EmployeeID: string;
  EmployeeName: string;
  PositionCD: string;
}

export function employee_get_model(
  overrides: Partial<employee_get_model> = {}
): employee_get_model {
  return {
    EmployeeID: '',
    EmployeeName: '',
    PositionCD: '',
    ...overrides,
  };
}