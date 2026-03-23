using ClosedXML.Excel;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Holiday;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/membercard")]
    public class MemberCardController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _memberCardRepo = repo;

        [HttpGet("getmembercards")]
        [Authorize]
        public async Task<IActionResult> GetMemberCards()
        {
            var parameters = new DynamicParameters();
            var response = await _memberCardRepo.ExecAsync<object>("truebeauty_MemberCard_Select", parameters, false);

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