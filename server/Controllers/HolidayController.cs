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
    [Route("api/holiday")]
    public class HolidayController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _holidayRepo = repo;

        [HttpPost("getholidays")]
        [Authorize]
        public async Task<IActionResult> GetHolidays([FromBody] HolidayGetRequestDTO holiday)
        {
            var parameters = Converter.DtoToParam(holiday);
            var response = await _holidayRepo.ExecAsync<object>("truebeauty_Holiday_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("holidaysprocess")]
        [Authorize]
        public async Task<IActionResult> HolidaysProcess([FromBody] HolidayProcessRequestDTO holiday)
        {
            var parameters = Converter.DtoToParam(holiday);
            var response = await _holidayRepo.ExecAsync<object>("truebeauty_Holiday_Process", parameters, false);

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