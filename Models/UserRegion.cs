using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class UserRegion
    {
        public string ApplicationUserId { get; set; }
        public  virtual ApplicationUser User { get; set; }
        public int RegionId { get; set; }
        public virtual RegionModel Region { get; set; }
    }
}
