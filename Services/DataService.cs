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
        private const int CURRENT_NUMBER_OF_VALUES = 102;
        private const int CURRENT_NUMBER_OF_PERSPECTIVES = 6;
        private readonly List<string> _languages = new List<string>() { "EN" };
        private readonly IMapper _mapper;

        public DataService(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _applicationDbContext = applicationDbContext;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task PopulateDBWithValuesAsync()
        {
            if (_applicationDbContext.Values.Count() == CURRENT_NUMBER_OF_VALUES)
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
            if (_applicationDbContext.Perspectives.Count() == CURRENT_NUMBER_OF_PERSPECTIVES)
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

        public async Task<List<ValueModel>> GetAllValuesAsync()
        {
            var values = await _applicationDbContext.Values.ToListAsync();

            return values;
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

        public async Task<List<UserViewModel>> GetPractitionersForDirectoryAsync(PractitionersSearchFilterViewModel practitionersSearchFilterViewModel)
        {
            var users = await _applicationDbContext.Users
                .Include(u => u.Languages).ThenInclude(languages => languages.Language)
                .Include(u => u.Regions).ThenInclude(regions => regions.Region)
                .Include(u => u.Gender)
                .ToListAsync();

            var practitioners = new List<ApplicationUser>();

            foreach (var user in users)
            {
                if (await _userManager.IsInRoleAsync(user, "Practitioner"))
                {
                    practitioners.Add(user);
                }
            }

            practitioners = this.FilterPractitionersOnRegionsAsync(practitioners, practitionersSearchFilterViewModel.GeographicalLocationsSelected);
            practitioners = this.FilterPractitionersOnLanguagesAsync(practitioners, practitionersSearchFilterViewModel.LanguagesSelected);
            practitioners = this.FilterPractitionersOnGendersAsync(practitioners, practitionersSearchFilterViewModel.GenderSelected);

            if (practitionersSearchFilterViewModel.StartingIndex >= practitioners.Count)
            {
                practitionersSearchFilterViewModel.EndingIndex = practitionersSearchFilterViewModel.EndingIndex - practitionersSearchFilterViewModel.StartingIndex;
                practitionersSearchFilterViewModel.StartingIndex = 0;
            }

            practitioners = practitioners.Skip(practitionersSearchFilterViewModel.StartingIndex).TakeWhile((p, i) => i + practitionersSearchFilterViewModel.StartingIndex < practitionersSearchFilterViewModel.EndingIndex).ToList();

            var practitionersViewModel = _mapper.Map<List<UserViewModel>>(practitioners);

            return practitionersViewModel;
        }

        private List<ApplicationUser> FilterPractitionersOnGendersAsync(List<ApplicationUser> practitioners, Gender gender)
        {
            if (gender == null)
            {
                return practitioners;
            }

            practitioners = practitioners.Where(p => p.Gender.GenderName == gender.GenderName).ToList();

            return practitioners;
        }

        private List<ApplicationUser> FilterPractitionersOnRegionsAsync(List<ApplicationUser> practitioners, List<RegionModel> regions)
        {
            if (regions == null || regions.Count == 0)
            {
                return practitioners;
            }

            practitioners = practitioners.Where(p => p.Regions.Where(pr => regions.Any(r => pr.RegionId == r.Id)).Count() > 0).ToList();

            return practitioners;

        }

        private List<ApplicationUser> FilterPractitionersOnLanguagesAsync(List<ApplicationUser> practitioners, List<LanguageModel> languages)
        {
            if (languages == null || languages.Count == 0)
            {
                return practitioners;
            }

            practitioners = practitioners.Where(p => p.Languages.Where(pl => languages.Any(l => pl.LanguageId == l.Id)).Count() > 0).ToList();

            return practitioners;
        }

        public async Task<int> ReturnNumberOfPractitionersAsync()
        {
            var users = await _applicationDbContext.Users.ToListAsync();
            var counter = 0;

            foreach (var user in users)
            {
                if (await _userManager.IsInRoleAsync(user,"Practitioner"))
                {
                    counter += 1;
                }
            }

            return counter;
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

    }
}
