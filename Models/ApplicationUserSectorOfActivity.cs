namespace KPProject.Models
{
    public class ApplicationUserSectorOfActivity
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int SectorOfActivityId { get; set; }
        public SectorOfActivityModel SectorOfActivity { get; set; }
    }
}
