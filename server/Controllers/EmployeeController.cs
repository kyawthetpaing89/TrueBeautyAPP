using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;
using server.Models.Client;
using server.Utilities;
using Microsoft.AspNetCore.Authorization;
using server.Models.Employee;
using Dapper;
using Microsoft.Extensions.Caching.Memory;

namespace server.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController(IDataRepository<BaseModel> repo, IMemoryCache cache) : ControllerBase
    {
        private readonly IDataRepository<BaseModel> _employeeRepo = repo;
        private readonly IMemoryCache _cache = cache;

        [HttpPost("getemployee")]
        [Authorize]
        public async Task<IActionResult> GetEmployee([FromBody] EmployeeGetRequestDTO employee)
        {
            var parameters = Converter.DtoToParam(employee);
            var response = await _employeeRepo.ExecAsync<object>("truebeauty_Employee_Select", parameters, false);

            if (response.Status == true)
            {
                return Ok(new ApiResponse<object>(true, "Data Found!", response));
            }
            else
            {
                return StatusCode(500, response);
            }
        }

        [HttpGet("getemployeeposition")]
        [Authorize]
        public async Task<IActionResult> GetEmployeePosition()
        {
            if (!_cache.TryGetValue(CacheKeys.EmployeePosition, out object? cachedData))
            {
                var response = await _employeeRepo.ExecAsync<object>(
                    "truebeauty_EmployeePosition_Select",
                    new DynamicParameters(),
                    false
                );

                if (response.Status != true)
                {
                    return StatusCode(500, response);
                }

                // Cache options
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6),
                    SlidingExpiration = TimeSpan.FromHours(1)
                };

                _cache.Set(CacheKeys.EmployeePosition, response, cacheOptions);
                cachedData = response;
            }

            return Ok(new ApiResponse<object>(true, "Data Found!", cachedData));
        }

        [HttpGet("getemployeebank")]
        [Authorize]
        public async Task<IActionResult> GetEmployeeBank()
        {

            if (!_cache.TryGetValue(CacheKeys.BankList, out object? cachedData))
            {
                var response = await _employeeRepo.ExecAsync<object>(
                    "truebeauty_EmployeeBank_Select",
                    new DynamicParameters(),
                    false);

                if (response.Status != true)
                {
                    return StatusCode(500, response);
                }

                // Cache options
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12),
                    SlidingExpiration = TimeSpan.FromHours(2)
                };

                _cache.Set(CacheKeys.BankList, response, cacheOptions);
                cachedData = response;
            }

            return Ok(new ApiResponse<object>(true, "Data Found!", cachedData));
        }

        [HttpPost("employeeprocess")]
        [Authorize]
        public async Task<IActionResult> EmployeeProcess([FromBody] EmployeeProcessRequestDTO item)
        {
            var parameters = Converter.DtoToParam(item);
            var response = await _employeeRepo.ExecAsync<object>("truebeauty_Employee_Process", parameters, false);

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