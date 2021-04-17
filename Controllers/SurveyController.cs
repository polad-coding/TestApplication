using KPProject.Interfaces;
using KPProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SurveyController : ControllerBase
    {
        private readonly ISurveyService _surveyService;
        public SurveyController(ISurveyService surveyService)
        {
            _surveyService = surveyService;
        }

        [HttpPost]
        [Route("CreateSurvey")]
        public async Task<ActionResult<SurveyModel>> CreateSurveyAsync([FromBody]string code)
        {
            var survey = await _surveyService.CreateSurveyAsync(code, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (survey == null)
            {
                return BadRequest();
            }

            return Ok(survey);
        }

    }
}
