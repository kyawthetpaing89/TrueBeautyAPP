using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models.Holiday
{
    public class HolidayGetRequestDTO
    {
        public required string YYYY { get; set; }
        public required string MM { get; set; } 
    }
}