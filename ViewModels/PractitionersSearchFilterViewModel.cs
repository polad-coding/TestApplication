using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class PractitionersSearchFilterViewModel
    {
        public int StartingIndex { get; set; }
        public int EndingIndex { get; set; }
        public List<LanguageModel> LanguagesSelected { get; set; }
        public List<RegionModel> GeographicalLocationsSelected { get; set; }
        public Gender GenderSelected { get; set; }
    }
}
