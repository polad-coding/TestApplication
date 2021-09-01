using KPProject.Models;
using System.Collections.Generic;

namespace KPProject.ViewModels
{
    public class SurveySecondStageSaveRequestViewModel
    {
        public List<ValueModel> values { get; set; }
        public int surveyId { get; set; }
    }
}
