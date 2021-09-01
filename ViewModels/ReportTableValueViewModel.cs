namespace KPProject.ViewModels
{
    public class ReportTableValueViewModel
    {
        public bool SelectedAtFirstStage { get; set; }
        public bool SelectedAtSecondStage { get; set; }
        public int ThirdStagePriority { get; set; }
        public int ValueId { get; set; }
        public char ValueCharacter { get; set; }
        public int PerspectiveId { get; set; }
    }
}
