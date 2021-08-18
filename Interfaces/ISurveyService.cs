using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface ISurveyService
    {
        Task<bool> CreateSurveyAsync(List<CreateOrderViewModel> orders, string userId);
        //Task<SurveyModel> CreateSurveyAsync(string code, string userId, string surveyPractitionerId, int numberOfUsages);
    }
}
