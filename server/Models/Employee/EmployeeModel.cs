namespace server.Models.Employee
{
    public class EmployeeGetRequestDTO
    {
        public string EmployeeID { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string PositionCD { get; set; } = string.Empty;
    }

    public class EmployeeProcessRequestDTO
    {
        public string EmployeeID { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string PositionCD { get; set; } = string.Empty;

        public string? PhoneNo { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? BankCD { get; set; } = string.Empty;
        public string? BankAccount { get; set; } = string.Empty;
        public string? DOB { get; set; } = string.Empty;
        public string? JoinedDate { get; set; } = string.Empty;
        public string? NRC { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string? Salary { get; set; } = string.Empty;
        public string Mode { get; set; } = string.Empty;
        public string LoginID { get; set; } = string.Empty;
    }
}