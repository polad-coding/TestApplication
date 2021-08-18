using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
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

        //[HttpPost]
        //[Route("CreateSurvey")]
        //public async Task<ActionResult<SurveyModel>> CreateSurveyAsync([FromBody]CreateSurveyViewModel createSurveyViewModel)
        //{
        //    var survey = await _surveyService.CreateSurveyAsync(createSurveyViewModel.Code, User.FindFirstValue(ClaimTypes.NameIdentifier), createSurveyViewModel.SurveyPractitionerId, createSurveyViewModel.NumberOfUsages);

        //    if (survey == null)
        //    {
        //        return BadRequest();
        //    }

        //    return Ok(survey);
        //}

        [HttpPost]
        [Route("CreateSurvey")]
        public async Task<ActionResult> CreateSurveyAsync([FromBody] List<CreateOrderViewModel> orders)
        {
            var requestSucceded = await _surveyService.CreateSurveyAsync(orders, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (requestSucceded)
            {
                return Ok();
            }

            return StatusCode(500);
        }

    }
}
