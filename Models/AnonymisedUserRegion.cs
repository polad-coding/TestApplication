using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
