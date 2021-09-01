using System.Collections.Generic;

namespace KPProject.Models
{
    public class AnonymisedUser
    {
        public int Id { get; set; }
        public Gender Gender { get; set; }
        public List<AnonymisedUserRegion> Regions { get; set; } = new List<AnonymisedUserRegion>();
        public List<AnonymisedUserEducation> Educations { get; set; } = new List<AnonymisedUserEducation>();
        public List<AnonymisedUserPosition> Positions { get; set; } = new List<AnonymisedUserPosition>();
        public List<AnonymisedUserSectorsOfActivity> SectorsOfActivities { get; set; } = new List<AnonymisedUserSectorsOfActivity>();
        public int AgeGroupId { get; set; }
        public AgeGroup AgeGroup { get; set; }
        public string MyerBriggsCode { get; set; }
    }
}
