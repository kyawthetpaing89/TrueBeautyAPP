namespace server.Models.Invoice
{
    public class InvoiceExportRequestDTO
    {
        public string InvoiceNo { get; set; } = "";
        public string InvoiceDateFrom { get; set; } = "";
        public string InvoiceDateTo { get; set; } = "";
        public string ClientID { get; set; } = "";
        public string ClientIDName { get; set; } = "";
        public string TreatmentCD { get; set; } = "";
        public string MedicineCD { get; set; } = "";
        public string SkincareCD { get; set; } = "";
    }
}