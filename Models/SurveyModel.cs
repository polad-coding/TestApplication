using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class SurveyModel
    {
        public int Id { get; set; }
        public ApplicationUser SurveyTakerUser { get; set; }
        public string SurveyTakerUserId { get; set; }
        public AnonymisedUser AnonymisedUser { get; set; }
        public int? AnonymisedUserId { get; set; }
        public int Seed { get; set; }
        public ApplicationUser PractitionerUser { get; set; }
        public string PractitionerUserId { get; set; }
        public string Code { get; set; }
        public DateTime TakenOn { get; set; }
        public bool FirstStagePassed { get; set; }
        public bool SecondStagePassed { get; set; }
        public bool ThirdStagePassed { get; set; }
    }
}
