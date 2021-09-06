using KPProject.Models;
using KPProject.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IAccountService
    {

        Task<List<ValueModel>> GetAllValuesAsync();
        Task<UserViewModel> GetCurrentUserAsync(string userId);
        Task<List<RegionModel>> GetAllRegionsAsync();
        Task<List<PositionModel>> GetAllPositionsAsync();
        Task<List<EducationModel>> GetAllEducationsAsync();
        Task<List<SectorOfActivityModel>> GetAllSectorsOfActivitiesAsync();
        Task<List<LanguageModel>> GetAllLanguagesAsync();
        Task<bool> MailIsRegisteredAsync(string mail);
        Task<bool> ProfessionalEmailIsRegisteredAsync(string professionalEmail);
        Task<UserViewModel> ChangeUserPersonalDataAsync(UserViewModel userViewModel);
        Task<string> UploadProfileImageAsync(string data, string userId);
        Task<List<AgeGroup>> GetAllAgeGroupsAsync();
        Task<List<Certification>> GetAllCertificationsAsync();
        Task<List<ApplicationUserCertification>> GetPractitionersCertificationsAsync(string userId);
        Task<Membership> GetMembershipStatusAsync(string userId);
        Task<bool> RenewMembershipAsync(string userId);
        Task<bool> UserHasUnsignedSurveysAsync(string userId);
        Task<bool> AssociateUserDataToTheSurveyAsync(string userId);
        Task<List<PositionModel>> GetSelectedPositionsForCurrentUserAsync(string userId);
        Task<List<EducationModel>> GetSelectedEducationsForCurrentUserAsync(string userId);
        Task<List<RegionModel>> GetSelectedRegionsForCurrentUserAsync(string userId);
        Task<List<LanguageModel>> GetSelectedLanguagesForCurrentUserAsync(string userId);
        Task<List<SectorOfActivityModel>> GetSelectedSectorsOfActivityForCurrentUserAsync(string userId);
        Task<bool> ResetPasswordAsync(ResetPasswordViewModel resetPasswordViewModel);

    }
}
