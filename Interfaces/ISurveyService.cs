using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface ISurveyService
    {
        Task<SurveyModel> CreateSurveyAsync(string code, string userId, string surveyPractitionerId, int numberOfUsages);
    }
}
