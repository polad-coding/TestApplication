using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        //public async Task<SurveyModel> CreateSurveyAsync(string code, string userId, string surveyPractitionerId, int numberOfUsages)
        //{
        //    var seed = this.GenerateRandomSeed();
        //    var user = await _userManager.FindByIdAsync(userId);

        //    var survey = new SurveyModel { Code = code, SurveyTakerUserId = userId, PractitionerUserId = surveyPractitionerId,  TakenOn = null,  Seed = seed };

        //    await _dbContext.Surveys.AddAsync(survey);

        //    var numberOfRowsChanged = await _dbContext.SaveChangesAsync();

        //    if (numberOfRowsChanged > 0)
        //    {
        //        return survey;
        //    }

        //    return null;
        //}

        public async Task<bool> CreateSurveyAsync(List<CreateOrderViewModel> orders, string userId)
        {
            var seed = 0;
            var user = await _userManager.FindByIdAsync(userId);
            var userIsPractitioner = await this._userManager.IsInRoleAsync(user, "Practitioner");
            var survey = new SurveyModel();

            foreach (var order in orders)
            {
                for (int i = 0; i < order.NumberOfUsages; i++)
                {
                    seed = GenerateRandomSeed();
                    survey = new SurveyModel { Code = order.CodeBody, SurveyTakerUserId = userIsPractitioner ? null : userId, PractitionerUserId = userIsPractitioner? userId: null, TakenOn = null, Seed = seed };
                    await _dbContext.Surveys.AddAsync(survey);
                }
            }

            var numberOfRowsChanged = await _dbContext.SaveChangesAsync();

            if (numberOfRowsChanged > 0)
            {
                return true;
            }

            return false;
        }
    }
}
