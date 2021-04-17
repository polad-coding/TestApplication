using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KPProject.Models;

namespace KPProject.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<LanguageModel> Languages { get; set; }
        public DbSet<RegionModel> Regions { get; set; }
        public DbSet<UserLanguage> UserLanguages { get; set; }
        public DbSet<UserRegion> UserRegions { get; set; }
        public DbSet<Gender> Gender { get; set; }
        public DbSet<ValueModel> Values { get; set; }
        public DbSet<PerspectiveModel> Perspectives { get; set; }
        public DbSet<SurveyModel> Surveys { get; set; }
        public DbSet<SurveyFirstStageModel> SurveyFirstStages { get; set; }
        public DbSet<SurveySecondStageModel> SurveySecondStages { get; set; }
        public DbSet<SurveyThirdStageModel> SurveyThirdStages { get; set; }
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserLanguage>().HasKey(ul => new { ul.ApplicationUserId, ul.LanguageId });
            builder.Entity<UserRegion>().HasKey(ur => new { ur.ApplicationUserId, ur.RegionId });
            builder.Entity<SurveyFirstStageModel>().HasKey(sft => new { sft.SurveyId, sft.ValueId });
            builder.Entity<SurveySecondStageModel>().HasKey(sss => new { sss.SurveyId, sss.ValueId });
            builder.Entity<SurveyThirdStageModel>().HasKey(sts => new { sts.SurveyId, sts.ValueId });
        }
    }
}
