using CsvHelper.Configuration;
using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Maps
{
    public class ValueMap: ClassMap<ValueModel>
    {
        public ValueMap()
        {
            Map(v => v.ASCIIValue).Name("code");
            Map(v => v.Character).Name("Char");
            Map(v => v.PerspectiveId).Name("Nbr-Pers");
        }
    }
}
