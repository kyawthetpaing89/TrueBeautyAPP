using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Invoice
{
    public class InvoiceDetailProcessRequestDTO
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public required string ShopID { get; set; }
        public required string InvoiceDate { get; set; }
        public required string ClientID { get; set; }
        public required string Notes { get; set; } = string.Empty;
        public required string Discount { get; set; } = string.Empty;
        public string SEQ { get; set; } = string.Empty;
        public required string ItemCD { get; set; }
        public required string UnitPrice { get; set; }
        public required string PackageQuantity { get; set; }
        public required string Quantity { get; set; }
        public required string TotalQuantity { get; set; }
        public required string TotalPrice { get; set; }
        public required string DiscountPercent { get; set; }
        public required string DiscountAmount { get; set; }
        public required string AdditionalDiscount { get; set; }
        public required string AfterDiscount { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
    }
}