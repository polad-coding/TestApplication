using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class OrderViewModel
    {
        public string CouponBody { get; set; }
        public int NumberOfUsages { get; set; }
        public int DefaultNumberOfUsages { get; set; }
    }
}
