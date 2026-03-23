using ClosedXML.Excel;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Item;
using server.Utilities;

namespace server.Controllers
{
    [ApiController]
    [Route("api/item")]
    public class ItemController(IDataRepository<BaseModel> repo) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _itemRepo = repo;

        [HttpPost("getitem")]
        public async Task<IActionResult> Getitem([FromBody] ItemListRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpGet("getitemsummary")]
        [Authorize]
        public async Task<IActionResult> Getitemsummary()
        {

            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_SummarySelect", new DynamicParameters(), false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Sucess!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("itemprocess")]
        [Authorize]
        public async Task<IActionResult> ItemProcess([FromBody] ItemProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getitempricelog")]
        [Authorize]
        public async Task<IActionResult> Getitem([FromBody] ItemPriceLogRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemPriceLog_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("exportitem")]
        [Authorize]
        public async Task<IActionResult> ExportInvoice([FromBody] ItemExportRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var resultTable = await _itemRepo.ExecDataTableAsync("truebeauty_Item_Export", parameters);


            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(resultTable, "Items");

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Seek(0, SeekOrigin.Begin);

            var fileName = "Item.xlsx";

            return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }

        [HttpPost("getitempurchasing")]
        [Authorize]
        public async Task<IActionResult> GetitemPurchasing([FromBody] ItemPurchasingRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemPurchasing_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("itempurchasingprocess")]
        [Authorize]
        public async Task<IActionResult> GetitemPurchasing([FromBody] ItemPurchasingProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemPurchasing_Process", parameters, true);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getpurchaseitemlist")]
        [Authorize]
        public async Task<IActionResult> GetPurchasedItemList([FromBody] ItemListPurchaseRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_PurchaseItemSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getitemusage")]
        [Authorize]
        public async Task<IActionResult> getitemusage([FromBody] ItemUsageRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemUsage_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("itemusageprocess")]
        [Authorize]
        public async Task<IActionResult> getitemusage([FromBody] ItemUsageProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemUsage_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getiteminventory")]
        [Authorize]
        public async Task<IActionResult> getiteminventory([FromBody] ItemInventoryRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_InventorySelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("itempurchasingpaymentprocess")]
        [Authorize]
        public async Task<IActionResult> itempurchasingpaymentprocess([FromBody] ItemPurchasingPaymentProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemPurchasingPayment_Process", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("getitempurchasingpayment")]
        [Authorize]
        public async Task<IActionResult> getitempurchasingpayment([FromBody] ItemPurchasingPaymentRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_ItemPurchasingPayment_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("gettopsellingitem")]
        public async Task<IActionResult> GetTopSellingItem([FromBody] ItemTopSellingRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_TopSellingSelect", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Success!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpPost("moblie/getclientitem")]
        public async Task<IActionResult> GetClientitem([FromBody] ClientItemRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _itemRepo.ExecAsync<object>("truebeauty_Item_Select", parameters, false);

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