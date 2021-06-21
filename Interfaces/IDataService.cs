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
        Task<bool> GenerateCodesAsync(List<OrderViewModel> ordersList, string userId);
        Task<List<SurveyResultViewModel>> GetSurveyResultsAsync(string userId);
        Task<List<ValueModel>> GetTheCurrentStageValuesAsync(int surveyId);
        Task<string> DecideToWhichStageToTransferAsync(int surveyId);
        Task<bool> CheckIfCodeIsValidAsync(string code);
        Task PopulateDBWithCertificationsAsync();
        Task<List<Certification>> GetAllCertificationsAsync();
        Task<List<ApplicationUserCertification>> GetPractitionersCertificationsAsync(string userId);
        Task<Membership> GetMembershipStatusAsync(string userId);
        Task<bool> RenewMembershipAsync(string userId);
        Task<List<UserViewModel>> GetPractitionersForDirectoryAsync(PractitionersSearchFilterViewModel practitionersSearchFilterViewModel);
        Task<int> ReturnNumberOfPractitionersAsync();
        Task<List<List<ReportTableValueViewModel>>> GetValuesSelectionsAtDifferentSurveyStagesAsync(int surveyId);
        Task<SurveyResultViewModel> GetParticularSurveyResultsAsync(int surveyId);
    }
}
