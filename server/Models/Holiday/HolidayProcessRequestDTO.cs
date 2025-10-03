using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Holiday
{
    public class HolidayProcessRequestDTO
    {
        public required string Mode { get; set; }
        public required string HolidayDate { get; set; }
        public required string Description { get; set; }
        public required string LoginID { get; set; }
    }   
}