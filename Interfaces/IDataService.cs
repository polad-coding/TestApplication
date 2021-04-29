using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IDataService
    {
        Task PopulateDBWithValuesAsync();
        Task PopulateDBWithPerspectivesAsync();
        Task CreateValuesLanguageFilesAsync();
        Task CreatePerspectivesLanguageFilesAsync();
        Task<List<ValueModel>> GetAllValuesFromTheFirstStageAsync(int surveyId);
        Task<List<ValueModel>> GetAllValuesAsync(int surveyId);
        Task<bool> SaveFirstStageResultsAsync(List<ValueModel> values, int surveyId);
        Task<bool> SaveSecondStageResultsAsync(List<ValueModel> values, int surveyId);
        Task<bool> SaveThirdStageResultsAsync(List<PrioritizedValueViewModel> values, int surveyId);
        Task<List<double>> GetTheRelativeWeightOfThePerspectivesAsync(int surveyId);
        Task<List<ValueModel>> GetSurveyThirdStageResultsAsync(int surveyId);
    }
}
