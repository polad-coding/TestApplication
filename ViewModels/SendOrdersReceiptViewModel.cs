using System.Collections.Generic;

namespace KPProject.ViewModels
{
    public class SendOrdersReceiptViewModel
    {
        public string totalPriceString { get; set; }
        public Dictionary<string,int> codesDictionary { get; set; }
    }
}
