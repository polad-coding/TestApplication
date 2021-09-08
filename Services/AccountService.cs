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
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using KPProject.HelperMethods;

namespace KPProject.Services
{
    public class AccountService : IAccountService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _applicationDbContext;

        public AccountService(UserManager<ApplicationUser> userManager, IMapper mapper, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _applicationDbContext = dbContext;
        }

        public async Task<List<ValueModel>> GetAllValuesAsync()
        {
            return await _applicationDbContext.Values.ToListAsync();
        }

        public async Task<UserViewModel> ChangeUserPersonalDataAsync(UserViewModel userViewModel)
        {
            var user = await _userManager.FindByIdAsync(userViewModel.Id);
            var oldEmail = user.Email;

            var newRegionsOfTheUser = new List<UserRegion>();
            var newLanguagesOfTheUser = new List<UserLanguage>();
            var newEducationsOfTheUser = new List<ApplicationUserEducation>();
            var newPositionsOfTheUser = new List<ApplicationUserPosition>();
            var newSectorsOfActivityOfTheUser = new List<ApplicationUserSectorOfActivity>();

            AccountServiceHelperMethods.CleanUpUsersMultipleChoiseModalsData(userViewModel, _applicationDbContext);
            AccountServiceHelperMethods.PopulateUsersNewMultipleChoiceModalsData(userViewModel, newRegionsOfTheUser, newLanguagesOfTheUser, newPositionsOfTheUser, newEducationsOfTheUser, newSectorsOfActivityOfTheUser);

            user.Email = userViewModel.Email;
            user.UserName = userViewModel.Email;
            user.FirstName = userViewModel.FirstName;
            user.LastName = userViewModel.LastName;
            user.Gender = await _applicationDbContext.Gender.FirstAsync(g => g.GenderName == userViewModel.Gender.GenderName);
            user.Regions = newRegionsOfTheUser;
            user.Languages = newLanguagesOfTheUser;
            user.Educations = newEducationsOfTheUser;
            user.Positions = newPositionsOfTheUser;
            user.SectorsOfActivities = newSectorsOfActivityOfTheUser;
            user.PhoneNumber = userViewModel.PhoneNumber;
            user.Website = userViewModel.Website;
            user.Bio = userViewModel.Bio;
            user.Age = userViewModel.Age;
            user.MyerBriggsCode = userViewModel.MyerBriggsCode;
            user.ProfessionalEmail = userViewModel.ProfessionalEmail;
            user.ProfileImageName = $"{userViewModel.Email}-user-profile-image";

            if (userViewModel.AgeGroup != null)
            {
                user.AgeGroup = await _applicationDbContext.AgeGroups.FirstOrDefaultAsync(ag => ag.GroupAgeRange == userViewModel.AgeGroup.GroupAgeRange);
            }

            if (userViewModel.Email != oldEmail)
            {
                AccountServiceHelperMethods.ChangeUsersProfileImageFileName(userViewModel, user);
            }

            await _applicationDbContext.SaveChangesAsync();
            var userUpdateOperation = await _userManager.UpdateAsync(user);

            if (userUpdateOperation.Succeeded)
            {
                return userViewModel;
            }

            return null;
        }

        public async Task<List<LanguageModel>> GetAllLanguagesAsync()
        {
            var languages = await _applicationDbContext.Languages.ToListAsync();

            return languages;
        }

        public async Task<List<RegionModel>> GetAllRegionsAsync()
        {
            var regions = await _applicationDbContext.Regions.ToListAsync();

            return regions;
        }

        public async Task<UserViewModel> GetCurrentUserAsync(string userId)
        {
            var user = await _applicationDbContext.Users.Where(u => u.Id == userId)
                .Include(u => u.Languages).ThenInclude(ul => ul.Language)
                .Include(u => u.Regions).ThenInclude(ur => ur.Region)
                .Include(u => u.Positions).ThenInclude(up => up.Position)
                .Include(u => u.Educations).ThenInclude(ue => ue.Education)
                .Include(u => u.SectorsOfActivities).ThenInclude(usoa => usoa.SectorOfActivity)
                .Include(u => u.Gender)
                .Include(u => u.AgeGroup).FirstOrDefaultAsync();

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

        /// <summary>
        /// Checks if user with this professional email is already registered, or some users mail is equal to this professional email.
        /// </summary>
        /// <param name="professionalEmail"></param>
        /// <returns></returns>
        public async Task<bool> ProfessionalEmailIsRegisteredAsync(string professionalEmail)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => (u.ProfessionalEmail == professionalEmail) || (u.Email == professionalEmail));

