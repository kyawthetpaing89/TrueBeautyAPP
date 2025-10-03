using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Admin
{
    public class AdminLoginResponseDTO
    {
        public required string AdminCD { get; set; }
        public required string AdminName { get; set; }
        public required string LoginID { get; set; }
        public required string LoginPassword { get; set; }
        public required string ProfilePhoto { get; set; }
        public required string UserRole { get; set; }
    }
}