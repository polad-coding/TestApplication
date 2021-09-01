using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace KPProject.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int GenderId { get; set; }
        public Gender Gender { get; set; } = new Gender();
        public virtual List<UserRegion> Regions { get; set; } = new List<UserRegion>();
        public string ProfessionalEmail { get; set; }
        public string Bio { get; set; }
        public virtual List<UserLanguage> Languages { get; set; } = new List<UserLanguage>();
        public string Website { get; set; }
        public string MyerBriggsCode { get; set; }
        public string ProfileImageName { get; set; }
        public virtual List<ApplicationUserCertification> Certifications { get; set; } = new List<ApplicationUserCertification>();
        public List<ApplicationUserAssociatedCoupon> AssociatedCoupons { get; set; }
        public List<ApplicationUserPosition> Positions { get; set; }
        public List<ApplicationUserEducation> Educations { get; set; }
        public List<ApplicationUserSectorOfActivity> SectorsOfActivities { get; set; }
        public int? AgeGroupModelId { get; set; }
        public AgeGroup AgeGroup { get; set; }

    }
}
