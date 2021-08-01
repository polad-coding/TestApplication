using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class AnonymisedUser
    {
        public int Id { get; set; }
        public Gender Gender { get; set; }
        public List<AnonymisedUserRegion> AnonymisedUserRegions { get; set; }
        public List<AnonymisedUserEducation> Educations { get; set; }
        public List<AnonymisedUserPosition> Positions { get; set; }
        public List<AnonymisedUserSectorsOfActivity> SectorsOfActivities { get; set; }
        public int AgeGroupId { get; set; }
        public AgeGroupModel AgeGroup { get; set; }
        public string MyerBriggsCode { get; set; }
    }
}
