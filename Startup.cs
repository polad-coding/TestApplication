using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using KPProject.Data;
using KPProject.Models;
using System;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using KPProject.Interfaces;
using KPProject.Services;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.HttpOverrides;
using DinkToPdf.Contracts;
using DinkToPdf;
using System.IO;

namespace KPProject
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    "Server=localhost;Database=kpprojectdb;user=root; password=Polad5689742!;"));

            //var context = new CustomAssemblyLoadContext();
            //context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), "bin", "Debug", "netcoreapp3.1", "publish", "libwkhtmltox.so"));

            //services.AddDbContext<ApplicationDbContext>(options =>
            //options.UseMySql(
            //"Server=localhost;Database=KPProjectDatabase;user=polad; password=polad5689742;"));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedAccount = false;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddCors(options =>
            {
                options.AddPolicy("EnableCORS", builder =>
                {
                    builder.AllowAnyOrigin()
                       .AllowAnyHeader()
                       .AllowAnyMethod();
                });
            });

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddAutoMapper(typeof(Startup));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        //ValidIssuer = "somefreedomain.ml",
                        //ValidAudience = "somefreedomain.ml",
                        ValidIssuer = "localhost:5001",
                        ValidAudience = "localhost:5001",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("jsnlckjnsalkncaslcjsncp3cbakjnLIU@BIUDBFIBVLB#!IBVbvsoibcjksdcuobsdc")),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddControllers().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            services.AddScoped<ICustomAuthenticationService, CustomAuthenticationService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IDataService, DataService>();
            services.AddScoped<ISurveyService, SurveyService>();
            services.AddScoped<IEmailSender, EmailSenderService>();
            var emailConfig = Configuration
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //app.UseHsts();
            }


            //app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseCors("EnableCORS");


            app.UseAuthentication();

            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            //CreateRoles(serviceProvider).Wait();
            //CreateUsers(serviceProvider).Wait();
            //CreatePerspectives(serviceProvider).Wait();
            //CreateValues(serviceProvider).Wait();
            //CreatePerspectivesLanguageFiles(serviceProvider).Wait();
            //CreateValuesLanguageFiles(serviceProvider).Wait();
            //CreateCertifications(serviceProvider).Wait();
            CreateAdmin(serviceProvider).Wait();
            PopulateDBWithCoupons(serviceProvider).Wait();
        }

        public async Task CreateValues(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.PopulateDBWithValuesAsync();

        }

        public async Task CreateCertifications(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.PopulateDBWithCertificationsAsync(); 
        }

        public async Task CreatePerspectivesLanguageFiles(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.CreatePerspectivesLanguageFilesAsync();

        }

        public async Task CreateValuesLanguageFiles(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.CreateValuesLanguageFilesAsync();

        }

        public async Task CreatePerspectives(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.PopulateDBWithPerspectivesAsync();

        }

        public async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await roleManager.CreateAsync(new IdentityRole("Practitioner"));
            await roleManager.CreateAsync(new IdentityRole("User"));
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        public async Task PopulateDBWithCoupons(IServiceProvider serviceProvider)
        {
            var dataService = serviceProvider.GetRequiredService<IDataService>();

            await dataService.PopulateDBWithCoupons();
        }

        public async Task CreateAdmin(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            if (await userManager.FindByEmailAsync("admin@gmail.com") != null) 
            {
                return;
            }

            var created = await userManager.CreateAsync(new ApplicationUser
            {
                Email = "admin@gmail.com",
                UserName = "admin@gmail.com"
            },"Admin123!");

            if (created.Succeeded)
            {
                await userManager.AddToRoleAsync(await userManager.FindByEmailAsync("admin@gmail.com"), "Admin");
            }
        }

        public async Task CreateUsers(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "Aasd",
                LastName = "asd",
                Email = "asdad@gmail.com",
                UserName = "asdad@gmail.com",
                Website = "asdadsad",
                Bio = "asdadasdasd",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "fghj",
                LastName = "fgj",
                Email = "fgj@gmail.com",
                UserName = "fgj@gmail.com",
                Website = "fghj",
                Bio = "fghj",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "gf",
                LastName = "sdfg",
                Email = "sdf@gmail.com",
                UserName = "sdf@gmail.com",
                Website = "dsfg",
                Bio = "sdfg",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "sdfg",
                LastName = "sdg",
                Email = "sdgt@gmail.com",
                UserName = "sdgt@gmail.com",
                Website = "revs",
                Bio = "vwre",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "d qwd  ",
                LastName = "ADSa",
                Email = "ASD@gmail.com",
                UserName = "ASD@gmail.com",
                Website = "ASFSAFD",
                Bio = "ASDVBS",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "JYRG",
                LastName = "RTYJH",
                Email = "JKL@gmail.com",
                UserName = "JKL@gmail.com",
                Website = "NGHNBF",
                Bio = "CVBDG",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "YIKIY",
                LastName = "UKHR",
                Email = "RTY@gmail.com",
                UserName = "RTY@gmail.com",
                Website = "GHVDDA",
                Bio = "SDCA WQ",
            }, "plamf12345");

            await userManager.CreateAsync(new ApplicationUser
            {
                FirstName = "CXVBCV",
                LastName = "XVCBSD",
                Email = "CVB@gmail.com",
                UserName = "CVB@gmail.com",
                Website = "ASDFSADF",
                Bio = "asdADW",
            }, "plamf12345");

        }
    }
}
