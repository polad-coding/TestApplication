﻿namespace KPProject.Models
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
