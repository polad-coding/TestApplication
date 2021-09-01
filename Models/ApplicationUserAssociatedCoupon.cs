namespace KPProject.Models
{
    public class ApplicationUserAssociatedCoupon
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int AssociatedCouponId { get; set; }
        public AssociatedCoupon AssociatedCoupon { get; set; }
    }
}
