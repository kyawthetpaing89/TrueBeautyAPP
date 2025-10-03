using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.DoctorInstruction;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/doctorinstruction")]
    public class DoctorInstructionController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _itemRepo = repo;

        [HttpPost("getlastdoctorinstruction")]
        [Authorize]
        public async Task<IActionResult> Getitem([FromBody] DoctorInstructionGetLastRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_DoctorInstruction_SelectLastRecord", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }
    }
}