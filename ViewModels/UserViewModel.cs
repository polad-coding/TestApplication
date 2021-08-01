using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class UserViewModel
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Email { get; set; }
        public List<RegionModel> Regions { get; set; }
        public List<PositionModel> Positions { get; set; }
        public List<EducationModel> Educations { get; set; }
        public List<SectorOfActivityModel> SectorsOfActivities { get; set; }
        public AgeGroupModel AgeGroup { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfessionalEmail { get; set; }
        public string Bio { get; set; }
        public List<LanguageModel> Languages { get; set; }
        public string Website { get; set; }
        public string MyerBriggsCode { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string ProfileImageName { get; set; }
    }
}
