using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class CreateSurveyViewModel
    {
        public string Code { get; set; }
        public string SurveyPractitionerId { get; set; }
        public int NumberOfUsages { get; set; }
    }
}
