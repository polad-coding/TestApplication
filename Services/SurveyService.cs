using AutoMapper;
using KPProject.Data;
using KPProject.HelperMethods;
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

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public SurveyService(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _applicationDbContext = dbContext;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<bool> CreateSurveysAsync(List<CreateOrderViewModel> orders, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var userIsPractitioner = await this._userManager.IsInRoleAsync(user, "Practitioner");
            var survey = new SurveyModel();

            foreach (var order in orders)
            {
                for (int i = 0; i < order.NumberOfUsages; i++)
                {
                    survey = new SurveyModel { Seed = SurveyServiceHelperMethods.GenerateRandomSeed(), Code = order.CodeBody, SurveyTakerUserId = userIsPractitioner ? null : userId, PractitionerUserId = userIsPractitioner ? userId : null, TakenOn = null };
                    await _applicationDbContext.Surveys.AddAsync(survey);
                }
            }

            var numberOfRowsChanged = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsChanged > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> SaveFirstStageResultsAsync(List<ValueModel> values, int surveyId)
        {
            List<SurveyFirstStageModel> surveyFirstStageModels = new List<SurveyFirstStageModel>();
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);

            if (survey.FirstStagePassed)
            {
                var entriesToDelete = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).ToListAsync();

                _applicationDbContext.SurveyFirstStages.RemoveRange(entriesToDelete);
                await _applicationDbContext.SaveChangesAsync();
            }

            values.ForEach(v =>
            {
                surveyFirstStageModels.Add(new SurveyFirstStageModel() { SurveyId = surveyId, ValueId = v.Id });
            });

            await _applicationDbContext.SurveyFirstStages.AddRangeAsync(surveyFirstStageModels);

            survey.FirstStagePassed = true;

            _applicationDbContext.Surveys.Update(survey);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> SaveSecondStageResultsAsync(List<ValueModel> values, int surveyId)
        {
            List<SurveySecondStageModel> surveySecondStageModels = new List<SurveySecondStageModel>();
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);


            if (survey.SecondStagePassed)
            {
                var entriesToDelete = await _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId).ToListAsync();

                _applicationDbContext.SurveySecondStages.RemoveRange(entriesToDelete);
                await _applicationDbContext.SaveChangesAsync();
            }

            values.ForEach(v =>
            {
                surveySecondStageModels.Add(new SurveySecondStageModel() { SurveyId = surveyId, ValueId = v.Id });
            });

            await _applicationDbContext.SurveySecondStages.AddRangeAsync(surveySecondStageModels);

            survey.SecondStagePassed = true;

            _applicationDbContext.Surveys.Update(survey);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> SaveThirdStageResultsAsync(List<PrioritizedValueViewModel> values, int surveyId)
        {
            List<SurveyThirdStageModel> surveyThirdStageModels = new List<SurveyThirdStageModel>();

            values.ForEach(v =>
            {
                surveyThirdStageModels.Add(new SurveyThirdStageModel() { SurveyId = surveyId, ValueId = v.Id, ValuePriority = v.Priority });
            });

            await _applicationDbContext.SurveyThirdStages.AddRangeAsync(surveyThirdStageModels);

            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            survey.ThirdStagePassed = true;
            survey.TakenOn = DateTime.Now;

            _applicationDbContext.Surveys.Update(survey);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            return true;
        }

        public async Task<List<double>> GetTheRelativeWeightOfThePerspectivesAsync(int surveyId)
        {
            var perspectives = await _applicationDbContext.Perspectives.ToListAsync();

            //To calculate how many values we have at each perspective.
            var vOfEachPerspective = (await _applicationDbContext.Values.ToListAsync()).GroupBy((v) => v.PerspectiveId).ToList();

            //To calculate how many values were selected at the first stage in each perspective.
            var cOfEachPerspective = (await _applicationDbContext.SurveyFirstStages.Where(sfm => sfm.SurveyId == surveyId).Select(v => v.Value).ToListAsync()).GroupBy(v => v.PerspectiveId);

            //To calculate how many values were selected at the second stage in each perspective.
            var numberOfValuesSelectedAtSecondStageForEachPerspective = (await _applicationDbContext.SurveySecondStages.Where(sst => sst.SurveyId == surveyId).Select(v => v.Value).ToListAsync()).GroupBy(v => v.PerspectiveId);

            //To calculate the sum of the values priorities selected at the third stage in each perspective.
            var rankingOfValuesAtTheThirdStageOfASurveyForEachPerspective =
                (await _applicationDbContext.SurveyThirdStages
                .Where(sts => sts.SurveyId == surveyId)
                .Select(sts => new { priority = sts.ValuePriority, value = sts.Value }).ToListAsync())
                .OrderBy(v => v.value.PerspectiveId);

            //For each value, we add: 1 if selected at the first step of the survey, 2 if selected at the second step and the priority - 9 if 1st, 8 if 2nd, 7 if 3rd…
            var tOfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };
            //Calculated by formula  'c / v * t / v'
            var WOfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };

            for (int i = 0; i < tOfEachPerspective.Count; i++)
            {
                //To calculate number of values selected first stage for given perspective.
                var cOfSpecificPerspective = cOfEachPerspective.FirstOrDefault(e => e.Key == i + 1);
                //To calculate number of values selected second stage for given perspective.
                var numberOfValuesSelectedAtSecondStepForSpecificPerspective = numberOfValuesSelectedAtSecondStageForEachPerspective.FirstOrDefault(e => e.Key == i + 1);
                //To calculate the sum of the values priorities selected at the third stage for given perspective.
                var theSumOfValuesPrioritiesSelectedAtThirdStepForSpecificPerspective = rankingOfValuesAtTheThirdStageOfASurveyForEachPerspective.Where(e => e.value.PerspectiveId == i + 1).Sum(e => 10 - e.priority);

                tOfEachPerspective[i] = cOfSpecificPerspective == null ? 0 : cOfSpecificPerspective.Count() +
                (numberOfValuesSelectedAtSecondStepForSpecificPerspective == null ? 0 : numberOfValuesSelectedAtSecondStepForSpecificPerspective.Count() * 2) +
                theSumOfValuesPrioritiesSelectedAtThirdStepForSpecificPerspective;

                //Represents 't / v'.
                var a = (Convert.ToDouble(tOfEachPerspective[i]) / Convert.ToDouble(vOfEachPerspective.First(e => e.Key == i + 1).Count()));
                //Represents 'c / v'.
                var b = (Convert.ToDouble(cOfSpecificPerspective == null ? 0 : cOfSpecificPerspective.Count()) / Convert.ToDouble(vOfEachPerspective.First(e => e.Key == i + 1).Count()));

                WOfEachPerspective[i] = a * b;
            }

            //Result in %.
            var ROfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };

            for (int i = 0; i < WOfEachPerspective.Count; i++)
            {
                ROfEachPerspective[i] = (WOfEachPerspective[i] / WOfEachPerspective.Sum(e => e)) * 100;
            }

            return ROfEachPerspective;
        }

        public async Task<List<ValueModel>> GetSurveyThirdStageResultsAsync(int surveyId)
        {
            var values = await _applicationDbContext.SurveyThirdStages
                .Where(sts => sts.SurveyId == surveyId)
                .OrderBy(sts => sts.ValuePriority)
                .Select(sts => sts.Value)
                .ToListAsync();

            return values;
        }

        public async Task<List<SurveyResultViewModel>> GetSurveysOfTheGivenUserAsync(string userId)
        {
            var surveysTaken = await _applicationDbContext.Surveys.
                Where(survey => survey.SurveyTakerUserId == userId || survey.PractitionerUserId == userId)
                .Include(survey => survey.PractitionerUser)
                .Include(survey => survey.SurveyTakerUser)
                .ToListAsync();

            var surveyResults = new List<SurveyResultViewModel>();

            foreach (var survey in surveysTaken)
            {
                surveyResults.Add(new SurveyResultViewModel()
                {
                    Code = survey.Code,
                    IsCompleated = survey.ThirdStagePassed && survey.AnonymisedUserId != null,
                    SurveyId = survey.Id,
                    TakenOn = survey.TakenOn.ToString(),
                    PractitionerId = survey.PractitionerUserId,
                    PractitionerFullName = survey.PractitionerUser == null ? "" : survey.PractitionerUser.FirstName + " " + survey.PractitionerUser.LastName.ToUpper(),
                    TakersEmail = survey.SurveyTakerUser == null ? null : survey.SurveyTakerUser.Email,
                    FirstStagePassed = survey.FirstStagePassed
                });
            }

            return surveyResults;
        }

        /// <summary>
        /// Gets the values shuffled with the survey seed when the survey begins.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId)
        {
            var surveySeed = await _applicationDbContext.Surveys.Where(survey => survey.Id == surveyId).Select(survey => survey.Seed).FirstAsync();

            var values = new List<ValueModel>();
            values = await _applicationDbContext.Values.ToListAsync();

            SurveyServiceHelperMethods.Shuffle(values, surveySeed);

            return values;
        }

        /// <summary>
        /// Gets the values selected at the first stage of the survey.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <returns></returns>
        public async Task<List<ValueModel>> GetFirstStageValuesAsync(int surveyId)
        {
            var values = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).Select(sfs => sfs.Value).ToListAsync();

            return values;
        }

        public async Task<List<ValueModel>> GetSecondStageValuesAsync(int surveyId)
        {
            var values = await _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId).Select(sss => sss.Value).ToListAsync();

            return values;
        }

        public async Task<List<ValueModel>> GetThirdStageValuesAsync(int surveyId)
        {
            var values = await _applicationDbContext.SurveyThirdStages.Where(sts => sts.SurveyId == surveyId).Select(sts => sts.Value).ToListAsync();

            return values;
        }

        public async Task<string> DecideToWhichStageToTransferAsync(int surveyId)
        {
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);

            if (survey.ThirdStagePassed)
            {
                return "wrap-up";
            }
            else if (survey.SecondStagePassed)
            {
                return "surveyThirdStage";
            }
            else if (survey.FirstStagePassed)
            {
                return "surveySecondStage";
            }

            return "surveyFirstStage";
        }

        public async Task<List<List<ReportTableValueViewModel>>> GetValuesSelectionsAtDifferentSurveyStagesAsync(int surveyId)
        {
            var values = new List<ReportTableValueViewModel>();

            await _applicationDbContext.Values.ForEachAsync(v =>
            {
                values.Add(new ReportTableValueViewModel { ValueId = v.Id, PerspectiveId = v.PerspectiveId, ValueCharacter = v.Character });
            });

            foreach (var value in values)
            {
                if (_applicationDbContext.SurveyFirstStages.FirstOrDefault(sfs => sfs.SurveyId == surveyId && sfs.ValueId == value.ValueId) != null)
                {
                    value.SelectedAtFirstStage = true;
                    continue;
                }

                if (_applicationDbContext.SurveySecondStages.FirstOrDefault(sss => sss.SurveyId == surveyId && sss.ValueId == value.ValueId) != null)
                {
                    value.SelectedAtSecondStage = true;
                    continue;
                }

                var thirdStageValuePriority = _applicationDbContext.SurveyThirdStages.FirstOrDefault(sts => sts.SurveyId == surveyId && sts.ValueId == value.ValueId);

                if (thirdStageValuePriority != null)
                {
                    value.ThirdStagePriority = thirdStageValuePriority.ValuePriority;
                }

            }

            var groupedValues = new List<List<ReportTableValueViewModel>>();

            values.GroupBy(v => v.PerspectiveId).ToList().ForEach(vg => groupedValues.Add(vg.ToList()));

            groupedValues = groupedValues.OrderBy(gv => gv[0].PerspectiveId).ToList();

            return groupedValues;
        }

        public async Task<SurveyResultViewModel> GetParticularSurveyResultsAsync(int surveyId)
        {
            var surveyResults = await _applicationDbContext.Surveys.Where(survey => survey.Id == surveyId).Include(survey => survey.SurveyTakerUser).FirstAsync();

            var surveyResultViewModel = _mapper.Map<SurveyModel, SurveyResultViewModel>(surveyResults);

            return surveyResultViewModel;
        }

        public async Task<bool> GoToPreviousStageOfTheSurveyAsync(int surveyId)
        {
            var currentSurvey = await _applicationDbContext.Surveys.FirstAsync(s => s.Id == surveyId);

            if (currentSurvey.SecondStagePassed)
            {
                var rowsToDelete = await _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId).ToListAsync();
                _applicationDbContext.SurveySecondStages.RemoveRange(rowsToDelete);
                currentSurvey.SecondStagePassed = false;
            }
            else if (currentSurvey.FirstStagePassed)
            {
                var rowsToDelete = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).ToListAsync();
                _applicationDbContext.SurveyFirstStages.RemoveRange(rowsToDelete);
                currentSurvey.FirstStagePassed = false;
            }

            _applicationDbContext.Update(currentSurvey);

            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteSurveyFirstStageResultsAsync(int surveyId)
        {
            var entrieInEntity = await _applicationDbContext.SurveyFirstStages.FirstOrDefaultAsync(sfs => sfs.SurveyId == surveyId);

            if (entrieInEntity == null)
            {
                return true;
            }

            var rowsToDelete = _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId);
            _applicationDbContext.SurveyFirstStages.RemoveRange(rowsToDelete);
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            survey.FirstStagePassed = false;

            _applicationDbContext.Surveys.Update(survey);

            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteSurveySecondStageResultsAsync(int surveyId)
        {
            var entrieInEntity = await _applicationDbContext.SurveySecondStages.FirstOrDefaultAsync(sss => sss.SurveyId == surveyId);

            if (entrieInEntity == null)
            {
                return true;
            }

            var rowsToDelete = _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId);
            _applicationDbContext.SurveySecondStages.RemoveRange(rowsToDelete);
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            survey.SecondStagePassed = false;

            _applicationDbContext.Surveys.Update(survey);
            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
        }


    }
}
