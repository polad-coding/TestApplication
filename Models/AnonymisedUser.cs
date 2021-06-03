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
        public string Education { get; set; }
        public string Position { get; set; }
        public string SectorOfActivity { get; set; }
        public int Age { get; set; }
        public string MyerBriggsCode { get; set; }
    }
}
