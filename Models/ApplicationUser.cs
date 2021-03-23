using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public string Education { get; set; }
        public string SectorOfActivity { get; set; }
        public string Position { get; set; }
        public string ProfessionalEmail { get; set; }
        public string Bio { get; set; }
        public virtual List<UserLanguage> Languages { get; set; } = new List<UserLanguage>();
        public string Website { get; set; }
        public string MyerBriggsCode { get; set; }
        public string ProfileImageName { get; set; }
    }
}
