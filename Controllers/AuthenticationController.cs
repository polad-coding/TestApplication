using KPProject.Interfaces;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ICustomAuthenticationService _authenticationService;

        public AuthenticationController(ICustomAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost]
        [Route("SignInUser")]
        public async Task<ActionResult> SignInUserAsync(SignInViewModel signInViewModel)
        {
            var signedInUser = await _authenticationService.SignInUserAsync(signInViewModel);

            if (signedInUser != null)
            {
                return Ok(signedInUser);
            }

            return StatusCode(401);
        }

        [HttpPost]
        [Route("RegisterUser")]
        public async Task<ActionResult> RegisterUserAsync(RegisterViewModel registerViewModel)
        {
            var newUser = await _authenticationService.RegisterUserAsync(registerViewModel);

            if (newUser != null)
            {
                return Ok(newUser);
            }

            return StatusCode(500);
        }


    }
}
