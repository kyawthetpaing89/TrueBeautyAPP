namespace server.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(string userID, string userRole, string name, string shopID);
        string GenerateRefreshToken();
    }
}