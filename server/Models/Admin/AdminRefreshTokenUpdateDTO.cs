namespace server.Models.Admin
{
    public class AdminRefreshTokenUpdateDTO
    {
        public required string LoginID { get; set; }
        public required string RefreshToken { get; set; }
        public required string DeviceID { get; set; }
        public DateTime? RefreshTokenExpiredDate { get; set; }
    }
}