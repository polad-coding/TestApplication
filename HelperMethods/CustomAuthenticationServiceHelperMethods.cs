using KPProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace KPProject.HelperMethods
{
    public class CustomAuthenticationServiceHelperMethods
    {
        public static async Task<string> GenerateAccessTokenAsync(ApplicationUser user, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            var userRoles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, userRoles.First())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JwtKey").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(3);

            var tokenTemplate = new JwtSecurityToken(
                configuration.GetSection("JwtIssuer").Value,
                configuration.GetSection("JwtIssuer").Value,
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
    }
}
