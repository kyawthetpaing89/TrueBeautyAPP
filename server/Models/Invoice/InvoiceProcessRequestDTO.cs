using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Invoice
{
    public class InvoiceProcessRequestDTO
    {
        public required string InvoiceNo { get; set; }
        public required string InvoiceDate { get; set; }
        public required string ClientID { get; set; }
        public required string Notes { get; set; }
        public required string Discount { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
    }
}