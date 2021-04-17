using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class SurveyThirdStageSaveRequestViewModel
    {
        public List<PrioritizedValueViewModel> values { get; set; }
        public int surveyId { get; set; }
    }
}
