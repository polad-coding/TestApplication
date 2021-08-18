import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { SurveyService } from '../../app-services/survey-service';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-personal-survey-results-and-reports',
  templateUrl: './personal-survey-results-and-reports.component.html',
  styleUrls: ['./personal-survey-results-and-reports.component.css'],
  providers: [DataService, SurveyService, AccountService]
})
export class PersonalSurveyResultsAndReportsComponent implements OnInit {

  public user: UserViewModel;
  public surveysResults: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;

  constructor(private _router: Router, private _dataService: DataService, private _accountService: AccountService, private _surveyService: SurveyService) { }

  ngOnInit() {
    this._accountService.GetCurrentUser().pipe(switchMap((getCurrentUserResponse: any) => {
      this.user = getCurrentUserResponse.body;
      return this._dataService.GetSurveyResults(this.user.id);
    })).subscribe((getSurveyResultsResponse: any) => {
      this.surveysResults = getSurveyResultsResponse.body;
    });
  }

  public ChangeToGetCodesTab() {
    localStorage.setItem('personalAccountTabName', 'get-codes-section');
    window.location.reload();
  }

  public RedirectToEnterCodePage() {
    this._router.navigate(['enterCode']);
  }

  public GenerateIndividualReport(surveyId: number) {
    console.log('here 7');

    localStorage.setItem('surveyId', surveyId.toString());
    this._router.navigate(['personalReport']);
  }

  public TransferToSynthesisPage(surveyId: number) {
    localStorage.setItem('surveyId', surveyId.toString());
    this._router.navigate(['wrap-up']);
  }

  public ResumeSurvey(surveyId: number) {
    if (surveyId === 0) {
      console.log('here 8');

      localStorage.setItem('surveyId', surveyId.toString());
      this._router.navigate(['surveyFirstStage']);

      return;
    }
    console.log('here 9');

    localStorage.setItem('surveyId', surveyId.toString());

    this._dataService.DecideToWhichStageToTransfer(surveyId).subscribe((stageTransferResponse: any) => {
      this._router.navigate([stageTransferResponse.body]);
    });
  }

}
