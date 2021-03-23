using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Interfaces
{
    public interface IAccountService
    {
        Task<UserViewModel> GetCurrentUserAsync(string userId);
        Task<List<RegionModel>> GetAllRegionsAsync();
        Task<bool> MailIsRegisteredAsync(string mail);
        Task<UserViewModel> ChangeUserPersonalDataAsync(UserViewModel userViewModel);
        Task<string> UploadProfileImageAsync(string data, string userId);
    }
}
