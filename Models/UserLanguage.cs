using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class UserLanguage
    {
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public int LanguageId { get; set; }
        public virtual LanguageModel Language { get; set; }
    }
}
