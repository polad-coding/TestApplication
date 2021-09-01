namespace KPProject.Models
{
    public class ValueModel
    {
        public int Id { get; set; }
        public char Character { get; set; }
        public int ASCIIValue { get; set; }
        public int PerspectiveId { get; set; }
        public PerspectiveModel perspective { get; set; }
    }
}
