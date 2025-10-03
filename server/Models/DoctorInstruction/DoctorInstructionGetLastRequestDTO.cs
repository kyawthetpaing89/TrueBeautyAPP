namespace server.Models.DoctorInstruction
{
    public class DoctorInstructionGetLastRequestDTO
    {
        public required string ClientID { get; set; }
        public required string InvoiceDate { get; set; }
    }
}