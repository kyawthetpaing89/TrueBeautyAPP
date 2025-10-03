namespace server.Models.Invoice
{
    public class InvoiceDailySalesRequestDTO
    {
        public required string YYYY { get; set; }
        public required string MM { get; set; }
        public required string ReportType { get; set; }
    }
}