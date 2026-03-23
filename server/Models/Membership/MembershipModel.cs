namespace server.Models.Membership
{
    public class MembershipTypeProcessRequestDTO
    {
        public required string MembershipTypeID { get; set; }
        public required string Description { get; set; }
        public required string DurationMonths { get; set; }
        public required string Amount { get; set; }
        public required string Cashback { get; set; }
        public required string LoginID { get; set; }
    }

    public class MembershipGetRequestDTO
    {
        public string MembershipID { get; set; } = string.Empty;
        public string ClientID { get; set; } = string.Empty;
        public string MembershipTypeID { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class MembershipProcessRequestDTO
    {
        public required string MembershipID { get; set; }
        public required string MembershipTypeID { get; set; }
        public required string ClientID { get; set; }
        public required string StartDate { get; set; }
        public required string ExpiredDate { get; set; }
        public required string AmountItemCD { get; set; }
        public required string CashbackItemCD { get; set; }
        public required string Note { get; set; }
        public required string LoginID { get; set; }
        public required string Mode { get; set; }
    }

    public class MembershipTransactionGetRequestDTO
    {
        public required string MembershipID { get; set; }
    }

    public class MembershipClientsGetRequestDTO
    {
        public required string MembershipID { get; set; }
    }

    public class MembershipClientsProcessRequestDTO
    {
        public required string MembershipID { get; set; }
        public required string ClientID { get; set; }
        public required string IsPrimary { get; set; }
        public required string LoginID { get; set; }
        public required string Mode { get; set; }
    }

    public class ClienActiveMembershipGetRequestDTO
    {
        public required string ClientID { get; set; }
    }
}