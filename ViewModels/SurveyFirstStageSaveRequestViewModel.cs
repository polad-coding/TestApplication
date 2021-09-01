using System.Collections.Generic;

namespace KPProject.Models
{
    public class SurveyFirstStageSaveRequestViewModel
    {
        public List<ValueModel> values { get; set; }
        public int surveyId { get; set; }
    }
}
