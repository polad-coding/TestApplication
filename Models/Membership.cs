using System;

namespace KPProject.Models
{
    public class Membership
    {
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public string UserId { get; set; }
        public DateTime ValidTill { get; set; }
    }
}
