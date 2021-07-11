import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-survey-results-and-reports',
  templateUrl: './practitioner-survey-results-and-reports.component.html',
  styleUrls: ['./practitioner-survey-results-and-reports.component.css'],
  providers: [DataService, AccountService]
})
export class PractitionerSurveyResultsAndReportsComponent implements OnInit {

  @Input()
  public user: UserViewModel;
  public surveysResults: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;

  constructor(private _dataService: DataService, private _accountService: AccountService, private _router: Router) { }

  ngOnInit() {
    if (this.user == undefined || this.user == null) {
      this._accountService.GetCurrentUser().subscribe((response :any)=> {
        this.user = response.body;
        this._dataService.GetSurveyResults(this.user.id).subscribe((response: any) => {
          this.surveysResults = response.body;
          console.log(this.surveysResults);
        });
      });
    }
  }

  public GoToGetCodesTab() {
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
