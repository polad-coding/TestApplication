using KPProject.Models;
using KPProject.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface ISurveyService
    {
        Task<bool> CreateSurveysAsync(List<CreateOrderViewModel> orders, string userId);
        Task<bool> SaveFirstStageResultsAsync(List<ValueModel> values, int surveyId);
        Task<bool> SaveSecondStageResultsAsync(List<ValueModel> values, int surveyId);
        Task<bool> SaveThirdStageResultsAsync(List<PrioritizedValueViewModel> values, int surveyId);
        Task<List<double>> GetTheRelativeWeightOfThePerspectivesAsync(int surveyId);
        Task<List<ValueModel>> GetSurveyThirdStageResultsAsync(int surveyId);
        Task<List<SurveyResultViewModel>> GetSurveysOfTheGivenUserAsync(string userId);
        Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId);
        Task<List<ValueModel>> GetFirstStageValuesAsync(int surveyId);
        Task<List<ValueModel>> GetSecondStageValuesAsync(int surveyId);
        Task<List<ValueModel>> GetThirdStageValuesAsync(int surveyId);
        Task<string> DecideToWhichStageToTransferAsync(int surveyId);
        Task<List<List<ReportTableValueViewModel>>> GetValuesSelectionsAtDifferentSurveyStagesAsync(int surveyId);
        Task<SurveyResultViewModel> GetParticularSurveyResultsAsync(int surveyId);
        Task<bool> GoToPreviousStageOfTheSurveyAsync(int surveyId);
        Task<bool> DeleteSurveyFirstStageResultsAsync(int surveyId);
        Task<bool> DeleteSurveySecondStageResultsAsync(int surveyId);



    }
}
