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
        public DbSet<OrderModel> Orders { get; set; }
        public DbSet<AnonymisedUser> AnonymisedUsers { get; set; }
        public DbSet<AnonymisedUserRegion> AnonymisedUserRegions { get; set; }
        public DbSet<ApplicationUserCertification> ApplicationUserCertifications { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<GeneralCoupon> GeneralCoupons { get; set; }
        public DbSet<AssociatedCoupon> AssociatedCoupons { get; set; }
        public DbSet<ApplicationUserAssociatedCoupon> ApplicationUserAssociatedCoupons { get; set; }
        public DbSet<EducationModel> Educations { get; set; }
        public DbSet<PositionModel> Positions { get; set; }
        public DbSet<SectorOfActivityModel> SectorsOfActivity { get; set; }
        public DbSet<ApplicationUserEducation> ApplicationUserEducations { get; set; }
        public DbSet<ApplicationUserPosition> ApplicationUserPositions { get; set; }
        public DbSet<ApplicationUserSectorOfActivity> ApplicationUserSectorsOfActivities { get; set; }
        public DbSet<AnonymisedUserEducation> AnonymisedUserEducations { get; set; }
        public DbSet<AnonymisedUserPosition> AnonymisedUserPositions { get; set; }
        public DbSet<AnonymisedUserSectorsOfActivity> AnonymisedUserSectorsOfActivities { get; set; }
        public DbSet<AgeGroupModel> AgeGroups { get; set; }


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
            builder.Entity<AnonymisedUserRegion>().HasKey(aur => new { aur.AnonymisedUserId, aur.RegionId });
            builder.Entity<ApplicationUserAssociatedCoupon>().HasKey(auac => new { auac.ApplicationUserId, auac.AssociatedCouponId });
            builder.Entity<ApplicationUserCertification>().HasKey(aus => new { aus.ApplicationUserId, aus.CertificationId });
            builder.Entity<ApplicationUserEducation>().HasKey(aue => new { aue.ApplicationUserId, aue.EducationId });
            builder.Entity<ApplicationUserPosition>().HasKey(aup => new { aup.ApplicationUserId, aup.PositionId});
            builder.Entity<ApplicationUserSectorOfActivity>().HasKey(ausoa => new { ausoa.ApplicationUserId, ausoa.SectorOfActivityId});
            builder.Entity<SurveyFirstStageModel>().HasKey(sft => new { sft.SurveyId, sft.ValueId });
            builder.Entity<SurveySecondStageModel>().HasKey(sss => new { sss.SurveyId, sss.ValueId });
            builder.Entity<SurveyThirdStageModel>().HasKey(sts => new { sts.SurveyId, sts.ValueId });
            builder.Entity<AnonymisedUserEducation>().HasKey(aue => new { aue.AnonymisedUserId, aue.EducationId });
            builder.Entity<AnonymisedUserPosition>().HasKey(aup => new { aup.AnonymisedUserId, aup.PositionId });
            builder.Entity<AnonymisedUserSectorsOfActivity>().HasKey(ausoa => new { ausoa.AnonymisedUserId, ausoa.SectorOfActivityId });

            builder.Entity<GeneralCoupon>().HasIndex(gc => gc.CouponBody).IsUnique();
            builder.Entity<AssociatedCoupon>().HasIndex(ac => ac.CouponBody).IsUnique();
        }
    }
}
