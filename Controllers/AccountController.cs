using KPProject.Interfaces;
using KPProject.Services;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Authorize(Roles = "Practitioner,User")]
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<ActionResult> GetCurrentUserAsync()
        {
            var user = await _accountService.GetCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user != null)
            {
                return Ok(user);
            }

            return BadRequest();
        }

        [HttpGet("Regions")]
        public async Task<ActionResult> GetAllRegionsAsync()
        {
            var regions = await _accountService.GetAllRegionsAsync();

            if (regions != null)
            {
                return Ok(regions);
            }

            return BadRequest();
        }

        [HttpGet("Languages")]
        public async Task<ActionResult> GetAllLanguagesAsync()
        {
            var languages = await _accountService.GetAllLanguagesAsync();

            if (languages != null)
            {
                return Ok(languages);
            }

            return BadRequest();
        }

        [HttpGet("MailIsRegistered")]
        public async Task<ActionResult> MailIsRegisteredAsync([FromQuery]string mail)
        {
            var isRegistered = await _accountService.MailIsRegisteredAsync(mail);

            return Ok(isRegistered);
        }

        [HttpGet("ProfessionalEmailIsRegistered")]
        public async Task<ActionResult> ProfessionalEmailIsRegisteredAsync([FromQuery] string professionalEmail)
        {
            var isRegistered = await _accountService.ProfessionalEmailIsRegisteredAsync(professionalEmail);

            return Ok(isRegistered);
        }

        [HttpGet("TestRequest")]
        public ActionResult TestRequest()
        {
            return Ok("We rock!!!");
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

            return null;
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
    }
}
