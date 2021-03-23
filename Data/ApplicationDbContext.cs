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
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //builder.Entity<UserLanguage>().HasOne(ul => ul.User).WithMany(u => u.Languages).HasForeignKey(ul => ul.ApplicationUserId);
            //builder.Entity<UserLanguage>().HasOne(ul => ul.Language).WithMany(l => l.UserLanguage).HasForeignKey(ul => ul.LanguageId);
            //builder.Entity<UserRegion>().HasOne(ur => ur.User).WithMany(u => u.Regions).HasForeignKey(ur => ur.ApplicationUserId);
            //builder.Entity<UserRegion>().HasOne(ur => ur.Region).WithMany(u => u.UserRegion).HasForeignKey(ur => ur.RegionId);
            builder.Entity<UserLanguage>().HasKey(ul => new { ul.ApplicationUserId, ul.LanguageId });
            builder.Entity<UserRegion>().HasKey(ur => new { ur.ApplicationUserId, ur.RegionId });
        }
    }
}
