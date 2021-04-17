using CsvHelper.Configuration;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Maps
{
    public class ValueViewModelMap: ClassMap<ValueViewModel>
    {
        public ValueViewModelMap(string language)
        {
            Map(vvm => vvm.Character).Name("Char");
            Map(vvm => vvm.Title).Name($"Titre {language}");
            Map(vvm => vvm.Definition).Name($"Définitions {language}");
            Map(vvm => vvm.Questions).Name($"Questions {language}");
        }
    }
}
