using AutoMapper;
using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Profiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<ApplicationUser, UserViewModel>()
                .ForMember(dest => dest.Languages,
                            opt => opt.MapFrom(src => src.Languages.Select(element => element.Language)))
                .ForMember(dest => dest.Regions,
                            opt => opt.MapFrom(src => src.Regions.Select(element => element.Region)))
                .ReverseMap();
        }
    }
}
