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
        Task<List<ValueModel>> GetAllValuesAsync();
        Task PopulateDBWithCertificationsAsync();
        Task<List<UserViewModel>> GetPractitionersForDirectoryAsync(PractitionersSearchFilterViewModel practitionersSearchFilterViewModel);
        Task<int> ReturnNumberOfPractitionersAsync();
        Task PopulateDBWithCoupons();
    }
}
