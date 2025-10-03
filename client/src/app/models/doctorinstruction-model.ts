interface doctorinstruction_getlast_model {
  ClientID: string;
  InvoiceDate: string;
}

export function doctorinstruction_getlast_model(
  overrides: Partial<doctorinstruction_getlast_model> = {}
): doctorinstruction_getlast_model {
  return {
    ClientID: '',
    InvoiceDate: '',
    ...overrides,
  };
}
