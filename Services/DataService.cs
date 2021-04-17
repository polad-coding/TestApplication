using CsvHelper;
using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Maps;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KPProject.Services
{
    public class DataService : IDataService
    {

        private readonly ApplicationDbContext _applicationDbContext;
        private readonly List<string> _languages = new List<string>() { "EN" };

        public DataService(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;

        }

        public async Task PopulateDBWithValuesAsync()
        {
            if (_applicationDbContext.Values.Count() == 102)
            {
                return;
            }

            using (var reader = new StreamReader(".\\ClientApp\\src\\assets\\Files\\values.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Context.RegisterClassMap<ValueMap>();
                var data = csv.GetRecords<ValueModel>().ToList();

                data.RemoveAt(0);

                await _applicationDbContext.Values.AddRangeAsync(data);
                await _applicationDbContext.SaveChangesAsync();
            }
        }

        public async Task PopulateDBWithPerspectivesAsync()
        {
            if (_applicationDbContext.Perspectives.Count() == 6)
            {
                return;
            }

            for (int i = 1; i < 7; i++)
            {
                await _applicationDbContext.Perspectives.AddAsync(new PerspectiveModel());
            }

            await _applicationDbContext.SaveChangesAsync();
        }

        public async Task CreateValuesLanguageFilesAsync()
        {
            using (var reader = new StreamReader(".\\ClientApp\\src\\assets\\Files\\values.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                foreach (var language in _languages)
                {
                    csv.Context.RegisterClassMap(new ValueViewModelMap(language));
                    var data = csv.GetRecords<ValueViewModel>().ToList();

                    data.RemoveAt(0);

                    await CreateValueLanguageFile(language, data);
                }
            }
        }

        private async Task CreateValueLanguageFile(string language, List<ValueViewModel> data)
        {
            using (var writer = new StreamWriter($".\\ClientApp\\src\\assets\\i18n\\val-en.json"))
            {
                StringBuilder text = new StringBuilder();

                text.Append("{ \"Values\" : {");

                foreach (var item in data)
                {
                    text.AppendLine($"\"{item.Character}\" : {JsonConvert.SerializeObject(item)},");
                }

                text.AppendLine("}}");

                await writer.WriteAsync(text);
            }
        }

        public async Task CreatePerspectivesLanguageFilesAsync()
        {
            using (var reader = new StreamReader(".\\ClientApp\\src\\assets\\Files\\perspectives.csv"))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                foreach (var language in _languages)
                {
                    csv.Context.RegisterClassMap(new PerspectiveMap(language));
                    var data = csv.GetRecords<PerspectiveViewModel>().ToList();

                    data.RemoveAt(0);

                    await CreatePerspectiveLanguageFile(language, data);
                }
            }
        }

        private async Task CreatePerspectiveLanguageFile(string language, List<PerspectiveViewModel> data)
        {
            using (var writer = new StreamWriter($".\\ClientApp\\src\\assets\\i18n\\{language.ToLower()}.json"))
            {
                StringBuilder text = new StringBuilder();

                text.AppendLine("{ \"Perspectives\" : {");

                foreach (var item in data)
                {
                    text.AppendLine($"\"{item.Id}\" : {JsonConvert.SerializeObject(item)},");
                }

                text.AppendLine("}}");

                await writer.WriteAsync(text.ToString());
            }
        }

        public async Task<List<ValueModel>> GetAllValuesFromTheFirstStageAsync(int surveyId)
        {
            var entries = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).ToListAsync();

            var values = new List<ValueModel>();

            entries.ForEach(e => values.Add(e.Value));
            //var seed = await _applicationDbContext.Surveys.FirstAsync(survey => survey.SurveyTakerUserId);

            //this.Shuffle(values);

            return values;
        }

        private void Shuffle(List<ValueModel> values, int seed)
        {
            var rng = new Random(seed);
            int l = values.Count;

            while (l > 1)
            {
                l--;
                int randomIndex = rng.Next(l + 1);
                ValueModel value = values[randomIndex];
                values[randomIndex] = values[l];
                values[l] = value;
            }
        }

        public async Task<List<ValueModel>> GetAllValuesAsync(int surveyId)
        {
            var values = await _applicationDbContext.Values.ToListAsync();
            //var seed = (await _applicationDbContext.Surveys.FindAsync(surveyId)).Seed;

            //this.Shuffle(values, 2);

            return values;
        }

        public async Task<bool> SaveFirstStageResultsAsync(List<ValueModel> values, int surveyId)
        {
            List<SurveyFirstStageModel> surveyFirstStageModels = new List<SurveyFirstStageModel>();

            values.ForEach(v =>
            {
                surveyFirstStageModels.Add(new SurveyFirstStageModel() { SurveyId = surveyId, ValueId = v.Id });
            });

            await _applicationDbContext.SurveyFirstStages.AddRangeAsync(surveyFirstStageModels);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
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

            values.ForEach(v =>
            {
                surveySecondStageModels.Add(new SurveySecondStageModel() { SurveyId = surveyId, ValueId = v.Id });
            });

            await _applicationDbContext.SurveySecondStages.AddRangeAsync(surveySecondStageModels);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
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

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            survey.ThirdStagePassed = true;

            _applicationDbContext.Surveys.Update(survey);

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

            return true;
        }
    }
}
