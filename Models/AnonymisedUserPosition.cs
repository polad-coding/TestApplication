namespace KPProject.Models
{
    public class AnonymisedUserPosition
    {
        public int AnonymisedUserId { get; set; }
        public AnonymisedUser AnonymisedUser { get; set; }
        public int PositionId { get; set; }
        public PositionModel Position { get; set; }
    }
}
