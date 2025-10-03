namespace server.Models
{
    public class ApiResponse<T>(bool status, string message, T? data = default)
    {
        public bool Status { get; set; } = status;
        public string Message { get; set; } = message;
        public T? Data { get; set; } = data;
    }
}