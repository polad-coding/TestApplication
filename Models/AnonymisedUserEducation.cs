namespace KPProject.Models
{
    public class AnonymisedUserEducation
    {
        public int AnonymisedUserId { get; set; }
        public AnonymisedUser AnonymisedUser { get; set; }
        public int EducationId { get; set; }
        public EducationModel Education { get; set; }
    }
}
