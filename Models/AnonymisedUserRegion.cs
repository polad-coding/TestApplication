namespace KPProject.Models
{
    public class AnonymisedUserRegion
    {
        public int AnonymisedUserId { get; set; }
        public virtual AnonymisedUser AnonymisedUser{ get; set; }
        public int RegionId { get; set; }
        public virtual RegionModel Region { get; set; }
    }
}
