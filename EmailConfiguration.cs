using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject
{
    public class EmailConfiguration
    {
        public string From { get; set; } = "poladtesting@gmail.com";
        public string SmtpServer { get; set; } = "smtp.gmail.com";
        public int Port { get; set; } = 465;
        public string UserName { get; set; } = "poladtesting@gmail.com";
        public string Password { get; set; } = "plamf12345";
    }
}
