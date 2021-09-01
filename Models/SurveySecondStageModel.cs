namespace KPProject.Models
{
    public class SurveySecondStageModel
    {
        public SurveyModel Survey { get; set; }
        public int SurveyId { get; set; }
        public ValueModel Value { get; set; }
        public int ValueId { get; set; }
    }
}