            if (user == null)
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
            await _userManager.UpdateAsync(user);

            data = data.Split(",")[1];

            var dataBytes = Convert.FromBase64String(data);

            using (MemoryStream stream = new MemoryStream(dataBytes))
            {
                Image pic = Image.FromStream(stream);
                ImageCodecInfo codec = AccountServiceHelperMethods.GetEncoderInfo(ImageFormat.Jpeg);

                string path = Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{user.ProfileImageName}.png");

                File.Delete(Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{oldImageName}.png"));

                var encoderParameters = AccountServiceHelperMethods.GetEncoderParametersForDecreasedImageGuality(50);

                pic.Save(path, codec, encoderParameters);
            }

            return user.ProfileImageName;
        }

        public async Task<List<PositionModel>> GetAllPositionsAsync()
        {
            var positions = await _applicationDbContext.Positions.ToListAsync();

            return positions;
        }

        public async Task<List<EducationModel>> GetAllEducationsAsync()
        {
            var educations = await _applicationDbContext.Educations.ToListAsync();

            return educations;
        }

        public async Task<List<SectorOfActivityModel>> GetAllSectorsOfActivitiesAsync()
        {
            var sectorsOfActivities = await _applicationDbContext.SectorsOfActivity.ToListAsync();

            return sectorsOfActivities;
        }

        public async Task<List<AgeGroup>> GetAllAgeGroupsAsync()
        {
            var ageGroups = await _applicationDbContext.AgeGroups.ToListAsync();

            return ageGroups;
        }

        public async Task<List<Certification>> GetAllCertificationsAsync()
        {
            var certifications = await _applicationDbContext.Certifications.ToListAsync();

            return certifications;
        }

        public async Task<List<ApplicationUserCertification>> GetPractitionersCertificationsAsync(string userId)
        {
            var userCertifications = await _applicationDbContext.ApplicationUserCertifications
                .Where(auc => auc.ApplicationUserId == userId)
                .Include(auc => auc.Certification)
                .ToListAsync();

            return userCertifications;
        }

        public async Task<Membership> GetMembershipStatusAsync(string userId)
        {
            var membership = await _applicationDbContext.Memberships.FirstOrDefaultAsync(m => m.UserId == userId);

            if (membership == null)
            {
                return null;
            }

            if (AccountServiceHelperMethods.MembershipIsOverdue(membership.ValidTill.Date))
            {
                _applicationDbContext.Remove(membership);
                await _applicationDbContext.SaveChangesAsync();

                return null;
            }

            return membership;
        }

