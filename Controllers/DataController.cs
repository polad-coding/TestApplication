using KPProject.Interfaces;
using KPProject.Models;
using KPProject.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KPProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController: ControllerBase
    {

        private readonly IDataService _dataService;

        public DataController(IDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet]
        [Route("GetAllValues")]
        public async Task<ActionResult<List<ValueModel>>> GetAllValuesAsync([FromQuery]int surveyId)
        {
            var values = await _dataService.GetAllValuesAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpGet]
        [Route("GetTheRelativeWeightOfThePerspectives")]
        public async Task<ActionResult<List<double>>> GetTheRelativeWeightOfThePerspectives([FromQuery]int surveyId)
        {
            var values = await _dataService.GetTheRelativeWeightOfThePerspectivesAsync(surveyId);

            if (values == null)
            {
                return BadRequest();
            }

            return Ok(values);
        }

        [HttpGet]
        [Route("GetSurveyThirdStageResults")]
        public async Task<ActionResult<List<double>>> GetSurveyThirdStageResultsAsync([FromQuery]int surveyId)
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
