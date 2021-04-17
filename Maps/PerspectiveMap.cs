using CsvHelper.Configuration;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Maps
{
    public class PerspectiveMap: ClassMap<PerspectiveViewModel>
    {
        public PerspectiveMap(string language)
        {
            Map(pvm => pvm.Id).Name("Nbr-Pers");
            Map(pvm => pvm.Title).Name($"Pers {language}");
            Map(pvm => pvm.MainPerspectiveText).Name($"Perspective text {language}");
            Map(pvm => pvm.CorePerspectiveText).Name($"Core perspective {language}");
        }
    }
}
