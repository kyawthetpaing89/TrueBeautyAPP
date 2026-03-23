namespace server.Models.Client
{
    public class ClientLoginRequestDTO
    {
        public required string LoginID { get; set; }
        public required string LoginPassword { get; set; }
    }

    public class ClientChangePasswordRequestDTO
    {
        public required string ClientID { get; set; }
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }

    public class ClientTreatmentGetRequestDTO
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public string SEQ { get; set; } = string.Empty;
    }

    public class ClientGetTreatmentCheckinRequestDTO
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public string ClientID { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public string Balance { get; set; } = string.Empty;
    }

    public class ClientTreatmentCheckinProcessRequestDTO
    {
        public string ID { get; set; } = string.Empty;
        public string InvoiceNo { get; set; } = string.Empty;
        public string ClientID { get; set; } = string.Empty;
        public string SEQ { get; set; } = string.Empty;
        public string TreatmentDate { get; set; } = string.Empty;
        public string LoginID { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
    }

    public class ClientGetRequestDTO
    {
        public string ClientID { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string ShopID { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public string MemberType { get; set; } = string.Empty;
        public int PageNo { get; set; } = 1;
        public int PageSize { get; set; } = 100;
        public required string SortColumn { get; set; }
        public bool SortAsc { get; set; } = true;

    }

    public class ClientInfoGetRequestDTO
    {
        public required string ClientID { get; set; }
    }

    public class ClientInfoUpdateRequestDTO
    {
        public required string ClientID { get; set; }
        public required string ClientName { get; set; }
        public required string Address { get; set; }
        public required string DOB { get; set; }
        public required string Gender { get; set; }
    }

    public class ClientProcessRequestDTO
    {
        public string ClientID { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string DOB { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public string LoginID { get; set; } = string.Empty;
    }

    public class ClientGetDoctorInstructionRequestDTO
    {
        public required string ClientID { get; set; }
    }

    public class ClientProcessDoctorInstructionRequestDTO
    {
        public required string ClientID { get; set; }
        public required string Notes { get; set; }
        public required string ItemList { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
        public required string InstructionCD { get; set; }
    }

    public class ClientPaymentRequestDTO
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public string PaymentDate { get; set; } = string.Empty;
        public string PaymentMonth { get; set; } = string.Empty;
        public string PaymentYear { get; set; } = string.Empty;
        public string ShopID { get; set; } = string.Empty;
    }
    public class ClientPaymentProcessRequestDTO
    {
        public string TransactionID { get; set; } = "";
        public required string InvoiceNo { get; set; }
        public required string ClientID { get; set; }
        public required string PaymentDate { get; set; }
        public required string MembershipID { get; set; }
        public required string PaymentType { get; set; }
        public required string Amount { get; set; }
        public required string Mode { get; set; }
        public required string LoginID { get; set; }
    }

    public class ClientBookingRequestDTO
    {
        public string YYYY { get; set; } = string.Empty;
        public string MM { get; set; } = string.Empty;
    }

    public class ClientBookingProcessRequestDTO
    {
        public string BookingCD { get; set; } = string.Empty;
        public required string ClientID { get; set; }
        public required string BookingDate { get; set; }
        public required string BookingSlot { get; set; }
        public required string Notes { get; set; }
        public string CancelReason { get; set; } = string.Empty;
        public required string LoginID { get; set; }
        public required string Mode { get; set; }
    }

    public class ClientReportGetRequestDTO
    {
        public string YYYY { get; set; } = string.Empty;
        public string MM { get; set; } = string.Empty;
        public required string ReportType { get; set; }
    }

    public class ClientMemberCardProcessRequuestDTO
    {
        public required string ClientID { get; set; }
        public required string MemberCardCD { get; set; }
        public required string LoginID { get; set; }
        public required string Mode { get; set; }
    }

    public class ClientCurrentMemberShipGetRequestDTO
    {
        public required string ClientID { get; set; }
    }

    public class ClientMemberCardGetRequestDTO
    {
        public required string ClientID { get; set; }
    }

    public class ClientMemberCardTransactionsGetRequestDTO
    {
        public required string ClientMemberCardID { get; set; }
    }
}