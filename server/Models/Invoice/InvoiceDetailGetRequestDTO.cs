using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Invoice
{
    public class InvoiceDetailGetRequestDTO
    {
        public required string InvoiceNo { get; set; }
        public string ClientID { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
    }
}