using DinkToPdf;
using DinkToPdf.Contracts;
using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
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

        [HttpGet]
        [Route("GetAllValues")]
        public async Task<ActionResult<List<ValueModel>>> GetAllValuesAsync()
        {
            var values = await _dataService.GetAllValuesAsync();

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
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
    }
}
