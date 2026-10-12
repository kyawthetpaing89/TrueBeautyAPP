using ClosedXML.Excel;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Holiday;
using server.Models.Membership;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/membership")]
    public class MembershipController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _membershipRepo = repo;

        [HttpGet("getmembershiptype")]
        [Authorize]
        public async Task<IActionResult> GetMembershipTypes()
        {
            var parameters = new DynamicParameters();
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipType_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpGet("getmembershiptypeitem")]
        [Authorize]
        public async Task<IActionResult> GetMembershipTypeItem()
        {
            var parameters = new DynamicParameters();
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipTypeItem_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("membershiptypeprocess")]
        [Authorize]
        public async Task<IActionResult> MembershipTypeProcess([FromBody] MembershipTypeProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipType_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getmembership")]
        [Authorize]
        public async Task<IActionResult> GetMembership([FromBody] MembershipGetRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_Membership_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("membershipprocess")]
        [Authorize]
        public async Task<IActionResult> MembershipProcess([FromBody] MembershipProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_Membership_Process", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getmembershiptransaction")]
        [Authorize]
        public async Task<IActionResult> GetMembershipTransaction([FromBody] MembershipTransactionGetRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipTransaction_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getmembershipclients")]
        [Authorize]
        public async Task<IActionResult> GetMembershipClients([FromBody] MembershipClientsGetRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipClients_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("membershipclientprocess")]
        [Authorize]
        public async Task<IActionResult> MembershipClientProcess([FromBody] MembershipClientsProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipClients_Process", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientactivemembership")]
        [Authorize]
        public async Task<IActionResult> GetClientActiveMembership([FromBody] ClienActiveMembershipGetRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipClients_ActiveMembershipSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("printMembershipTransaction")]
        [Authorize]
        public async Task<IActionResult> PrintMembershipTransaction([FromBody] MembershipPrintRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _membershipRepo.ExecAsync<object>("truebeauty_MembershipTransaction_Print", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("exportmembership")]
        [Authorize]
        public async Task<IActionResult> ExportMembership([FromBody] MembershipGetRequestDTO membership)
        {
            var parameters = Converter.DtoToParam(membership);
            var resultTable = await _membershipRepo.ExecDataTableAsync("truebeauty_Membership_Select", parameters);


            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(resultTable, "membership");

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var fileName = "Membership.xlsx";

            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }
    }
}