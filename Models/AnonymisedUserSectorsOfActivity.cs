namespace KPProject.Models
{
    public class AnonymisedUserSectorsOfActivity
    {
        public int AnonymisedUserId { get; set; }
        public AnonymisedUser AnonymisedUser { get; set; }
        public int SectorOfActivityId { get; set; }
        public SectorOfActivityModel SectorOfActivity { get; set; }
    }
}
