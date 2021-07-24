using DinkToPdf;
using DinkToPdf.Contracts;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {

        private readonly IDataService _dataService;
        private readonly IConverter _converter;

        public DataController(IDataService dataService, IConverter converter)
        {
            _dataService = dataService;
            _converter = converter;
        }

        [HttpPost]
        [Route("DeleteSurveyFirstStageResults")]
        public async Task<ActionResult> DeleteSurveyFirstStageResultsAsync([FromBody] int surveyId)
        {
            var requestIsSuccessful = await _dataService.DeleteSurveyFirstStageResultsAsync(surveyId);

            if (requestIsSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetSelectedRegionsForCurrentUser")]
        public async Task<ActionResult<List<RegionModel>>> GetSelectedRegionsForCurrentUserAsync()
        {
            var regions = await _dataService.GetSelectedRegionsForCurrentUserAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(regions);
        }

        [HttpPost]
        [Route("DeleteSurveySecondStageResults")]
        public async Task<ActionResult> DeleteSurveySecondStageResultsAsync([FromBody] int surveyId)
        {
            var requestIsSuccessful = await _dataService.DeleteSurveySecondStageResultsAsync(surveyId);

            if (requestIsSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetValuesForFirstStage")]
        public async Task<ActionResult<List<ValueModel>>> GetValuesForFirstStageAsync([FromQuery] int surveyId)
        {
            var response = await _dataService.GetValuesForFirstStageAsync(surveyId);

            if (response != null)
            {
                return Ok(response);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetFirstStageValues")]
        public async Task<ActionResult<List<ValueModel>>> GetFirstStageValuesAsync([FromQuery] int surveyId)
        {
            var response = await _dataService.GetFirstStageValuesAsync(surveyId);

            if (response != null)
            {
                return Ok(response);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetSecondStageValues")]
        public async Task<ActionResult<List<ValueModel>>> GetSecondStageValuesAsync([FromQuery] int surveyId)
        {
            var response = await _dataService.GetSecondStageValuesAsync(surveyId);

            if (response != null)
            {
                return Ok(response);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("CheckIfAllCouponsAreValid")]
        public async Task<ActionResult<bool>> CheckIfAllCouponsAreValidAsync(List<OrderViewModel> orders)
        {
            var requestResult = _dataService.CheckIfAllCouponsAreValidAsync(orders);

            return Ok(requestResult);
        }

        [HttpGet]
        [Route("GetCoupon")]
        public async Task<ActionResult<GetCouponRequestResponseViewModel>> GetCouponAsync([FromQuery] string couponBody)
        {
            var coupon = await _dataService.GetCouponAsync(couponBody, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (coupon != null)
            {
                return Ok(coupon);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("GoToPreviousStageOfTheSurvey")]
        public async Task<ActionResult> GoToPreviousStageOfTheSurveyAsync([FromBody] int surveyId)
        {
            var isRequestSuccessful = await _dataService.GoToPreviousStageOfTheSurveyAsync(surveyId);

            if (isRequestSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("TransferTheCode")]
        public async Task<ActionResult> TransferTheCodeAsync([FromBody] TransferCodesViewModel transferCodesViewModel)
        {
            var isOperationSuccessful = await _dataService.TransferTheCodeAsync(transferCodesViewModel);

            if (isOperationSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("AssociateUserDataToTheSurvey")]
        public async Task<ActionResult> AssociateUserDataToTheSurveyAsync([FromBody] string userId)
        {
            var requestSucceded = await _dataService.AssociateUserDataToTheSurveyAsync(userId);

            if (requestSucceded)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("UserHasUnsignedSurveys")]
        public async Task<ActionResult<bool>> UserHasUnsignedSurveysAsync([FromQuery] string userId)
        {
            var hasUnsignedSurvey = await _dataService.UserHasUnsignedSurveysAsync(userId);

            return Ok(hasUnsignedSurvey);
        }

        [HttpGet]
        [Route("GetAllValues")]
        public async Task<ActionResult<List<ValueModel>>> GetAllValuesAsync([FromQuery] int surveyId)
        {
            var values = await _dataService.GetAllValuesAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpGet]
        [Route("CheckIfCodeIsValid")]
        public async Task<ActionResult<bool>> CheckIfCodeIsValidAsync(string code)
        {
            var isValid = await _dataService.CheckIfCodeIsValidAsync(code);

            if (isValid)
            {
                return Ok(true);
            }

            return Ok(false);
        }

        [HttpGet]
        [Route("GetTheRelativeWeightOfThePerspectives")]
        public async Task<ActionResult<List<double>>> GetTheRelativeWeightOfThePerspectives([FromQuery] int surveyId)
        {
            var values = await _dataService.GetTheRelativeWeightOfThePerspectivesAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpPost]
        [Route("GenerateCodes")]
        public async Task<ActionResult<List<OrderModel>>> GenerateCodesAsync(List<OrderViewModel> ordersList)
        {
            var orders = await _dataService.GenerateCodesAsync(ordersList, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (orders != null)
            {
                return Ok(orders);
            }

            return BadRequest();
        }


        [HttpGet]
        [Route("GetSurveyThirdStageResults")]
        public async Task<ActionResult<List<double>>> GetSurveyThirdStageResultsAsync([FromQuery] int surveyId)
        {
            var values = await _dataService.GetSurveyThirdStageResultsAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpPost]
        [Route("SaveFirstStageResults")]
        public async Task<ActionResult> SaveFirstStageResultsAsync(SurveyFirstStageSaveRequestViewModel surveyFirstStageSaveRequestViewModel)
        {
            var operationIsSuccessful = await _dataService.SaveFirstStageResultsAsync(surveyFirstStageSaveRequestViewModel.values, surveyFirstStageSaveRequestViewModel.surveyId);

            if (operationIsSuccessful)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("SaveSecondStageResults")]
        public async Task<ActionResult> SaveSecondStageResultsAsync(SurveySecondStageSaveRequestViewModel surveySecondStageSaveRequestViewModel)
        {
            var operationIsSuccessful = await _dataService.SaveSecondStageResultsAsync(surveySecondStageSaveRequestViewModel.values, surveySecondStageSaveRequestViewModel.surveyId);

            if (operationIsSuccessful)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("SaveThirdStageResults")]
        public async Task<ActionResult> SaveThirdStageResultsAsync(SurveyThirdStageSaveRequestViewModel surveyThirdStageSaveRequestViewModel)
        {
            var operationIsSuccessful = await _dataService.SaveThirdStageResultsAsync(surveyThirdStageSaveRequestViewModel.values, surveyThirdStageSaveRequestViewModel.surveyId);

            if (operationIsSuccessful)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpGet]
        [Route("GetSurveyResults")]
        public async Task<ActionResult<List<SurveyResultViewModel>>> GetSurveyResultsAsync([FromQuery] string userId)
        {
            var data = await _dataService.GetSurveyResultsAsync(userId);

            return Ok(data);
        }

        [HttpGet]
        [Route("GetTheCurrentStageValues")]
        public async Task<ActionResult<List<ValueModel>>> GetTheCurrentStageValuesAsync(int surveyId)
        {
            var data = await _dataService.GetTheCurrentStageValuesAsync(surveyId);

            if (data != null)
            {
                return Ok(data);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("DecideToWhichStageToTransfer")]
        public async Task<ActionResult<string>> DecideToWhichStageToTransferAsync(int surveyId)
        {
            var stageName = await _dataService.DecideToWhichStageToTransferAsync(surveyId);

            if (stageName != null)
            {
                return Ok(stageName);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("GenerateIndividualPdfReport")]
        public IActionResult GenerateIndividualPdfReport([FromBody] ReportHTMLContentViewModel content)
        {
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.Letter,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "PDF Report"
            };

            string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "individual-report.css");
            string footerPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "footer.html");
            string headerPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "header.html");

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                //Page = "https://code-maze.com/",
                HtmlContent = content.Html,
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = path },
                FooterSettings = { FontName = "BarlowSemiCondensedLight", FontSize = 9, Line = false, HtmUrl = footerPath, Center = "[Page]" },
                 HeaderSettings = { FontName = "BarlowSemiCondensedLight", FontSize = 9, Line = false, HtmUrl = headerPath, Spacing = 20}
            };
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };
            var file = _converter.Convert(pdf);
            return File(file, "application/pdf", "Report.pdf");
        }

        [HttpPost]
        [Route("GeneratePdf")]
        public IActionResult GeneratePdf([FromBody] ReportHTMLContentViewModel content)
        {
            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Landscape,
                PaperSize = PaperKind.Letter,
                Margins = new MarginSettings { Top = 10 },
                DocumentTitle = "PDF Report"
            };

            string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "practitioner-report.css");
            string footerPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "footer.html");
            string headerPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "src", "assets", "header.html");


            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                //Page = "https://code-maze.com/",
                HtmlContent = content.Html,
                WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = path },
                FooterSettings = { FontName = "BarlowSemiCondensedLight", FontSize = 9, Line = false, HtmUrl = footerPath, Center = "[Page]" },
                HeaderSettings = { FontName = "BarlowSemiCondensedLight", FontSize = 9, Line = false, HtmUrl = headerPath, Spacing = 20 }
            };
            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };
            var file = _converter.Convert(pdf);
            return File(file, "application/pdf", "Report.pdf");
        }

        [HttpGet]
        [Route("GetAllCertifications")]
        public async Task<ActionResult<List<Certification>>> GetAllCertificationsAsync()
        {
            var certifications = await _dataService.GetAllCertificationsAsync();

            if (certifications == null)
            {
                return BadRequest();
            }

            return Ok(certifications);
        }

        [HttpGet]
        [Route("GetPractitionersCertifications")]
        public async Task<ActionResult<List<ApplicationUserCertification>>> GetPractitionersCertificationsAsync(string userId)
        {
            var practitionersCertifications = await _dataService.GetPractitionersCertificationsAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));


            if (practitionersCertifications == null)
            {
                return BadRequest();
            }

            return Ok(practitionersCertifications);
        }

        [HttpGet]
        [Route("GetMembershipStatus")]
        public async Task<ActionResult<Membership>> GetMembershipStatusAsync()
        {
            var membership = await _dataService.GetMembershipStatusAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            return Ok(membership);
        }

        [HttpGet]
        [Route("RenewMembership")]
        public async Task<ActionResult> RenewMembershipAsync()
        {
            var requestIsSuccessful = await _dataService.RenewMembershipAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (requestIsSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("GetPractitionersForDirectory")]
        public async Task<ActionResult<List<UserViewModel>>> GetPractitionersForDirectoryAsync(PractitionersSearchFilterViewModel practitionersSearchFilterViewModel)
        {
            var practitioners = await _dataService.GetPractitionersForDirectoryAsync(practitionersSearchFilterViewModel);

            if (practitioners != null)
            {
                return Ok(practitioners);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("ReturnNumberOfPractitioners")]
        public async Task<int> ReturnNumberOfPractitionersAsync()
        {
            var numberOfPractitioners = await _dataService.ReturnNumberOfPractitionersAsync();

            return numberOfPractitioners;
        }

        [HttpGet]
        [Route("GetValuesSelectionsAtDifferentSurveyStages")]
        public async Task<ActionResult<List<List<ReportTableValueViewModel>>>> GetValuesSelectionsAtDifferentSurveyStagesAsync([FromQuery] int surveyId)
        {
            var data = await _dataService.GetValuesSelectionsAtDifferentSurveyStagesAsync(surveyId);

            if (data != null)
            {
                return Ok(data);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetParticularSurveyResults")]
        public async Task<ActionResult<SurveyResultViewModel>> GetParticularSurveyResultsAsync([FromQuery] int surveyId)
        {
            var result = await _dataService.GetParticularSurveyResultsAsync(surveyId);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest();
        }

        //[HttpGet("{surveyId}")]
        //[Route("GetAllValuesFromTheFirstStage")]
        //public async Task<ActionResult<List<ValueModel>>> GetAllValuesFromTheFirstStageAsync(int surveyId)
        //{
        //    var values = await _dataService.GetAllValuesFromTheFirstStageAsync(surveyId);

        //    if (values == null)
        //    {
        //        return BadRequest();
        //    }

        //    return Ok(values);
        //}

    }
}
