namespace KPProject.ViewModels
{
    public class GetCouponRequestResponseViewModel
    {
        public int Id { get; set; }
        public string CouponBody { get; set; }
        public int? NumberOfUsagesLeft { get; set; }
        public double DiscountRate { get; set; }
    }
}
