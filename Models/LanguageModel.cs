using System.Collections.Generic;

namespace KPProject.Models
{
    public class LanguageModel
    {
        public int Id { get; set; }
        public string LanguageName { get; set; }
        public List<UserLanguage> UserLanguage { get; set; }

    }
}