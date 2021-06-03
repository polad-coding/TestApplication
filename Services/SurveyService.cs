using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class SurveyService : ISurveyService
    {

        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public SurveyService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        private int GenerateRandomSeed()
        {
            Random r = new Random();

            var seed = r.Next();

            return seed;
        }

        public async Task<SurveyModel> CreateSurveyAsync(string code, string userId, string surveyPractitionerId)
        {
            var seed = this.GenerateRandomSeed();
            var user = await _userManager.FindByIdAsync(userId);
            var anonymisedUser = new AnonymisedUser {
                Gender = user.Gender,
                Age = user.Age,
                Education = user.Education,
                MyerBriggsCode = user.MyerBriggsCode,
                Position = user.Position,
                SectorOfActivity = user.SectorOfActivity
            };

            await _dbContext.AnonymisedUsers.AddAsync(anonymisedUser);

            await _dbContext.SaveChangesAsync();

            var anonimysedUserRegions = new List<AnonymisedUserRegion>();

            _dbContext.UserRegions
                .Where(ur => ur.ApplicationUserId == userId)
                .Select(ur => ur.RegionId).ToList()
                .ForEach(id => anonimysedUserRegions.Add(new AnonymisedUserRegion { AnonymisedUserId = anonymisedUser.Id, RegionId = id }));

            await _dbContext.AnonymisedUserRegions.AddRangeAsync(anonimysedUserRegions);

            await _dbContext.SaveChangesAsync();

            var survey = new SurveyModel { Code = code, SurveyTakerUserId = userId, PractitionerUserId = surveyPractitionerId, AnonymisedUserId = anonymisedUser.Id, TakenOn = DateTime.UtcNow, Seed = seed };

            await _dbContext.Surveys.AddAsync(survey);

            var numberOfRowsChanged = await _dbContext.SaveChangesAsync();



            if (numberOfRowsChanged > 0)
            {
                //Change codes format to quid
                var order = _dbContext.Orders.Where(order => order.CodeBody == code).First();

                order.NumberOfUsages -= 1;

                _dbContext.Update(order);

                var rowsWithNumberOfUsagesChanged = await _dbContext.SaveChangesAsync();

                if (rowsWithNumberOfUsagesChanged > 0)
                {
                    return survey;
                }

            }

            return null;
        }
    }
}
