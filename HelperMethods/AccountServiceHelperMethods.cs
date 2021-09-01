using KPProject.Data;
using KPProject.Models;
using KPProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace KPProject.HelperMethods
{
    public class AccountServiceHelperMethods
    {
        public static void CleanUpUsersMultipleChoiseModalsData(UserViewModel userViewModel, ApplicationDbContext dbContext)
        {
            dbContext.UserRegions.RemoveRange(dbContext.UserRegions.Where(ur => ur.ApplicationUserId == userViewModel.Id));
            dbContext.UserLanguages.RemoveRange(dbContext.UserLanguages.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            dbContext.ApplicationUserEducations.RemoveRange(dbContext.ApplicationUserEducations.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            dbContext.ApplicationUserPositions.RemoveRange(dbContext.ApplicationUserPositions.Where(ul => ul.ApplicationUserId == userViewModel.Id));
            dbContext.ApplicationUserSectorsOfActivities.RemoveRange(dbContext.ApplicationUserSectorsOfActivities.Where(ul => ul.ApplicationUserId == userViewModel.Id));
        }

        public static void PopulateUsersNewMultipleChoiceModalsData(
            UserViewModel userViewModel,
            List<UserRegion> newUserRegions,
            List<UserLanguage> newUserLanguages,
            List<ApplicationUserPosition> newUserPositions,
            List<ApplicationUserEducation> newUserEducations,
            List<ApplicationUserSectorOfActivity> newUserSectorsOfActivity
            )
        {
            userViewModel.Regions.ForEach(region => newUserRegions.Add(new UserRegion
            {
                ApplicationUserId = userViewModel.Id,
                RegionId = region.Id
            }));

            userViewModel.Languages.ForEach(language => newUserLanguages.Add(new UserLanguage
            {
                ApplicationUserId = userViewModel.Id,
                LanguageId = language.Id
            }));

            userViewModel.Positions.ForEach(position => newUserPositions.Add(new ApplicationUserPosition
            {
                ApplicationUserId = userViewModel.Id,
                PositionId = position.Id
            }));


            userViewModel.Educations.ForEach(education => newUserEducations.Add(new ApplicationUserEducation
            {
                ApplicationUserId = userViewModel.Id,
                EducationId = education.Id
            }));

            userViewModel.SectorsOfActivities.ForEach(soa => newUserSectorsOfActivity.Add(new ApplicationUserSectorOfActivity
            {
                ApplicationUserId = userViewModel.Id,
                SectorOfActivityId = soa.Id
            }));
        }

        public static void ChangeUsersProfileImageFileName(UserViewModel userViewModel, ApplicationUser user)
        {
            //TODO - remove this block here, when u will implement global exception middleware
            try
            {
                File.Copy(
                Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{userViewModel.ProfileImageName}.png"),
                Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{user.ProfileImageName}.png")
                );

                File.Delete(Path.Combine("wwwroot/dist/assets/Profile-Images/", $"{userViewModel.ProfileImageName}.png"));
            }
            catch (Exception)
            {

            }
        }

        public static ImageCodecInfo GetEncoderInfo(ImageFormat mimeType)
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

        /// <summary>
        /// Configures the settings of the image to decrease its quality and space occupied.
        /// </summary>
        /// <param name="quality"></param>
        /// <returns></returns>
        public static EncoderParameters GetEncoderParametersForDecreasedImageGuality(long quality = 50)
        {
            EncoderParameter qualityParam = new EncoderParameter(Encoder.Quality, quality);

            EncoderParameters encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = qualityParam;

            return encoderParameters;
        }

        public static bool MembershipIsOverdue(DateTime dueDate)
        {
            if (DateTime.Compare(dueDate, DateTime.Now.Date) < 0)
            {
                return true;
            }

            return false;
        }

    }
}
