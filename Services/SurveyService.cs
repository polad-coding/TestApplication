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

        public async Task<SurveyModel> CreateSurveyAsync(string code, string userId, string surveyPractitionerId)
        {
            var seed = this.GenerateRandomSeed();
            var survey = new SurveyModel { Code = code, SurveyTakerUserId = userId, PractitionerUserId = surveyPractitionerId, TakenOn = DateTime.UtcNow, Seed = seed };

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
