using System.Collections.Generic;

namespace KPProject.Models
{
    public class Certification
    {
        public int Id { get; set; }
        public List<ApplicationUserCertification> ApplicationUserCertifications { get; set; }
        public int Level { get; set; }
        public string CertificationType { get; set; }
    }
}
