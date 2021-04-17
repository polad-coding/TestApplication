using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class SurveyService : ISurveyService
    {

        private readonly ApplicationDbContext _dbContext;

        public SurveyService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        private int GenerateRandomSeed()
        {
            Random r = new Random();

            var seed = r.Next();

            return seed;
        }

        public async Task<SurveyModel> CreateSurveyAsync(string code, string userId)
        {
            var seed = this.GenerateRandomSeed();
            var survey = new SurveyModel { Code = code, SurveyTakerUserId = userId, Seed = seed };

            await _dbContext.Surveys.AddAsync(survey);

            var numberOfRowsChanged = await _dbContext.SaveChangesAsync();

            if (numberOfRowsChanged > 0)
            {
                return survey;
            }

            return null;
        }
    }
}
