using System.Collections.Generic;

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
