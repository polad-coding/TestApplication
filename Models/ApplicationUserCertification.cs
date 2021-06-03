using System;

namespace KPProject.Models
{
    public  class ApplicationUserCertification
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int CertificationId { get; set; }
        public Certification Certification { get; set; }
        public DateTime ValidatedOn { get; set; }
    }
}