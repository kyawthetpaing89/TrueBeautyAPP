namespace server.Models.Admin
{
    public class AdminLoginRequestDTO
    {

        public required string LoginID { get; set; }
        public required string DeviceID { get; set; }
        public required string LoginPassword { get; set; }
    }
}