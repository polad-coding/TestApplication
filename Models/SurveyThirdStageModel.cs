using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class SurveyThirdStageModel
    {
        public SurveyModel Survey { get; set; }
        public int SurveyId { get; set; }
        public ValueModel Value { get; set; }
        public int ValueId { get; set; }
        public int ValuePriority { get; set; }
    }
}
