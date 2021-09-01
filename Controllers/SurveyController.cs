using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
        [Route("CreateSurveys")]
        public async Task<ActionResult> CreateSurveysAsync([FromBody] List<CreateOrderViewModel> orders)
        {
            var requestSucceded = await _surveyService.CreateSurveysAsync(orders, User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (requestSucceded)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpPost]
        [Route("DeleteSurveyFirstStageResults")]
        public async Task<ActionResult> DeleteSurveyFirstStageResultsAsync([FromBody] int surveyId)
        {
            var requestIsSuccessful = await _surveyService.DeleteSurveyFirstStageResultsAsync(surveyId);

            if (requestIsSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("DeleteSurveySecondStageResults")]
        public async Task<ActionResult> DeleteSurveySecondStageResultsAsync([FromBody] int surveyId)
        {
            var requestIsSuccessful = await _surveyService.DeleteSurveySecondStageResultsAsync(surveyId);

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
            var response = await _surveyService.GetValuesForFirstStageAsync(surveyId);

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
            var response = await _surveyService.GetFirstStageValuesAsync(surveyId);

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
            var response = await _surveyService.GetSecondStageValuesAsync(surveyId);

            if (response != null)
            {
                return Ok(response);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("GoToPreviousStageOfTheSurvey")]
        public async Task<ActionResult> GoToPreviousStageOfTheSurveyAsync([FromBody] int surveyId)
        {
            var isRequestSuccessful = await _surveyService.GoToPreviousStageOfTheSurveyAsync(surveyId);

            if (isRequestSuccessful)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetTheRelativeWeightOfThePerspectives")]
        public async Task<ActionResult<List<double>>> GetTheRelativeWeightOfThePerspectives([FromQuery] int surveyId)
        {
            var values = await _surveyService.GetTheRelativeWeightOfThePerspectivesAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpGet]
        [Route("GetSurveyThirdStageResults")]
        public async Task<ActionResult<List<double>>> GetSurveyThirdStageResultsAsync([FromQuery] int surveyId)
        {
            var values = await _surveyService.GetSurveyThirdStageResultsAsync(surveyId);

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
            var operationIsSuccessful = await _surveyService.SaveFirstStageResultsAsync(surveyFirstStageSaveRequestViewModel.values, surveyFirstStageSaveRequestViewModel.surveyId);

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
            var operationIsSuccessful = await _surveyService.SaveSecondStageResultsAsync(surveySecondStageSaveRequestViewModel.values, surveySecondStageSaveRequestViewModel.surveyId);

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
            var operationIsSuccessful = await _surveyService.SaveThirdStageResultsAsync(surveyThirdStageSaveRequestViewModel.values, surveyThirdStageSaveRequestViewModel.surveyId);

            if (operationIsSuccessful)
            {
                return Ok();
            }

            return StatusCode(500);
        }

        [HttpGet]
        [Route("GetSurveysOfTheGivenUser")]
        public async Task<ActionResult<List<SurveyResultViewModel>>> GetSurveysOfTheGivenUserAsync([FromQuery] string userId)
        {
            if (userId == null)
            {
                userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            }

            var data = await _surveyService.GetSurveysOfTheGivenUserAsync(userId);

            return Ok(data);
        }

        [HttpGet]
        [Route("GetThirdStageValues")]
        public async Task<ActionResult<List<ValueModel>>> GetThirdStageValuesAsync(int surveyId)
        {
            var data = await _surveyService.GetThirdStageValuesAsync(surveyId);

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
            var stageName = await _surveyService.DecideToWhichStageToTransferAsync(surveyId);

            if (stageName != null)
            {
                return Ok(stageName);
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("GetValuesSelectionsAtDifferentSurveyStages")]
        public async Task<ActionResult<List<List<ReportTableValueViewModel>>>> GetValuesSelectionsAtDifferentSurveyStagesAsync([FromQuery] int surveyId)
        {
            var data = await _surveyService.GetValuesSelectionsAtDifferentSurveyStagesAsync(surveyId);

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
            var result = await _surveyService.GetParticularSurveyResultsAsync(surveyId);

            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest();
        }
    }
}
