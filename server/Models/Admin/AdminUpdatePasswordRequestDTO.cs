namespace server.Models.Admin
{
    public class AdminUpdatePasswordRequestDTO
    {
        public required string LoginID { get; set; }
        public required string CurrentPassword { get; set; }
        public required string LoginPassword { get; set; }
    }
}