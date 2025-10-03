using System.Data;
using Dapper;
using server.Models;

namespace server.Data
{
    public interface IDataRepository<T> where T : BaseModel
    {
        Task<ApiResponse<List<TResult>>> ExecAsync<TResult>(string storeProc, object param, bool useTransaction = false);
        Task<DataTable> ExecDataTableAsync(string storedProc, DynamicParameters param);
    }
}