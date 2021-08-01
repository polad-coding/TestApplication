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
                .ForMember(dest => dest.Positions,
                            opt => opt.MapFrom(src => src.Positions.Select(element => element.Position)))
                .ForMember(dest => dest.Educations,
                            opt => opt.MapFrom(src => src.Educations.Select(element => element.Education)))
                .ForMember(dest => dest.SectorsOfActivities,
                            opt => opt.MapFrom(src => src.SectorsOfActivities.Select(element => element.SectorOfActivity)))
                .ForMember(dest => dest.AgeGroup,
                            opt => opt.MapFrom(src => src.AgeGroupModel))
                .ReverseMap();
        }
    }
}
