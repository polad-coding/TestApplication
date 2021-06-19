import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../app-services/data-service';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-survey-results-and-reports',
  templateUrl: './practitioner-survey-results-and-reports.component.html',
  styleUrls: ['./practitioner-survey-results-and-reports.component.css'],
  providers: [DataService]
})
export class PractitionerSurveyResultsAndReportsComponent implements OnInit {

  @Input()
  public user: UserViewModel
  public surveysResults: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.GetSurveyResults(this.user.id).subscribe((response: any) => {
      this.surveysResults = response.body;
      console.log(this.surveysResults);
    });
  }

}
