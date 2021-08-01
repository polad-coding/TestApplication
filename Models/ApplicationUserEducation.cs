﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Models
{
    public class ApplicationUserEducation
    {
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public int EducationId { get; set; }
        public EducationModel Education { get; set; }
    }
}
