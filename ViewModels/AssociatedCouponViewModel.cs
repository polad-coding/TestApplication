using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class AssociatedCouponViewModel
    {
        public string CouponBody { get; set; }
        public int NumberOfUsages { get; set; }
        public List<string> AssociatedUsersEmails { get; set; }
        public double DiscountRate { get; set; }
    }
}
