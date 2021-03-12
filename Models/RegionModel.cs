using System.Collections.Generic;

namespace KPProject.Models
{
    public class RegionModel
    {
        public int Id { get; set; }
        public string RegionName { get; set; }
        public virtual List<UserRegion> UserRegion { get; set; }
    }
}