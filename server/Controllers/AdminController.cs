using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Admin;
using server.Services;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController(IDataRepository<BaseModel> repo, ITokenService tokenService) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _userRepo = repo;
        private readonly ITokenService _tokenService = tokenService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequestDTO admin)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(admin);
            var response = await _userRepo.ExecAsync<AdminLoginResponseDTO>("truebeauty_Admin_LoginCheck", parameters, false);

            if (response.Status == true)
            {
                if (response.Data != null && response.Data.Count != 0)
                {
                    var accessToken = _tokenService.GenerateAccessToken(admin.LoginID, response.Data[0].UserRole, response.Data[0].AdminName, response.Data[0].ShopID);
                    // var refreshToken = _tokenService.GenerateRefreshToken();
                    // var refreshTokenExpiredDate = DateTime.UtcNow.AddYears(1);

                    // AdminRefreshTokenUpdateDTO userRefreshToken = new()
                    // {
                    //     LoginID = admin.LoginID,
                    //     DeviceID = admin.DeviceID,
                    //     RefreshToken = refreshToken,
                    //     RefreshTokenExpiredDate = refreshTokenExpiredDate
                    // };

                    // var paramUserRefreshToken = Converter.DtoToParam(userRefreshToken);

                    // await _userRepo.ExecAsync<AdminRefreshTokenUpdateDTO>("sp_Users_UpdateRefreshToken", paramUserRefreshToken, false);

                    // // Store refresh token in a HttpOnly Secure cookie (prevents XSS attacks)
                    // Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                    // {
                    //     HttpOnly = true,
                    //     Secure = false,
                    //     SameSite = SameSiteMode.Lax,
                    //     Expires = refreshTokenExpiredDate
                    // });

                    return Ok(new ApiResponse<object>(true, "Login successful", new { accessToken, user = response.Data[0] }));
                }
                else
                {
                    return Unauthorized(new ApiResponse<object>(false, "Login failed. Invalid credentials.", ""));
                }
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("updatepassword")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] AdminUpdatePasswordRequestDTO admin)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(admin);

            var response = await _userRepo.ExecAsync<object>("truebeauty_Admin_ChangePassword", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }
    }
}