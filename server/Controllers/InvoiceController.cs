using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Invoice;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/invoice")]
    public class InvoiceController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _invoiceRepo = repo;

        [HttpPost("monthlysales")]
        [Authorize]
        public async Task<IActionResult> GetBookDetail([FromBody] InvoiceMonthlySalesRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_MonthlySales_Select", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }


        [HttpPost("getinvoiceclientdata")]
        [Authorize]
        public async Task<IActionResult> GetInvoiceClientData([FromBody] InvoiceClinetDataRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_ClientDataSelect", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("gettopsellingitem")]
        public async Task<IActionResult> GetTopSellingItem([FromBody] InvoiceTopSellingItemRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_TopSellingItemSelect", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getsalesreport")]
        [Authorize]
        public async Task<IActionResult> GetDailySalesReport([FromBody] InvoiceDailySalesRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Report_SalesReport", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }


        [HttpPost("getinvoice")]
        [Authorize]
        public async Task<IActionResult> GetInvoice([FromBody] InvoiceGetRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_Select", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getinvoicedetail")]
        public async Task<IActionResult> GetInvoiceDetail([FromBody] InvoiceDetailGetRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_InvoiceDetail_Select", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("processinvoicedetail")]
        [Authorize]
        public async Task<IActionResult> ProcessInvoiceDetail([FromBody] InvoiceDetailProcessRequestDTO invoice)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;


            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_InvoiceDetail_Process", parameters, true);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("processinvoice")]
        [Authorize]
        public async Task<IActionResult> ProcessInvoiceDetail([FromBody] InvoiceProcessRequestDTO invoice)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;


            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_Process", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("invoicecopyrequest")]
        [Authorize]
        public async Task<IActionResult> InvoiceCopyRequest([FromBody] InvocieCopyRequestDTO invoice)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_CopyRequest", parameters, true);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("invoicecopyaccesscheck")]
        [Authorize]
        public async Task<IActionResult> InvoiceCopyAccessCheck([FromBody] InvoiceCopyAccessCheckDTO invoice)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;

            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_CopyAccessCheck", parameters, true);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("invociecopyconfirm")]
        [Authorize]
        public async Task<IActionResult> InvoiceCopyConfirm([FromBody] InvoiceCopyConfirmDTO invoice)
        {
            var validationResponse = ValidationHelper.ValidateModel(ModelState);
            if (validationResponse != null)
                return validationResponse;


            var parameters = Converter.DtoToParam(invoice);
            var response = await _invoiceRepo.ExecAsync<object>("truebeauty_Invoice_CopyConfirm", parameters, false);

            if (response.Status)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("exportinvoice")]
        [Authorize]
        public async Task<IActionResult> ExportInvoice([FromBody] InvoiceExportRequestDTO invoice)
        {
            var parameters = Converter.DtoToParam(invoice);
            var resultTable = await _invoiceRepo.ExecDataTableAsync("truebeauty_InvoiceExport", parameters);


            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(resultTable, "Invoices");

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var fileName = "Invoice.xlsx";

            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }
    }
}