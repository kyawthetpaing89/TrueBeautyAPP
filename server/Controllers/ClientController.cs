using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Client;
using server.Utilities;
using Dapper;
using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [ApiController]
    [Route("api/client")]
    public class ClientController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _clientRepo = repo;

        [HttpPost("getclientpayment")]
        [Authorize]
        public async Task<IActionResult> GetClientPayment([FromBody] ClientPaymentRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientPayment_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclient")]
        [Authorize]
        public async Task<IActionResult> GetClient([FromBody] ClientGetRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("clientprocess")]
        [Authorize]
        public async Task<IActionResult> ClientProcess([FromBody] ClientProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("gettreatmentcheckin")]
        [Authorize]
        public async Task<IActionResult> GetTreatmentCheckin([FromBody] ClientGetTreatmentCheckinRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientTreatment_CheckinSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("gettreatment")]
        [Authorize]
        public async Task<IActionResult> GetTreatment([FromBody] ClientTreatmentGetRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientTreatment_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("treatmentcheckinprocess")]
        [Authorize]
        public async Task<IActionResult> TreatmentCheckinProcess([FromBody] ClientTreatmentCheckinProcessRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientTreatment_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getdoctorinstruction")]
        [Authorize]
        public async Task<IActionResult> GetDoctorInstruction([FromBody] ClientGetDoctorInstructionRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_DoctorInstruction_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("processdoctorinstruction")]
        [Authorize]
        public async Task<IActionResult> GetDoctorInstruction([FromBody] ClientProcessDoctorInstructionRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_DoctorInstruction_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("processinvoicepayment")]
        [Authorize]
        public async Task<IActionResult> ProcessInvoicePayment([FromBody] ClientPaymentProcessRequestDTO client)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;


            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientPayment_Process", parameters, true);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpGet("getdashboardinfo")]
        [Authorize]
        public async Task<IActionResult> GetClient()
        {
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_DashboardSelect", new DynamicParameters(), false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientbooking")]
        [Authorize]
        public async Task<IActionResult> GetClientBooking([FromBody] ClientBookingRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientBooking_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("clientbookingprocess")]
        [Authorize]
        public async Task<IActionResult> ClientBookingProcess([FromBody] ClientBookingProcessRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientBooking_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientreport")]
        [Authorize]
        public async Task<IActionResult> GetClientVisitor([FromBody] ClientReportGetRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_ReportSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("mobile/clientlogin")]
        public async Task<IActionResult> Clientlogin([FromBody] ClientLoginRequestDTO client)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_LoginCheck", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("mobile/clientchangepassword")]
        public async Task<IActionResult> ClientChangePassword([FromBody] ClientChangePasswordRequestDTO client)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_PasswordChange", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("mobile/getclientinfo")]
        public async Task<IActionResult> GetClientInfo([FromBody] ClientInfoGetRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_InfoSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("mobile/clientinfoupdate")]
        public async Task<IActionResult> ClientInfoUpdate([FromBody] ClientInfoUpdateRequestDTO client)
        {
            var parameters = Converter.DtoToParam(client);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_InfoUpdate", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("clientmembercardprocess")]
        [Authorize]
        public async Task<IActionResult> ClientMemberCardProcess([FromBody] ClientMemberCardProcessRequuestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientMemberCard_Process", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientcurrentmembership")]
        [Authorize]
        public async Task<IActionResult> GetClientCurrentMemberShip([FromBody] ClientCurrentMemberShipGetRequestDTO request)
        {
            var parameters = Converter.DtoToParam(request);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_Client_CurrentMembershipSelect", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientmembercard")]
        [Authorize]
        public async Task<IActionResult> GetClientMemberCard([FromBody] ClientMemberCardGetRequestDTO request)
        {
            var parameters = Converter.DtoToParam(request);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientMemberCard_Select", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getclientmembercardtransactions")]
        [Authorize]
        public async Task<IActionResult> GetClientMemberCardTransactions([FromBody] ClientMemberCardTransactionsGetRequestDTO request)
        {
            var parameters = Converter.DtoToParam(request);
            var response = await _clientRepo.ExecAsync<object>("truebeauty_ClientMemberCardTransactions_Select", parameters, true);

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