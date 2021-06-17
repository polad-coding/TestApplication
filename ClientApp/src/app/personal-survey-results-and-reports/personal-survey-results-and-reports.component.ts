import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { DataService } from '../../app-services/data-service';
import { SurveyService } from '../../app-services/survey-service';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';

@Component({
  selector: 'app-personal-survey-results-and-reports',
  templateUrl: './personal-survey-results-and-reports.component.html',
  styleUrls: ['./personal-survey-results-and-reports.component.css'],
  providers: [DataService, SurveyService]
})
export class PersonalSurveyResultsAndReportsComponent implements OnInit {

  public surveysResults: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;

  constructor(private _router: Router, private _dataService: DataService, private _surveyService: SurveyService) {

  }

  ngOnInit() {
    this._dataService.GetSurveyResults().subscribe((response: any) => {
      this.surveysResults = response.body;
      console.log(this.surveysResults);
    }),
      error => {
        console.log(error);
      };
  }

  public TransferToSynthesisPage(surveyId: number) {
    localStorage.setItem('surveyId', surveyId.toString());
    this._router.navigate(['wrap-up']);
  }

  public ResumeSurvey(surveyId: number, code: string) {
    console.log(surveyId);

    if (surveyId === 0) {
      //this._surveyService.CreateSurvey(code, null).subscribe((response: any) => {
      //  this.surveyId = response.body.id;
      //  localStorage.setItem('surveyId', this.surveyId.toString());
      //  this._dataService.GetAllValues(response.body.id).subscribe((response: any) => {
      //    this._router.navigate(['surveyFirstStage'], { state: { values: response.body } });
      //  });
      //});

      localStorage.setItem('surveyCode', code);

      this._router.navigate(['enterSurveyAccount']);


      //this.values.forEach(v => {
      //  if (v.isSelected) {
      //    this.numberOfValuesQualifiedAsImportant += 1;
      //    this.numberOfValuesQualified += 1;
      //  }
      //  else if (!v.isSelected) {
      //    this.numberOfValuesQualified += 1;
      //  }
      //});
    }
    else {
      localStorage.setItem('surveyId', surveyId.toString());
      //Go to DB and check which stage is passed
      console.log(surveyId);
      this._dataService.GetTheCurrentStageValues(surveyId).subscribe((currentStageValuesResponse: any) => {
        this._dataService.DecideToWhichStageToTransfer(surveyId).subscribe((stageTransferResponse: any) => {
          let valuesToTransfer = currentStageValuesResponse.body;
          console.log(stageTransferResponse.body);
          this._router.navigate([stageTransferResponse.body], { state: { values: valuesToTransfer } });

        });
        this._router.navigate(['wrap-up']);
      });
    }

    //Get the data for the stage
    //Navigate to the respective stage
  }

}
