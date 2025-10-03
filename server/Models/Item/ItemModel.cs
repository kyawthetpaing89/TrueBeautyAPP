namespace server.Models.Item
{
    public class ItemExportRequestDTO
    {
        public required string ItemCD { get; set; }
        public required string ItemName { get; set; }
    }

    public class ItemInventoryRequestDTO
    {
        public required string ItemCD { get; set; }
        public required string ItemName { get; set; }
        public required string ItemType { get; set; }
    }

    public class ItemListPurchaseRequestDTO
    {
        public required string ItemCD { get; set; }
        public required string ItemName { get; set; }
        public required string PurchaseID { get; set; }
    }

    public class ItemListRequestDTO
    {
        public required string ItemCD { get; set; }
        public required string ItemName { get; set; }
        public required string ItemType { get; set; }
        public required string InstructionCD { get; set; }
    }

    public class ItemPriceLogRequestDTO
    {
        public required string ItemCD { get; set; }
    }

    public class ItemProcessRequestDTO
    {
        public required string ItemCD { get; set; }
        public required string ItemName { get; set; }
        public required string Description { get; set; }
        public required string ItemType { get; set; }
        public required string Quantity { get; set; }
        public required string Price { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
    }

    public class ItemPurchasingProcessRequestDTO
    {
        public required string Mode { get; set; }
        public required string PurchaseID { get; set; }
        public required string PurchaseDate { get; set; }
        public required string Notes { get; set; }
        public required string ItemJson { get; set; }
        public required string LoginID { get; set; }
    }

    public class ItemPurchasingRequestDTO
    {
        public string PurchaseID { get; set; } = "";
        public string PurchaseDateFrom { get; set; } = "";
        public string PurchaseDateTo { get; set; } = "";
    }

    public class ItemUsageProcessRequestDTO
    {
        public required string UsageID { get; set; }
        public required string ItemCD { get; set; }
        public required string Quantity { get; set; }
        public required string DateUsed { get; set; }
        public required string Notes { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
    }

    public class ItemUsageRequestDTO
    {
        public string UsageID { get; set; } = "";
        public string ItemCD { get; set; } = "";
        public string DateUsedFrom { get; set; } = "";
        public string DateUsedTo { get; set; } = "";
    }

    public class ItemPurchasingPaymentProcessRequestDTO
    {
        public string TransactionID { get; set; } = "";
        public required string PurchaseID { get; set; }
        public required string PaymentDate { get; set; }
        public required string Amount { get; set; }
        public required string Notes { get; set; }
        public required string LoginID { get; set; }
        public required string Mode { get; set; }
    }

    public class ItemPurchasingPaymentRequestDTO
    {
        public required string PurchaseID { get; set; }
    }

    public class ItemTopSellingRequestDTO
    {
        public string YYYY { get; set; } = string.Empty;
        public string MM { get; set; } = string.Empty;
        public required string ReportType { get; set; }
    }
}