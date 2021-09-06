using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly IAccountService _accountService;
        private readonly IEmailSender _emailSenderService;

        public AccountController(IAccountService accountService, IEmailSender emailSenderService)
        {
            _accountService = accountService;
            _emailSenderService = emailSenderService;
        }

        [HttpGet("GetCurrentUser")]
        public async Task<ActionResult> GetCurrentUserAsync()
        {
            var user = await _accountService.GetCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user != null)
            {
                return Ok(user);
            }

            return StatusCode(500);
        }

        [HttpGet("Regions")]
        public async Task<ActionResult> GetAllRegionsAsync()
        {
            var regions = await _accountService.GetAllRegionsAsync();

            if (regions.Count > 0)
            {
                return Ok(regions);
            }

            return StatusCode(500);
        }

        [HttpGet("AgeGroups")]
        public async Task<ActionResult> GetAllAgeGroupsAsync()
        {
            var ageGroups = await _accountService.GetAllAgeGroupsAsync();

            if (ageGroups.Count > 0)
            {
                return Ok(ageGroups);
            }

            return StatusCode(500);
        }

        [HttpGet("Positions")]
        public async Task<ActionResult> GetAllPositionsAsync()
        {
            var positions = await _accountService.GetAllPositionsAsync();

            if (positions.Count > 0)
            {
                return Ok(positions);
            }

            return StatusCode(500);
        }

        [HttpGet("Educations")]
        public async Task<ActionResult> GetAllEducationsAsync()
        {
            var educations = await _accountService.GetAllEducationsAsync();

            if (educations.Count > 0)
            {
                return Ok(educations);
            }

            return StatusCode(500);
        }

        [HttpGet("SectorsOfActivities")]
        public async Task<ActionResult> GetAllSectorsOfActivitiesAsync()
        {
            var sectorsOfActivities = await _accountService.GetAllSectorsOfActivitiesAsync();

            if (sectorsOfActivities.Count > 0)
            {
                return Ok(sectorsOfActivities);
            }

            return StatusCode(500);
        }

        [HttpGet("Languages")]
        public async Task<ActionResult> GetAllLanguagesAsync()
        {
            var languages = await _accountService.GetAllLanguagesAsync();

            if (languages.Count > 0)
            {
                return Ok(languages);
            }

            return StatusCode(500);
        }

        [HttpGet("MailIsRegistered")]
        public async Task<ActionResult<bool>> MailIsRegisteredAsync([FromQuery]string mail)
        {
            var isRegistered = await _accountService.MailIsRegisteredAsync(mail);

            return Ok(isRegistered);
        }

        [HttpGet("ProfessionalEmailIsRegistered")]
        public async Task<ActionResult<bool>> ProfessionalEmailIsRegisteredAsync([FromQuery] string professionalEmail)
        {
            var isRegistered = await _accountService.ProfessionalEmailIsRegisteredAsync(professionalEmail);

            return Ok(isRegistered);
        }

        [HttpPost]
        [Route("ChangeUserPersonalData")]
        public async Task<ActionResult> ChangeUserPersonalDataAsync(UserViewModel userViewModel)
        {
            var userWithNewData = await _accountService.ChangeUserPersonalDataAsync(userViewModel);

            if (userWithNewData != null)
            {
                return Ok(userWithNewData);
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("UploadProfileImage")]
        public async Task<ActionResult> UploadProfileImageAsync([FromBody]string data)
        {
            var imageName = await _accountService.UploadProfileImageAsync(data, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (imageName != null)
            {
                return Ok(imageName);
            }

            return StatusCode(500);
        }

        [HttpGet]
        [Route("GetSelectedRegionsForCurrentUser")]
        public async Task<ActionResult<List<RegionModel>>> GetSelectedRegionsForCurrentUserAsync()
        {
            var regions = await _accountService.GetSelectedRegionsForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(regions);
        }

        [HttpGet]
        [Route("GetSelectedLanguagesForCurrentUser")]
        public async Task<ActionResult<List<LanguageModel>>> GetSelectedLanguagesForCurrentUserAsync()
        {
            var languages = await _accountService.GetSelectedLanguagesForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(languages);
        }

        [HttpGet]
        [Route("GetSelectedPositionsForCurrentUser")]
        public async Task<ActionResult<List<PositionModel>>> GetSelectedPositionsForCurrentUserAsync()
        {
            var positions = await _accountService.GetSelectedPositionsForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(positions);
        }

        [HttpGet]
        [Route("GetSelectedEducationsForCurrentUser")]
        public async Task<ActionResult<List<EducationModel>>> GetSelectedEducationsForCurrentUserAsync()
        {
            var educations = await _accountService.GetSelectedEducationsForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(educations);
        }

        [HttpGet]
        [Route("GetSelectedSectorsOfActivityForCurrentUser")]
        public async Task<ActionResult<List<SectorOfActivityModel>>> GetSelectedSectorsOfActivityForCurrentUserAsync()
        {
            var sectorsOfActivity = await _accountService.GetSelectedSectorsOfActivityForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(sectorsOfActivity);
        }

        [HttpPost]
        [Route("AssociateUserDataToTheSurvey")]
        public async Task<ActionResult> AssociateUserDataToTheSurveyAsync([FromBody] string userId)
        {
            var operationSucceded = await _accountService.AssociateUserDataToTheSurveyAsync(userId);

            if (operationSucceded)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("UserHasUnsignedSurveys")]
        public async Task<ActionResult<bool>> UserHasUnsignedSurveysAsync([FromQuery] string userId)
        {
            var hasUnsignedSurvey = await _accountService.UserHasUnsignedSurveysAsync(userId);

            return Ok(hasUnsignedSurvey);
        }

        [HttpGet]
        [Route("GetAllCertifications")]
        public async Task<ActionResult<List<Certification>>> GetAllCertificationsAsync()
        {
            var certifications = await _accountService.GetAllCertificationsAsync();

            if (certifications.Count > 0)
            {
                return Ok(certifications);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetPractitionersCertifications")]
        public async Task<ActionResult<List<ApplicationUserCertification>>> GetPractitionersCertificationsAsync(string userId)
        {
            if (userId == null)
            {
                userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            }

            var practitionersCertifications = await _accountService.GetPractitionersCertificationsAsync(userId);

            if (practitionersCertifications != null)
            {
                return Ok(practitionersCertifications);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetMembershipStatusOfTheUser")]
        public async Task<ActionResult<Membership>> GetMembershipStatusOfTheUserAsync(string userId)
        {
            var membership = await _accountService.GetMembershipStatusAsync(userId);

            return Ok(membership);
        }

        [HttpGet]
        [Route("GetMembershipStatus")]
        public async Task<ActionResult<Membership>> GetMembershipStatusAsync()
        {
            var membership = await _accountService.GetMembershipStatusAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(membership);
        }

        [HttpGet]
        [Route("RenewMembership")]
        public async Task<ActionResult> RenewMembershipAsync()
        {
            var operationSucceded = await _accountService.RenewMembershipAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (operationSucceded)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("EmailPasswordResetLink")]
        public async Task<ActionResult> EmailPasswordResetLinkAsync([FromQuery]string email)
        {
            var emailIsSent = await _emailSenderService.EmailPasswordResetLinkAsync(email);

            if (emailIsSent)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("ResetPassword")]
        public async Task<ActionResult> ResetPasswordAsync([FromBody]ResetPasswordViewModel resetPasswordViewModel)
        {
            var operationSucceeded = await _accountService.ResetPasswordAsync(resetPasswordViewModel);

            if (operationSucceeded)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
