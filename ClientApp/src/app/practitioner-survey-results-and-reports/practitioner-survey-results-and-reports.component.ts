import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { SurveyService } from '../../app-services/survey-service';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-survey-results-and-reports',
  templateUrl: './practitioner-survey-results-and-reports.component.html',
  styleUrls: ['./practitioner-survey-results-and-reports.component.css'],
  providers: [DataService, AccountService, SurveyService]
})
export class PractitionerSurveyResultsAndReportsComponent implements OnInit {

  @Input()
  public user: UserViewModel;
  public surveys: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;

  constructor(private _dataService: DataService, private _accountService: AccountService, private _router: Router, private _surveyService: SurveyService) { }

  ngOnInit() {
    localStorage.setItem('practitionerAccountTabName', 'survey-results-and-reports-section');

    this._surveyService.GetSurveysOfTheGivenUser(null).subscribe((response: any) => {
      this.surveys = response.body;
    });
  }

  public SwitchToGetCodesTab() {
    localStorage.setItem('practitionerAccountTabName', 'get-codes-and-support-section');
    window.location.reload();
  }

  public GenerateIndividualReport(surveyId: string) {
    localStorage.setItem('surveyId', surveyId);

    this._router.navigate(['personalReport']);
  }

  public GeneratePractitionerReport(surveyId: string) {
    localStorage.setItem('surveyId', surveyId);

    this._router.navigate(['practitionerReport']);
  }

}
