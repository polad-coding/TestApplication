using AutoMapper;
using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;

namespace KPProject.Services
{
    public class AccountService : IAccountService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _dbContext;

        public AccountService(UserManager<ApplicationUser> userManager, IMapper mapper, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<UserViewModel> ChangeUserPersonalDataAsync(UserViewModel userViewModel)
        {
            var oldUser = await _userManager.FindByIdAsync(userViewModel.Id);
            var oldEmail = oldUser.Email;
            var newUserRegions = new List<UserRegion>();
            var newUserLanguages = new List<UserLanguage>();

            _dbContext.UserRegions.RemoveRange(_dbContext.UserRegions.Where(ur => ur.ApplicationUserId == userViewModel.Id));
            _dbContext.UserLanguages.RemoveRange(_dbContext.UserLanguages.Where(ul => ul.ApplicationUserId == userViewModel.Id));

            await _dbContext.SaveChangesAsync();

            userViewModel.Regions.ForEach(region => newUserRegions.Add(new UserRegion
            {
                ApplicationUserId = oldUser.Id,
                //User = oldUser,
                //Region = region,
                RegionId = region.Id
            }));

            userViewModel.Languages.ForEach(language => newUserLanguages.Add(new UserLanguage
            {
                ApplicationUserId = oldUser.Id,
                //User = oldUser,
                //Region = region,
                LanguageId = language.Id
            }));

            oldUser.Email = userViewModel.Email;
            oldUser.UserName = userViewModel.Email;
            oldUser.FirstName = userViewModel.FirstName;
            oldUser.LastName = userViewModel.LastName;
            oldUser.Gender = userViewModel.Gender;
            oldUser.Regions = newUserRegions;
            oldUser.Languages = newUserLanguages;
            oldUser.Education = userViewModel.Education;
            oldUser.Position = userViewModel.Position;
            oldUser.ProfessionalEmail = userViewModel.ProfessionalEmail;
            oldUser.PhoneNumber = userViewModel.PhoneNumber;
            oldUser.Website = userViewModel.Website;
            oldUser.Bio = userViewModel.Bio;
            oldUser.SectorOfActivity = userViewModel.SectorOfActivity;
            oldUser.Age = userViewModel.Age;
            oldUser.MyerBriggsCode = userViewModel.MyerBriggsCode;
            oldUser.ProfileImageName = $"{userViewModel.Email}-user-profile-image";

            if (userViewModel.Email != oldEmail)
            {
                File.Copy(
                    Path.Combine(".\\ClientApp\\src\\assets\\Profile-Images\\", $"{userViewModel.ProfileImageName}.png"),
                    Path.Combine(".\\ClientApp\\src\\assets\\Profile-Images\\", $"{oldUser.ProfileImageName}.png")
                );

                File.Delete(Path.Combine(".\\ClientApp\\src\\assets\\Profile-Images\\", $"{userViewModel.ProfileImageName}.png"));
            }


            var userWithNewData = await _userManager.UpdateAsync(oldUser);

            if (userWithNewData.Succeeded)
            {
                return userViewModel;
            }

            return null;
        }

        public async Task<List<LanguageModel>> GetAllLanguagesAsync()
        {
            var languages = await _dbContext.Languages.ToListAsync();

            if (languages == null)
            {
                return null;
            }

            return languages;
        }

        public async Task<List<RegionModel>> GetAllRegionsAsync()
        {
            var regions = await _dbContext.Regions.ToListAsync();

            if (regions == null)
            {
                return null;
            }

            return regions;
        }

        public async Task<UserViewModel> GetCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            user.Languages = _dbContext.UserLanguages
            .Where(element => element.ApplicationUserId == user.Id)
            .Select(el => new UserLanguage()
            {
                ApplicationUserId = el.ApplicationUserId,
                User = el.User,
                LanguageId = el.LanguageId,
                Language = _dbContext.Languages.First(lang => lang.Id == el.LanguageId)
            }).ToList();

            user.Regions = _dbContext.UserRegions
            .Where(element => element.ApplicationUserId == user.Id)
            .Select(ur => new UserRegion()
            {
                ApplicationUserId = ur.ApplicationUserId,
                User = ur.User,
                RegionId = ur.RegionId,
                Region = _dbContext.Regions.First(reg => reg.Id == ur.RegionId)
            }).ToList();

            user.Gender = await _dbContext.Gender.FirstAsync(gender => gender.Id == user.GenderId);

            if (user == null)
            {
                return null;
            }

            var userViewModel = _mapper.Map<UserViewModel>(user);
            return userViewModel;
        }

        public async Task<bool> MailIsRegisteredAsync(string mail)
        {
            var user = await _userManager.FindByEmailAsync(mail);

            if (user == null)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> ProfessionalEmailIsRegisteredAsync(string professionalEmail)
        {
            var result = await _userManager.Users.FirstOrDefaultAsync(u => (u.ProfessionalEmail == professionalEmail) || (u.Email == professionalEmail));

            if (result == null)
            {
                return false;
            }

            return true;
        }

        public async Task<string> UploadProfileImageAsync(string data, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var oldImageName = user.ProfileImageName;

            user.ProfileImageName = $"{user.Email}-user-profile-image";
            var updateResult = await _userManager.UpdateAsync(user);

            data = data.Split(",")[1];

            if (updateResult.Succeeded)
            {
                var dataBytes = Convert.FromBase64String(data);

                using (MemoryStream ms = new MemoryStream(dataBytes))
                {
                    Image pic = Image.FromStream(ms);

                    string path = Path.Combine(".\\ClientApp\\src\\assets\\Profile-Images\\", $"{user.ProfileImageName}.png");

                    File.Delete(Path.Combine(".\\ClientApp\\src\\assets\\Profile-Images\\", $"{oldImageName}.png"));

                    pic.Save(path, ImageFormat.Png);
                }
            }

            return user.ProfileImageName;
        }
    }
}
