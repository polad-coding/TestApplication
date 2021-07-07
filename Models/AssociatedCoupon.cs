using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class AssociatedCoupon
    {
        public int Id { get; set; }
        public string CouponBody { get; set; }
        public double DiscountRate { get; set; }
        public int? NumberOfUsagesLeft { get; set; } 
        public List<ApplicationUserAssociatedCoupon> ApplicationUserAssociatedCoupons { get; set; }
    }
}
