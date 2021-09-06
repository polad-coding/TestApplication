using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.ViewModels
{
    public class ResetPasswordViewModel
    {
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Email { get; set; }
        public string ResetToken { get; set; }
    }
}
