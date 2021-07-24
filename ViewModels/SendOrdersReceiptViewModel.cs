using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class SendOrdersReceiptViewModel
    {
        public string totalPriceString { get; set; }
        public Dictionary<string,int> codesDictionary { get; set; }
    }
}