        public async Task<bool> RenewMembershipAsync(string userId)
        {
            var membership = await _applicationDbContext.Memberships.FirstOrDefaultAsync(m => m.UserId == userId);

            if (membership == null)
            {
                await _applicationDbContext.Memberships.AddAsync(new Membership { UserId = userId, ValidTill = DateTime.Now.AddYears(1) });
            }
            else
            {
                membership.ValidTill = membership.ValidTill.AddYears(1);
                _applicationDbContext.Memberships.Update(membership);
            }

            var rowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (rowsAffected > 0)
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Checks whether user has compleated all three stages of the survey, but didn't confirm his profile data to get the results of the survey.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> UserHasUnsignedSurveysAsync(string userId)
        {
            var unsignedSurvey = await _applicationDbContext.Surveys.FirstOrDefaultAsync((s) => s.SurveyTakerUserId == userId && s.ThirdStagePassed == true && s.AnonymisedUserId == null);

            if (unsignedSurvey == null)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Associates the users personal anonymous types of data with the survey.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> AssociateUserDataToTheSurveyAsync(string userId)
        {
            var user = await _applicationDbContext.Users.Where((u) => u.Id == userId).Include(u => u.Regions).Include(u => u.Educations).Include(u => u.Positions).Include(u => u.SectorsOfActivities).FirstAsync();

            var anonymisedUser = new AnonymisedUser() { AgeGroup = user.AgeGroup, Gender = user.Gender, MyerBriggsCode = user.MyerBriggsCode };

            user.Regions.ForEach((ur) =>
            {
                anonymisedUser.Regions.Add(new AnonymisedUserRegion() { AnonymisedUserId = anonymisedUser.Id, RegionId = ur.RegionId });
            });

            user.Positions.ForEach((up) =>
            {
                anonymisedUser.Positions.Add(new AnonymisedUserPosition() { AnonymisedUserId = anonymisedUser.Id, PositionId = up.PositionId });
            });

            user.Educations.ForEach((ue) =>
            {
                anonymisedUser.Educations.Add(new AnonymisedUserEducation() { AnonymisedUserId = anonymisedUser.Id, EducationId = ue.EducationId });
            });

            user.SectorsOfActivities.ForEach((ausoa) =>
            {
                anonymisedUser.SectorsOfActivities.Add(new AnonymisedUserSectorsOfActivity() { AnonymisedUserId = anonymisedUser.Id, SectorOfActivityId = ausoa.SectorOfActivityId });
            });

            await _applicationDbContext.AnonymisedUsers.AddAsync(anonymisedUser);
            await _applicationDbContext.SaveChangesAsync();

            var unsignedSurvey = await _applicationDbContext.Surveys.FirstAsync((s) => s.SurveyTakerUserId == userId && s.ThirdStagePassed == true && s.AnonymisedUserId == null);

            unsignedSurvey.AnonymisedUserId = anonymisedUser.Id;

            _applicationDbContext.Surveys.Update(unsignedSurvey);

            if (await _applicationDbContext.SaveChangesAsync() > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<List<RegionModel>> GetSelectedRegionsForCurrentUserAsync(string userId)
        {
            var currentUserSelectedRegions = await _applicationDbContext.UserRegions.Where(ur => ur.ApplicationUserId == userId).Select(ur => ur.Region).ToListAsync();

            return currentUserSelectedRegions;
        }

        public async Task<List<PositionModel>> GetSelectedPositionsForCurrentUserAsync(string userId)
        {
            var currentUserSelectedPositions = await _applicationDbContext.ApplicationUserPositions.Where(up => up.ApplicationUserId == userId).Select(up => up.Position).ToListAsync();

            return currentUserSelectedPositions;
        }

        public async Task<List<EducationModel>> GetSelectedEducationsForCurrentUserAsync(string userId)
        {
            var currentUserSelectedEducations = await _applicationDbContext.ApplicationUserEducations.Where(ue => ue.ApplicationUserId == userId).Select(ue => ue.Education).ToListAsync();

            return currentUserSelectedEducations;
        }

        public async Task<List<SectorOfActivityModel>> GetSelectedSectorsOfActivityForCurrentUserAsync(string userId)
        {
            var currentUserSelectedSectorsOfActivities = await _applicationDbContext.ApplicationUserSectorsOfActivities.Where(usoa => usoa.ApplicationUserId == userId).Select(usoa => usoa.SectorOfActivity).ToListAsync();

            return currentUserSelectedSectorsOfActivities;
        }

        public async Task<List<LanguageModel>> GetSelectedLanguagesForCurrentUserAsync(string userId)
        {
            var currentUserSelectedLanguages = await _applicationDbContext.UserLanguages.Where(ul => ul.ApplicationUserId == userId).Select(ul => ul.Language).ToListAsync();

            return currentUserSelectedLanguages;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordViewModel resetPasswordViewModel)
        {
            var user = await _applicationDbContext.Users.FirstAsync(u => u.Email == resetPasswordViewModel.Email || u.ProfessionalEmail == resetPasswordViewModel.Email);

            var resetPasswordOperationSucceeded = await _userManager.ResetPasswordAsync(user, resetPasswordViewModel.ResetToken, resetPasswordViewModel.Password);

            if (resetPasswordOperationSucceeded.Succeeded)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> CheckIfGivenPersonIsInUserRoleAsync(string email)
        {
            var user = await _applicationDbContext.Users.FirstAsync(u => u.Email == email || u.ProfessionalEmail == email);

            var isInRoleUser = await _userManager.IsInRoleAsync(user, "User");

            return isInRoleUser;
        }

    }
}
