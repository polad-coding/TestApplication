namespace KPProject.Models
{
    public class ApplicationUserPosition
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int PositionId { get; set; }
        public PositionModel Position { get; set; }
    }
}
