using AutoMapper;
using Microsoft.Extensions.Configuration;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using KPProject.Data;
using Microsoft.EntityFrameworkCore;
using KPProject.HelperMethods;

namespace KPProject.Services
{
    public class CustomAuthenticationService : ICustomAuthenticationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;

        public CustomAuthenticationService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            IMapper mapper,
            ApplicationDbContext dbContext
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public async Task<UserViewModel> SignInUserAsync(SignInViewModel signInViewModel)
        {
            var userAttemptingToSignIn =
                await _dbContext.Users.Where(u => u.Email == signInViewModel.Email)
                .Include(u => u.Languages).ThenInclude(ul => ul.Language)
                .Include(u => u.Regions).ThenInclude(ur => ur.Region)
                .Include(u => u.Positions).ThenInclude(up => up.Position)
                .Include(u => u.Educations).ThenInclude(ue => ue.Education)
                .Include(u => u.SectorsOfActivities).ThenInclude(usoa => usoa.SectorOfActivity)
                .Include(u => u.Gender)
                .Include(u => u.AgeGroup).FirstOrDefaultAsync();

            var signInAttempt = await _signInManager.PasswordSignInAsync(userAttemptingToSignIn, signInViewModel.Password, false, false);

            if (!signInAttempt.Succeeded)
            {
                return null;
            }

            var token = await CustomAuthenticationServiceHelperMethods.GenerateAccessTokenAsync(userAttemptingToSignIn, _userManager, _configuration);

            if (token == null)
            {
                return null;
            }

            var signingUserViewModel = _mapper.Map<UserViewModel>(userAttemptingToSignIn);
            signingUserViewModel.AccessToken = token;

            return signingUserViewModel;
        }

        public async Task<UserViewModel> RegisterUserAsync(RegisterViewModel registerViewModel)
        {

            var newUser = new ApplicationUser()
            {
                FirstName = registerViewModel.FirstName,
                LastName = registerViewModel.LastName,
                Email = registerViewModel.Email,
                UserName = registerViewModel.Email,
                Gender = await _dbContext.Gender.FirstAsync(g => g.GenderName == "Other")
            };

            var userCreationOperation = await _userManager.CreateAsync(newUser, registerViewModel.Password);

            await _userManager.AddToRoleAsync(newUser, "User");

            if (!userCreationOperation.Succeeded)
            {
                return null;
            }

            var userViewModel = _mapper.Map<UserViewModel>(newUser);

            return userViewModel;
        }
    }
}
