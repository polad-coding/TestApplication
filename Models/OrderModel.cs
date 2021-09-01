namespace KPProject.Models
{
    public class OrderModel
    {
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public string CodeBody { get; set; }
        public int NumberOfUsages { get; set; }
    }
}
