namespace KPProject.ViewModels
{
    public class SurveyResultViewModel
    {
        public string Code { get; set; }
        public string TakenOn { get; set; }
        public int SurveyId { get; set; }
        public string PractitionerFullName { get; set; }
        public string TakersEmail { get; set; }
        public string PractitionerId { get; set; }
        public bool IsCompleated { get; set; }
        public bool FirstStagePassed { get; set; }
        public UserViewModel SurveyTakerUser { get; set; }
    }
}
