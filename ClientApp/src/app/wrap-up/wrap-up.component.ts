import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ValueViewModel } from '../../view-models/value-view-model';
import { DataService } from '../../app-services/data-service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SurveyService } from '../../app-services/survey-service';

@Component({
  selector: 'app-wrap-up',
  templateUrl: './wrap-up.component.html',
  styleUrls: ['./wrap-up.component.css'],
  providers: [DataService, SurveyService]
})
export class WrapUpComponent implements OnInit {
  public surveyId: number;

  public corePerspectiveId: number;
  public secondaryPerspectiveId: number;

  public valuesFromThirdStage: Array<ValueViewModel> = new Array<ValueViewModel>();

  private relativeWeightOfThePerspectives: Array<number> = new Array<number>();

  public imageString;

  constructor(private _dataService: DataService, private _router: Router, private _surveySurvey: SurveyService) { }

  public DownloadPersonalReport() {
    this._router.navigate(['personalReport']);
  }

  public TransferToPersonalAccountPage() {
    localStorage.setItem('currentNavigationBarTabName', 'my-account-section');
    this._router.navigate(['personalAccount']);
  }

  public TransferToPractitionersDirectory() {
    this._router.navigate(['practitionersDirectory']);
  }

  private AssureThatSurveyIdIsValid() {
    if (this.surveyId == null || this.surveyId == undefined) {
      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }
  }

  private AssureThatTheUserIsAtTheValidStep() {
    this._surveySurvey.DecideToWhichStageToTransfer(this.surveyId).subscribe(response => {
      if (response.body != 'wrap-up') {
        this._router.navigate([response.body]);
      }
    });
  }

  /**
   * Calculate max graph slice value, to display the graph slices proportionaly.
   * */
  private CalculateMaxGraphSliceValue(): number {
    let maxGraphSliceValue = 0;

    this.relativeWeightOfThePerspectives.forEach(v => {
      if (v > maxGraphSliceValue) {
        maxGraphSliceValue = v;
      }
    });

    maxGraphSliceValue += 1;
    maxGraphSliceValue = Math.round(maxGraphSliceValue);

    return maxGraphSliceValue;
  }

  private CalculateCoreAndSecondaryPerspectiveIds() {
    let temp = new Array<number>();

    this.relativeWeightOfThePerspectives.forEach(e => temp.push(e));

    temp = temp.sort((a, b) => a - b);

    this.corePerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[5]) + 1;
    this.secondaryPerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[4]) + 1;
  }

  private InitializeResultsSectionImageChart(maxGraphSliceValue: number) {
    let resultsSectionImageChart = new Chart('results-section-image-chart', {
      type: 'polarArea',
      options: {
        tooltips: {
          enabled: false
        },
        animation: {
          onComplete: () => {
            this.imageString = resultsSectionImageChart.toBase64Image();
          }
        },
        legend: {
          display: false
        },
        scale: {
          display: false,
          gridLines: {
            display: false
          },
          ticks: {
            display: false,
            max: maxGraphSliceValue,
            min: 0
          }
        }
      },
      data: {
        labels: [],
        datasets: [{
          data: this.relativeWeightOfThePerspectives.reverse(),
          backgroundColor: [
            '#544595',
            '#009EE3',
            '#009640',
            '#FFCC00',
            '#ED7102',
            '#E30513'
          ],
          borderWidth: 0
        }]
      }
    });

  }

  private InitializeMainChart(maxGraphSliceValue: number) {
    let myChart = new Chart('myChart', {
      type: 'polarArea',
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scale: {
          gridLines: {
            display: false
          },
          ticks: {
            display: false,
            max: maxGraphSliceValue,
            min: 0
          }
        }
      },
      data: {
        labels: [
          'Expansion',
          'Systems',
          'Relational',
          'Management',
          'Family',
          'Grounding'
        ],
        datasets: [{
          data: this.relativeWeightOfThePerspectives,
          backgroundColor: [
            '#544595',
            '#009EE3',
            '#009640',
            '#FFCC00',
            '#ED7102',
            '#E30513'
          ],
          borderWidth: 0
        }]
      }
    });
  }

  ngOnInit() {

    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    this.AssureThatSurveyIdIsValid();

    this.AssureThatTheUserIsAtTheValidStep();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this._surveySurvey.GetTheRelativeWeightOfThePerspectives(this.surveyId).pipe(switchMap((getTheRelativeWeightOfThePerspectivesResult: any) => {
      this.relativeWeightOfThePerspectives = getTheRelativeWeightOfThePerspectivesResult.body;

      return this._surveySurvey.GetSurveyThirdStageResults(this.surveyId);
    })).subscribe((getSurveyThirdStageResultsResponse: any) => {
      this.valuesFromThirdStage = getSurveyThirdStageResultsResponse.body;

      let maxGraphSliceValue = this.CalculateMaxGraphSliceValue();

      this.CalculateCoreAndSecondaryPerspectiveIds();

      this.InitializeResultsSectionImageChart(maxGraphSliceValue);

      this.InitializeMainChart(maxGraphSliceValue);
    });
  }
}
