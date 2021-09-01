using System.Collections.Generic;

namespace KPProject.ViewModels
{
    public class SurveyThirdStageSaveRequestViewModel
    {
        public List<PrioritizedValueViewModel> values { get; set; }
        public int surveyId { get; set; }
    }
}
