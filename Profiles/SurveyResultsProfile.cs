using AutoMapper;
using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Profiles
{
    public class SurveyResultsProfile:Profile
    {
        public SurveyResultsProfile()
        {
            CreateMap<SurveyModel, SurveyResultViewModel>().ReverseMap();
        }
    }
}
