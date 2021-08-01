using AutoMapper;
using Microsoft.Extensions.Configuration;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using KPProject.Data;
using Microsoft.EntityFrameworkCore;

namespace KPProject.Services
{
    public class CustomAuthenticationService : ICustomAuthenticationService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _dbContext;


        public CustomAuthenticationService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IMapper mapper,
            IConfiguration configuration,
            ApplicationDbContext dbContext
        )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        private async Task<string> GenerateAccessTokenAsync(ApplicationUser user)
        {
            var userRole = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, userRole[0])
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("jsnlckjnsalkncaslcjsncp3cbakjnLIU@BIUDBFIBVLB#!IBVbvsoibcjksdcuobsdc"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(3);

            var tokenTemplate = new JwtSecurityToken(
                "localhost:5001",
                "localhost:5001",
                //"somefreedomain.ml",
                //"somefreedomain.ml",
                claims,
                expires: expires,
                signingCredentials: creds
            );

            var token = new JwtSecurityTokenHandler().WriteToken(tokenTemplate);

            if (token != null)
            {
                return token;
            }

            return null;
        }

        private Task<string> GenerateRefreshTokenAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<UserViewModel> SignInUserAsync(SignInViewModel signInViewModel)
        {
            var userAttemptingToSignIn = await _userManager.FindByEmailAsync(signInViewModel.Email);

            if (userAttemptingToSignIn == null)
            {
                return null;
            }

            userAttemptingToSignIn.Languages = _dbContext.UserLanguages
                .Where(element => element.ApplicationUserId == userAttemptingToSignIn.Id)
                .Select(el => new UserLanguage()
                {
                    ApplicationUserId = el.ApplicationUserId,
                    User = el.User,
                    LanguageId = el.LanguageId,
                    Language = _dbContext.Languages.First(lang => lang.Id == el.LanguageId)
                }).ToList();

            userAttemptingToSignIn.Regions = _dbContext.UserRegions
                .Where(element => element.ApplicationUserId == userAttemptingToSignIn.Id)
                .Select(ur => new UserRegion()
                {
                    ApplicationUserId = ur.ApplicationUserId,
                    User = ur.User,
                    RegionId = ur.RegionId,
                    Region = _dbContext.Regions.First(reg => reg.Id == ur.RegionId)
                }).ToList();

            userAttemptingToSignIn.Positions = _dbContext.ApplicationUserPositions
            .Where(element => element.ApplicationUserId == userAttemptingToSignIn.Id)
            .Select(ur => new ApplicationUserPosition()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                PositionId = ur.PositionId,
                Position = _dbContext.Positions.First(position => position.Id == ur.PositionId)
            }).ToList();

            userAttemptingToSignIn.Educations = _dbContext.ApplicationUserEducations
            .Where(element => element.ApplicationUserId == userAttemptingToSignIn.Id)
            .Select(ur => new ApplicationUserEducation()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                EducationId = ur.EducationId,
                Education = _dbContext.Educations.First(education => education.Id == ur.EducationId)
            }).ToList();

            userAttemptingToSignIn.SectorsOfActivities = _dbContext.ApplicationUserSectorsOfActivities
            .Where(element => element.ApplicationUserId == userAttemptingToSignIn.Id)
            .Select(ur => new ApplicationUserSectorOfActivity()
            {
                ApplicationUserId = ur.ApplicationUserId,
                ApplicationUser = ur.ApplicationUser,
                SectorOfActivityId = ur.SectorOfActivityId,
                SectorOfActivity = _dbContext.SectorsOfActivity.First(soa => soa.Id == ur.SectorOfActivityId)
            }).ToList();

            userAttemptingToSignIn.Gender = await _dbContext.Gender.FirstAsync(g => g.Id == userAttemptingToSignIn.GenderId);
            userAttemptingToSignIn.AgeGroupModel = await _dbContext.AgeGroups.FirstOrDefaultAsync(ag => ag.Id == userAttemptingToSignIn.AgeGroupModelId);

            var signIn = await _signInManager.PasswordSignInAsync(userAttemptingToSignIn, signInViewModel.Password, false, false);

            if (!signIn.Succeeded)
            {
                return null;
            }

            var token = await GenerateAccessTokenAsync(userAttemptingToSignIn);

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

            var userCreation = await _userManager.CreateAsync(newUser, registerViewModel.Password);

            await _userManager.AddToRoleAsync(newUser, "User");

            if (!userCreation.Succeeded)
            {
                return null;
            }

            var userViewModel = _mapper.Map<UserViewModel>(newUser);

            return userViewModel;
        }
    }
}
