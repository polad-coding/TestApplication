using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class SurveyFirstStageSaveRequestViewModel
    {
        public List<ValueModel> values { get; set; }
        public int surveyId { get; set; }
    }
}
