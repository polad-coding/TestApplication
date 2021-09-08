using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class EmailMessageToPractitionerViewModel
    {
        public string PractitionerId { get; set; }
        public string MessageContent { get; set; }
        public string MessageSubject { get; set; }
    }
}
