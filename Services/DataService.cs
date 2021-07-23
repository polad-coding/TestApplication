using AutoMapper;
using CsvHelper;
using KPProject.Data;
using KPProject.Interfaces;
using KPProject.Maps;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly List<string> _languages = new List<string>() { "EN" };
        private readonly IMapper _mapper;

        public DataService(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task PopulateDBWithValuesAsync()
        {
            if (_applicationDbContext.Values.Count() == 102)
            {
                return;
            }

            using (var reader = new StreamReader("ClientApp/src/assets/Files/values.csv"))
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
                    text.AppendLine($"\"{item.Character}\" : {JsonConvert.SerializeObject(item).Replace("'", "\'")},");
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
                    text.AppendLine($"\"{item.Id}\" : {JsonConvert.SerializeObject(item).Replace("'", "\'")},");
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
            var seed = (await _applicationDbContext.Surveys.FirstAsync(survey => survey.Id == surveyId)).Seed;

            //TODO - remove comment here
            this.Shuffle(values, seed);

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

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

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

            if (await _applicationDbContext.SaveChangesAsync() == 0)
            {
                return false;
            }

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
            //Calculate v for each perspective
            var perspectives = await _applicationDbContext.Perspectives.ToListAsync();

            var vOfEachPerspective = ((await _applicationDbContext.Values.ToListAsync()).GroupBy((v) => v.PerspectiveId));

            //Calcualate c for each perspective

            var cOfEachPerspective = (await _applicationDbContext.SurveyFirstStages.Where(sfm => sfm.SurveyId == surveyId).Select(v => v.Value).ToListAsync()).GroupBy(v => v.PerspectiveId);



            //Calculate t for each perspective

            var numberOfValuesSelectedAtSecondStepForEachPerspective = (await _applicationDbContext.SurveySecondStages.Where(sst => sst.SurveyId == surveyId).Select(v => v.Value).ToListAsync()).GroupBy(v => v.PerspectiveId);

            //for (int i = 0; i < perspectives.Count; i++)
            //{
            //    bool hasAKey = false;
            //    cOfEachPerspective.ToList().ForEach(g =>
            //    {
            //        if (g.Key == perspectives[i].Id)
            //        {
            //            hasAKey = true;
            //        }
            //    });

            //    if (!hasAKey)
            //    {
            //        var dummyList = new List<ValueModel>();
            //        dummyList.Add(new ValueModel { PerspectiveId = perspectives[i].Id });

            //        var newGroup = dummyList.GroupBy(v => v.PerspectiveId).ToList();
            //        var newGroupValue = newGroup[0];
            //        cOfEachPerspective.ToList().Add(newGroupValue);
            //        numberOfValuesSelectedAtSecondStepForEachPerspective.ToList().Add(newGroupValue);
            //    }
            //}



            var rankingOfValuesAtTheThirdStageOfASurvey = (await _applicationDbContext.SurveyThirdStages.Where(sts => sts.SurveyId == surveyId).Select(sts => new { priority = sts.ValuePriority, value = sts.Value }).ToListAsync()).OrderBy(v => v.value.PerspectiveId);

            var tOfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };
            var WOfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };

            for (int i = 0; i < tOfEachPerspective.Count; i++)
            {
                var cOfEachPerspectiveAtSpecifikKeyIndex = cOfEachPerspective.FirstOrDefault(e => e.Key == i + 1);
                var numberOfValuesSelectedAtSecondStepForEachPerspectiveAtSpecifikKeyIndex = numberOfValuesSelectedAtSecondStepForEachPerspective.FirstOrDefault(e => e.Key == i + 1);

                tOfEachPerspective[i] = cOfEachPerspectiveAtSpecifikKeyIndex == null ? 0 : cOfEachPerspectiveAtSpecifikKeyIndex.ToList().Count +
                    (numberOfValuesSelectedAtSecondStepForEachPerspectiveAtSpecifikKeyIndex == null ? 0 : numberOfValuesSelectedAtSecondStepForEachPerspectiveAtSpecifikKeyIndex.ToList().Count * 2) +
                    rankingOfValuesAtTheThirdStageOfASurvey.Where(e => e.value.PerspectiveId == i + 1).Sum(e => 10 - e.priority);

                var a = (Convert.ToDouble(tOfEachPerspective[i]) / Convert.ToDouble(vOfEachPerspective.First(e => e.Key == i + 1).ToList().Count));
                var b = (Convert.ToDouble(cOfEachPerspectiveAtSpecifikKeyIndex == null ? 0 : cOfEachPerspectiveAtSpecifikKeyIndex.ToList().Count) / Convert.ToDouble(vOfEachPerspective.First(e => e.Key == i + 1).ToList().Count));

                WOfEachPerspective[i] = a * b;
            }

            var ROfEachPerspective = new List<double>() { 0, 0, 0, 0, 0, 0 };

            for (int i = 0; i < WOfEachPerspective.Count; i++)
            {
                ROfEachPerspective[i] = (WOfEachPerspective[i] / WOfEachPerspective.Sum(e => e)) * 100;
            }


            return ROfEachPerspective;
        }

        public async Task<List<ValueModel>> GetSurveyThirdStageResultsAsync(int surveyId)
        {
            var values = (await _applicationDbContext.SurveyThirdStages.Where(sts => sts.SurveyId == surveyId).Select(sts => new { priority = sts.ValuePriority, value = sts.Value }).ToListAsync()).OrderBy(v => v.priority).Select(v => v.value).ToList();

            //var values = (await _applicationDbContext.SurveyThirdStages.Where(sts => sts.SurveyId == surveyId).ToListAsync()).OrderBy(e => e.ValuePriority).Select(v => v.Value).ToList();

            return values;
        }

        public async Task<List<OrderModel>> GenerateCodesAsync(List<OrderViewModel> ordersList, string userId)
        {
            //Generate code
            var generatedCode = "";
            var ordersToSave = new List<OrderModel>();
            //Create entry in DB
            ordersList.ForEach(async order =>
            {
                for (int i = 0; i < order.NumberOfUsages / order.DefaultNumberOfUsages; i++)
                {
                    generatedCode = await this.GenerateNewCode();
                    ordersToSave.Add(new OrderModel { NumberOfUsages = order.DefaultNumberOfUsages, UserId = userId, CodeBody = generatedCode });
                }
            });

            //TODO - Decrease number of usages for each coupon

            await _applicationDbContext.Orders.AddRangeAsync(ordersToSave);

            await this.DecreaseNumberOfUsagesOfAssociatedCoupons(ordersList);

            if (await _applicationDbContext.SaveChangesAsync() > 0)
            {
                return ordersToSave;
            }

            return null;
        }

        private async Task DecreaseNumberOfUsagesOfAssociatedCoupons(List<OrderViewModel> ordersList)
        {
            ordersList.ForEach(o =>
            {
                if (o.CouponBody != null)
                {
                    var coupon = _applicationDbContext.AssociatedCoupons.FirstOrDefault(ac => ac.CouponBody == o.CouponBody);

                    if (coupon != null)
                    {
                        if (coupon.NumberOfUsagesLeft == 1)
                        {
                            _applicationDbContext.AssociatedCoupons.Remove(coupon);
                        }
                        else
                        {
                            coupon.NumberOfUsagesLeft -= 1;
                            _applicationDbContext.AssociatedCoupons.Update(coupon);
                        }
                    }
                }
            });
        }

        private async Task<string> GenerateNewCode()
        {
            var codesLength = 9;
            var code = new StringBuilder();
            var randomSequence = Guid.NewGuid().ToString();
            var randomGenerator = new Random();

            for (int i = 0; i < codesLength; i++)
            {
                var character = randomSequence[randomGenerator.Next(randomSequence.Length)].ToString().ToUpper();
                code.Append(character);
            }

            return code.ToString();
        }

        public async Task<List<SurveyResultViewModel>> GetSurveyResultsAsync(string userId)
        {
            var surveysTaken = await _applicationDbContext.Surveys.Where(survey => survey.SurveyTakerUserId == userId || survey.PractitionerUserId == userId).ToListAsync();
            var surveyResults = new List<SurveyResultViewModel>();

            surveysTaken.ForEach(survey =>
            {
                var practitioner = _applicationDbContext.Users.FirstOrDefault(u => u.Id == survey.PractitionerUserId);
                var practitionerFullName = practitioner == null ? "" : practitioner.FirstName + " " + practitioner.LastName.ToUpper();
                var surveyTaker = _userManager.FindByIdAsync(survey.SurveyTakerUserId).Result;
                var surveyTakerEmail = surveyTaker.Email;

                surveyResults.Add(new SurveyResultViewModel()
                {
                    Code = survey.Code,
                    IsCompleated = survey.ThirdStagePassed && survey.AnonymisedUserId != null,
                    SurveyId = survey.Id,
                    TakenOn = survey.TakenOn.ToString(),
                    PractitionerId = survey.PractitionerUserId,
                    PractitionerFullName = practitionerFullName,
                    TakersEmail = surveyTakerEmail
                });
            });

            return surveyResults;
        }

        public async Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId)
        {
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            var values = new List<ValueModel>();

            values = await _applicationDbContext.Values.ToListAsync();
            //TODO - remove comment here
            this.Shuffle(values, survey.Seed);

            return values;
        }

        public async Task<List<ValueModel>> GetFirstStageValuesAsync(int surveyId)
        {
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            var values = new List<ValueModel>();

            var elements = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).Select(sfs => sfs.Value).ToListAsync();

            elements.ForEach(e =>
            {
                values.Add(e);
            });

            return values;
        }

        public async Task<List<ValueModel>> GetSecondStageValuesAsync(int surveyId)
        {
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            var values = new List<ValueModel>();

            var elements = await _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId).Select(sss => sss.Value).ToListAsync();

            elements.ForEach(e =>
            {
                values.Add(e);
            });

            return values;
        }

        public async Task<List<ValueModel>> GetTheCurrentStageValuesAsync(int surveyId)
        {
            var survey = await _applicationDbContext.Surveys.FindAsync(surveyId);
            var values = new List<ValueModel>();

            if (survey.ThirdStagePassed)
            {
                var elements = await _applicationDbContext.SurveyThirdStages.Where(sts => sts.SurveyId == surveyId).Select(sts => sts.Value).ToListAsync();

                elements.ForEach(e =>
                {
                    values.Add(e);
                });
            }
            else if (survey.SecondStagePassed)
            {
                var elements = await _applicationDbContext.SurveySecondStages.Where(sss => sss.SurveyId == surveyId).Select(sss => sss.Value).ToListAsync();

                elements.ForEach(e =>
                {
                    values.Add(e);
                });
            }
            else if (survey.FirstStagePassed)
            {
                var elements = await _applicationDbContext.SurveyFirstStages.Where(sfs => sfs.SurveyId == surveyId).Select(sfs => sfs.Value).ToListAsync();

                elements.ForEach(e =>
                {
                    values.Add(e);
                });
            }
            else
            {
                values = await _applicationDbContext.Values.ToListAsync();
                this.Shuffle(values, survey.Seed);
            }

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

        public async Task<bool> CheckIfCodeIsValidAsync(string code)
        {
            var dbCode = await _applicationDbContext.Surveys.FirstOrDefaultAsync((s) => s.Code == code && s.FirstStagePassed == false);

            if (dbCode != null)
            {
                return true;
            }

            return false;
        }

        public async Task PopulateDBWithCertificationsAsync()
        {
            if (_applicationDbContext.Certifications.Count() != 0)
            {
                return;
            }

            await _applicationDbContext.Certifications.AddAsync(new Certification { CertificationType = "Individual assessment", Level = 1 });
            await _applicationDbContext.Certifications.AddAsync(new Certification { CertificationType = "Group assessment", Level = 2 });
            await _applicationDbContext.Certifications.AddAsync(new Certification { CertificationType = "Individual assessment Certifier", Level = 3 });
            await _applicationDbContext.Certifications.AddAsync(new Certification { CertificationType = "Group assessment Certifier", Level = 4 });

            await _applicationDbContext.SaveChangesAsync();

        }

        public async Task<List<Certification>> GetAllCertificationsAsync()
        {
            var certifications = await _applicationDbContext.Certifications.ToListAsync();

            return certifications;
        }

        public async Task<List<ApplicationUserCertification>> GetPractitionersCertificationsAsync(string userId)
        {
            var userCertifications = await _applicationDbContext.ApplicationUserCertifications.Where(auc => auc.ApplicationUserId == userId).ToListAsync();

            userCertifications.ForEach(uc =>
            {
                uc.Certification = _applicationDbContext.Certifications.Find(uc.CertificationId);
            });

            return userCertifications;
        }

        public async Task<Membership> GetMembershipStatusAsync(string userId)
        {
            var membership = await _applicationDbContext.Memberships.FirstOrDefaultAsync(m => m.UserId == userId);

            if (membership == null)
            {
                return null;
            }

            //Check if date is passed
            if (DateTime.Compare(membership.ValidTill.Date, DateTime.Now.Date) < 0)
            {
                _applicationDbContext.Remove(membership);
                await _applicationDbContext.SaveChangesAsync();

                return null;
            }

            return membership;
        }

        public async Task<bool> RenewMembershipAsync(string userId)
        {
            var membershipEntry = await _applicationDbContext.Memberships.FirstOrDefaultAsync(m => m.UserId == userId);

            if (membershipEntry == null)
            {
                await _applicationDbContext.Memberships.AddAsync(new Membership { UserId = userId, ValidTill = DateTime.Now.AddYears(1) });
            }
            else
            {
                membershipEntry.ValidTill = membershipEntry.ValidTill.AddYears(1);
                _applicationDbContext.Memberships.Update(membershipEntry);
            }

            var rowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (rowsAffected > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<List<UserViewModel>> GetPractitionersForDirectoryAsync(PractitionersSearchFilterViewModel practitionersSearchFilterViewModel)
        {
            //var practitioners = await _applicationDbContext.Users.Where(u => _userManager.IsInRoleAsync(u, "PRACTITIONER").Result == true).ToListAsync();
            var users = await _applicationDbContext.Users.ToListAsync();
            var practitioners = new List<ApplicationUser>();

            users.ForEach(u =>
            {
                if (_userManager.IsInRoleAsync(u, "Practitioner").Result)
                {
                    practitioners.Add(u);
                }
            });

            //filter the practitioners
            practitioners = await this.FilterPractitionersOnRegionsAsync(practitioners, practitionersSearchFilterViewModel.GeographicalLocationsSelected);
            practitioners = await this.FilterPractitionersOnLanguagesAsync(practitioners, practitionersSearchFilterViewModel.LanguagesSelected);
            practitioners = await this.FilterPractitionersOnGendersAsync(practitioners, practitionersSearchFilterViewModel.GenderSelected);
            //take the required amount

            if (practitionersSearchFilterViewModel.StartingIndex >= practitioners.Count)
            {
                practitionersSearchFilterViewModel.EndingIndex = practitionersSearchFilterViewModel.EndingIndex - practitionersSearchFilterViewModel.StartingIndex;
                practitionersSearchFilterViewModel.StartingIndex = 0;
            }

            practitioners = practitioners.Skip(practitionersSearchFilterViewModel.StartingIndex).TakeWhile((p, i) => i + practitionersSearchFilterViewModel.StartingIndex < practitionersSearchFilterViewModel.EndingIndex).ToList();

            practitioners.ForEach(p =>
            {
                p.Languages = _applicationDbContext.UserLanguages.Where(ul => ul.ApplicationUserId == p.Id).ToList();
            });

            practitioners.ForEach(p =>
            {
                p.Regions = _applicationDbContext.UserRegions.Where(ur => ur.ApplicationUserId == p.Id).ToList();
            });

            practitioners.ForEach(p =>
            {
                p.Languages.ForEach(l =>
                {
                    l.Language = _applicationDbContext.Languages.Find(l.LanguageId);
                });
            });

            practitioners.ForEach(p =>
            {
                p.Regions.ForEach(r =>
                {
                    r.Region = _applicationDbContext.Regions.Find(r.RegionId);
                });
            });

            var practitionersViewModel = _mapper.Map<List<UserViewModel>>(practitioners);

            return practitionersViewModel;
        }

        private async Task<List<ApplicationUser>> FilterPractitionersOnGendersAsync(List<ApplicationUser> practitioners, Gender gender)
        {
            if (gender == null)
            {
                return practitioners;
            }

            practitioners.ForEach(p =>
            {
                p.Gender = _applicationDbContext.Gender.First(g => g.Id == p.GenderId);
            });


            practitioners = practitioners.Where(p => p.Gender.GenderName == gender.GenderName).ToList();

            return practitioners;
        }

        private async Task<List<ApplicationUser>> FilterPractitionersOnRegionsAsync(List<ApplicationUser> practitioners, List<RegionModel> regions)
        {
            if (regions == null || regions.Count == 0)
            {
                return practitioners;
            }

            practitioners.ForEach(p =>
            {
                p.Regions = _applicationDbContext.UserRegions.Where(ur => ur.ApplicationUserId == p.Id).ToList();
            });


            practitioners = practitioners.Where(p => p.Regions.Where(pr => regions.Any(r => pr.RegionId == r.Id)).Count() > 0).ToList();

            return practitioners;

        }

        private async Task<List<ApplicationUser>> FilterPractitionersOnLanguagesAsync(List<ApplicationUser> practitioners, List<LanguageModel> languages)
        {
            if (languages == null || languages.Count == 0)
            {
                return practitioners;
            }

            practitioners.ForEach(p =>
            {
                p.Languages = _applicationDbContext.UserLanguages.Where(ul => ul.ApplicationUserId == p.Id).ToList();
            });


            practitioners = practitioners.Where(p => p.Languages.Where(pl => languages.Any(l => pl.LanguageId == l.Id)).Count() > 0).ToList();

            //practitioners.ForEach(p => p.Languages.ForEach(pl =>
            //{
            //    if (!languages.Any(l => pl.LanguageId == l.Id))
            //    {
            //        practitioners.Remove(p);
            //    }
            //}));

            return practitioners;
        }

        public async Task<int> ReturnNumberOfPractitionersAsync()
        {
            var users = await _applicationDbContext.Users.ToListAsync();

            users = users.Where(u => _userManager.IsInRoleAsync(u, "Practitioner").Result == true).ToList();

            return users.Count;

        }

        public async Task<List<List<ReportTableValueViewModel>>> GetValuesSelectionsAtDifferentSurveyStagesAsync(int surveyId)
        {
            var values = new List<ReportTableValueViewModel>();

            await _applicationDbContext.Values.ForEachAsync(v =>
            {
                values.Add(new ReportTableValueViewModel { ValueId = v.Id, PerspectiveId = v.PerspectiveId, ValueCharacter = v.Character });
            });

            values.ForEach(v =>
            {
                if (_applicationDbContext.SurveyFirstStages.FirstOrDefault(sfs => sfs.SurveyId == surveyId && sfs.ValueId == v.ValueId) != null)
                {
                    v.SelectedAtFirstStage = true;
                }

                if (_applicationDbContext.SurveySecondStages.FirstOrDefault(sss => sss.SurveyId == surveyId && sss.ValueId == v.ValueId) != null)
                {
                    v.SelectedAtSecondStage = true;
                }

                var thirdStageValuePriority = _applicationDbContext.SurveyThirdStages.FirstOrDefault(sts => sts.SurveyId == surveyId && sts.ValueId == v.ValueId);

                if (thirdStageValuePriority != null)
                {
                    v.ThirdStagePriority = thirdStageValuePriority.ValuePriority;
                }
            });

            var groupedValues = new List<List<ReportTableValueViewModel>>();

            values.GroupBy(v => v.PerspectiveId).ToList().ForEach(vg => groupedValues.Add(vg.ToList()));

            groupedValues = groupedValues.OrderBy(gv => gv[0].PerspectiveId).ToList();

            return groupedValues;
        }

        public async Task<SurveyResultViewModel> GetParticularSurveyResultsAsync(int surveyId)
        {
            var surveyResults = await _applicationDbContext.Surveys.FindAsync(surveyId);

            surveyResults.SurveyTakerUser = await _applicationDbContext.Users.FindAsync(surveyResults.SurveyTakerUserId);

            var surveyResultViewModel = _mapper.Map<SurveyModel, SurveyResultViewModel>(surveyResults);

            return surveyResultViewModel;
        }

        public async Task<bool> UserHasUnsignedSurveysAsync(string userId)
        {
            var unsignedSurvey = await _applicationDbContext.Surveys.FirstOrDefaultAsync((s) => s.SurveyTakerUserId == userId && s.ThirdStagePassed == true && s.AnonymisedUserId == null);

            if (unsignedSurvey == null)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> AssociateUserDataToTheSurveyAsync(string userId)
        {
            var user = await _applicationDbContext.Users.FirstAsync((u) => u.Id == userId);
            var userRegions = await _applicationDbContext.UserRegions.Where(ur => ur.ApplicationUserId == userId).ToListAsync();

            var anonymisedUser = new AnonymisedUser() { Age = user.Age, Gender = user.Gender, Education = user.Education, Position = user.Position, MyerBriggsCode = user.MyerBriggsCode, SectorOfActivity = user.SectorOfActivity };

            await _applicationDbContext.AnonymisedUsers.AddAsync(anonymisedUser);

            await _applicationDbContext.SaveChangesAsync();

            var anonymisedUserRegions = new List<AnonymisedUserRegion>();

            userRegions.ForEach((ur) =>
            {
                anonymisedUserRegions.Add(new AnonymisedUserRegion() { AnonymisedUserId = anonymisedUser.Id, RegionId = ur.RegionId });
            });

            await _applicationDbContext.AnonymisedUserRegions.AddRangeAsync(anonymisedUserRegions);

            await _applicationDbContext.SaveChangesAsync();

            var unsignedSurvey = await _applicationDbContext.Surveys.FirstAsync((s) => s.SurveyTakerUserId == userId && s.ThirdStagePassed == true && s.AnonymisedUserId == null);

            unsignedSurvey.AnonymisedUserId = anonymisedUser.Id;

            _applicationDbContext.Surveys.Update(unsignedSurvey);

            if (await _applicationDbContext.SaveChangesAsync() > 0)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> TransferTheCodeAsync(TransferCodesViewModel transferCodesViewModel)
        {
            var order = await _applicationDbContext.Surveys.FirstOrDefaultAsync(s => s.Code == transferCodesViewModel.Code && s.PractitionerUserId != transferCodesViewModel.UserId);

            if (order == null)
            {
                return false;
            }

            order.SurveyTakerUserId = transferCodesViewModel.UserId;


            _applicationDbContext.Update(order);


            var numberOfRowsAffected = await _applicationDbContext.SaveChangesAsync();

            if (numberOfRowsAffected > 0)
            {
                return true;
            }

            return false;
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

        public async Task PopulateDBWithCoupons()
        {
            var numberOfGeneralCoupons = await _applicationDbContext.GeneralCoupons.CountAsync();
            var numberOfAssociatedCoupons = await _applicationDbContext.AssociatedCoupons.CountAsync();
            if (numberOfAssociatedCoupons == 0 && numberOfGeneralCoupons == 0)
            {
                var listOfGeneralCoupons = new List<GeneralCoupon>();

                listOfGeneralCoupons.Add(new GeneralCoupon { CouponBody = "IAMSTUDENT", DiscountRate = 20.00 });
                listOfGeneralCoupons.Add(new GeneralCoupon { CouponBody = "IAMDISABLED", DiscountRate = 40.00 });
                listOfGeneralCoupons.Add(new GeneralCoupon { CouponBody = "IAMINNEED", DiscountRate = 40.00 });
                listOfGeneralCoupons.Add(new GeneralCoupon { CouponBody = "IAMCOOL", DiscountRate = 99.00 });

                await _applicationDbContext.GeneralCoupons.AddRangeAsync(listOfGeneralCoupons);

                var listOfAssociatedCoupons = new List<AssociatedCoupon>();

                listOfAssociatedCoupons.Add(new AssociatedCoupon { CouponBody = "JNKASI2", NumberOfUsagesLeft = 10, DiscountRate = 50.00 });
                listOfAssociatedCoupons.Add(new AssociatedCoupon { CouponBody = "NLNBJJS", NumberOfUsagesLeft = 1, DiscountRate = 80.00 });
                listOfAssociatedCoupons.Add(new AssociatedCoupon { CouponBody = "JNKJNK9", NumberOfUsagesLeft = 5, DiscountRate = 65.00 });

                await _applicationDbContext.AssociatedCoupons.AddRangeAsync(listOfAssociatedCoupons);

                await _applicationDbContext.SaveChangesAsync();

                listOfAssociatedCoupons.ForEach(ac =>
                {
                    _applicationDbContext.ApplicationUserAssociatedCoupons.Add(new ApplicationUserAssociatedCoupon { AssociatedCouponId = ac.Id, ApplicationUserId = "3a10366e-4d73-441d-a18c-43deb1e508c7" });
                });


                await _applicationDbContext.SaveChangesAsync();
            }
        }

        public async Task<GetCouponRequestResponseViewModel> GetCouponAsync(string couponBody, string userId)
        {
            GetCouponRequestResponseViewModel response;
            var generalCoupon = await _applicationDbContext.GeneralCoupons.FirstOrDefaultAsync(gc => gc.CouponBody == couponBody);

            if (generalCoupon != null)
            {
                response = new GetCouponRequestResponseViewModel { Id = generalCoupon.Id, CouponBody = couponBody, NumberOfUsagesLeft = null, DiscountRate = generalCoupon.DiscountRate };
                return response;
            }

            var associatedCoupon = await _applicationDbContext.AssociatedCoupons.FirstOrDefaultAsync(ac => ac.CouponBody == couponBody && ac.ApplicationUserAssociatedCoupons.FirstOrDefault(auac => auac.ApplicationUserId == userId && auac.AssociatedCouponId == ac.Id) != null);

            if (associatedCoupon != null)
            {
                response = new GetCouponRequestResponseViewModel { Id = associatedCoupon.Id, CouponBody = couponBody, NumberOfUsagesLeft = associatedCoupon.NumberOfUsagesLeft, DiscountRate = associatedCoupon.DiscountRate };
                return response;
            }

            return null;
        }

        public async Task<bool> CheckIfAllCouponsAreValidAsync(List<OrderViewModel> orders)
        {

            foreach (var order in orders)
            {
                if (order.CouponBody == null)
                {
                    continue;
                }

                var coupon = _applicationDbContext.AssociatedCoupons.FirstOrDefault(ac => ac.CouponBody == order.CouponBody);

                if (coupon == null)
                {
                    continue;
                }

                var numberOfDuplicateCoupons = 0;
                orders.ForEach(o =>
                {
                    if (o.CouponBody == order.CouponBody)
                    {
                        numberOfDuplicateCoupons += 1 * o.NumberOfUsages;
                    }
                });

                if (coupon.NumberOfUsagesLeft < numberOfDuplicateCoupons)
                {
                    return false;

                }
            }

            return true;
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

        public async Task<List<RegionModel>> GetSelectedRegionsForCurrentUserAsync(string userId)
        {
            var regions = await _applicationDbContext.UserRegions.Where(ur => ur.ApplicationUserId == userId).Select(ur => ur.Region).ToListAsync();

            return regions;
        }


    }
}
