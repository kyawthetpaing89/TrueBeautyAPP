using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using server.Models;

namespace server.Data
{
    public class DataRepository<T>(IConfiguration configuration, ILogger<DataRepository<T>> logger) : IDataRepository<T> where T : BaseModel, new()
    {
        private readonly string _connectionString = configuration.GetConnectionString("CIMS") ?? "";
        private readonly ILogger<DataRepository<T>> _logger = logger;

        public async Task<ApiResponse<List<TResult>>> ExecAsync<TResult>(string storeProc, object param, bool useTransaction = false)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = useTransaction ? connection.BeginTransaction() : null;

            try
            {
                var result = (await connection.QueryAsync<TResult>(
                    storeProc,
                    param,
                    transaction: transaction,
                    commandType: CommandType.StoredProcedure
                )).ToList();

                transaction?.Commit();

                return new ApiResponse<List<TResult>>(true, "Execution successful", result);
            }
            catch (SqlException ex)
            {
                transaction?.Rollback();
                _logger.LogError(ex, "SQL error occurred while executing {StoreProc}: {Message}", storeProc, ex.Message);
                return new ApiResponse<List<TResult>>(false, "SQL error occurred: " + ex.Message);
            }
            catch (Exception ex)
            {
                transaction?.Rollback();
                _logger.LogError(ex, "Unexpected error occurred while executing {StoreProc}: {Message}", storeProc, ex.Message);
                return new ApiResponse<List<TResult>>(false, "Unexpected error occurred: " + ex.Message);
            }
        }

        public async Task<DataTable> ExecDataTableAsync(string storedProc, DynamicParameters param)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(storedProc, connection);
            command.CommandType = CommandType.StoredProcedure;

            // Attach parameters from Dapper's DynamicParameters
            foreach (var p in param.ParameterNames)
            {
                var dp = param.Get<dynamic>(p);
                command.Parameters.AddWithValue(p, dp ?? DBNull.Value);
            }

            using var adapter = new SqlDataAdapter(command);
            var dataTable = new DataTable();
            adapter.Fill(dataTable);

            return dataTable;
        }

    }
}