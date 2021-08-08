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

        public List<ValueModel> GetAllValues()
        {
            return _dbContext.Values.ToList();
        }

        public async Task<UserViewModel> ChangeUserPersonalDataAsync(UserViewModel userViewModel)
        {
            var oldUser = await _userManager.FindByIdAsync(userViewModel.Id);
            var oldEmail = oldUser.Email;
            var newUserRegions = new List<UserRegion>();
            var newUserLanguages = new List<UserLanguage>();
            var newUserEducations = new List<ApplicationUserEducation>();
            var newUserPositions = new List<ApplicationUserPosition>();
            var newUserSectorsOfActivity = new List<ApplicationUserSectorOfActivity>();

            _dbContext.UserRegions.RemoveRange(_dbContext.UserRegions.Where(ur => ur.ApplicationUserId == userViewModel.Id));
            _dbContext.UserLanguages.RemoveRange(_dbContext.UserLanguages.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            _dbContext.ApplicationUserEducations.RemoveRange(_dbContext.ApplicationUserEducations.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            _dbContext.ApplicationUserPositions.RemoveRange(_dbContext.ApplicationUserPositions.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            _dbContext.ApplicationUserSectorsOfActivities.RemoveRange(_dbContext.ApplicationUserSectorsOfActivities.Where(ul => ul.ApplicationUserId == userViewModel.Id));

            await _dbContext.SaveChangesAsync();

            userViewModel.Regions.ForEach(region => newUserRegions.Add(new UserRegion
            {
                ApplicationUserId = oldUser.Id,
                RegionId = region.Id
            }));

            userViewModel.Languages.ForEach(language => newUserLanguages.Add(new UserLanguage
            {
                ApplicationUserId = oldUser.Id,
                LanguageId = language.Id
            }));

            userViewModel.Positions.ForEach(position => newUserPositions.Add(new ApplicationUserPosition
            {
                ApplicationUserId = oldUser.Id,
                PositionId = position.Id
            }));


            userViewModel.Educations.ForEach(education => newUserEducations.Add(new ApplicationUserEducation
            {
                ApplicationUserId = oldUser.Id,
                EducationId = education.Id
            }));

            userViewModel.SectorsOfActivities.ForEach(soa => newUserSectorsOfActivity.Add(new ApplicationUserSectorOfActivity
            {
                ApplicationUserId = oldUser.Id,
                SectorOfActivityId = soa.Id
            }));

            //TODO - solve problems here, add migration, update database, add models, services and implement this feature finally

            oldUser.Email = userViewModel.Email;
            oldUser.UserName = userViewModel.Email;
            oldUser.FirstName = userViewModel.FirstName;
            oldUser.LastName = userViewModel.LastName;
            oldUser.Gender = await _dbContext.Gender.FirstAsync(g => g.GenderName == userViewModel.Gender.GenderName);
            oldUser.Regions = newUserRegions;
            oldUser.Languages = newUserLanguages;
            oldUser.Educations = newUserEducations;
            oldUser.Positions = newUserPositions;
            oldUser.SectorsOfActivities = newUserSectorsOfActivity;
            oldUser.PhoneNumber = userViewModel.PhoneNumber;
            oldUser.Website = userViewModel.Website;
            oldUser.Bio = userViewModel.Bio;
            oldUser.Age = userViewModel.Age;
            oldUser.MyerBriggsCode = userViewModel.MyerBriggsCode;
            oldUser.AgeGroupModel = await _dbContext.AgeGroups.FirstAsync(ag => ag.GroupAgeRange == userViewModel.AgeGroup.GroupAgeRange);
            oldUser.ProfileImageName = $"{userViewModel.Email}-user-profile-image";

            //TODO - here uncomment

            if (userViewModel.Email != oldEmail)
            {
                try
                {
                    File.Copy(
                    Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{userViewModel.ProfileImageName}.png"),
                    Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{oldUser.ProfileImageName}.png")
                    );

                    File.Delete(Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{userViewModel.ProfileImageName}.png"));
                }
                catch (Exception)
                {

                }

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


            user.Positions = _dbContext.ApplicationUserPositions
            .Where(element => element.ApplicationUserId == user.Id)
            .Select(ur => new ApplicationUserPosition()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                PositionId = ur.PositionId,
                Position = _dbContext.Positions.First(position => position.Id == ur.PositionId)
            }).ToList();

            user.Educations = _dbContext.ApplicationUserEducations
            .Where(element => element.ApplicationUserId == user.Id)
            .Select(ur => new ApplicationUserEducation()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                EducationId = ur.EducationId,
                Education = _dbContext.Educations.First(education => education.Id == ur.EducationId)
            }).ToList();

            user.SectorsOfActivities = _dbContext.ApplicationUserSectorsOfActivities
            .Where(element => element.ApplicationUserId == user.Id)
            .Select(ur => new ApplicationUserSectorOfActivity()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                SectorOfActivityId = ur.SectorOfActivityId,
                SectorOfActivity = _dbContext.SectorsOfActivity.First(soa => soa.Id == ur.SectorOfActivityId)
            }).ToList();

            user.Gender = await _dbContext.Gender.FirstAsync(gender => gender.Id == user.GenderId);
            user.AgeGroupModel = await _dbContext.AgeGroups.FirstOrDefaultAsync(ag => ag.Id == user.AgeGroupModelId);

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

        private EncoderParameters GetEncoderParametersForDecreasedImageGuality(long quality = 50)
        {
            EncoderParameter qualityParam = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);

            EncoderParameters encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = qualityParam;

            return encoderParameters;
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
                    ImageCodecInfo pngCodec = GetEncoderInfo(ImageFormat.Jpeg);

                    string path = Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{user.ProfileImageName}.png");

                    File.Delete(Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{oldImageName}.png"));

                    var encoderParameters = this.GetEncoderParametersForDecreasedImageGuality(50);

                    pic.Save(path, pngCodec, encoderParameters);
                }
            }

            return user.ProfileImageName;
        }

        private ImageCodecInfo GetEncoderInfo(ImageFormat mimeType)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == mimeType.Guid)
                {
                    return codec;
                }
            }
            return null;
        }

        public async Task<List<PositionModel>> GetAllPositionsAsync()
        {
            var positions = await _dbContext.Positions.ToListAsync();

            if (positions == null)
            {
                return null;
            }

            return positions;
        }

        public async Task<List<EducationModel>> GetAllEducationsAsync()
        {
            var educations = await _dbContext.Educations.ToListAsync();

            if (educations == null)
            {
                return null;
            }

            return educations;
        }

        public async Task<List<SectorOfActivityModel>> GetAllSectorsOfActivitiesAsync()
        {
            var sectorsOfActivities = await _dbContext.SectorsOfActivity.ToListAsync();

            if (sectorsOfActivities == null)
            {
                return null;
            }

            return sectorsOfActivities;
        }

        public async Task<List<AgeGroupModel>> GetAllAgeGroupsAsync()
        {
            var ageGroups = await _dbContext.AgeGroups.ToListAsync();

            if (ageGroups == null)
            {
                return null;
            }

            return ageGroups;
        }
    }
}
