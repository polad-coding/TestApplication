using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
