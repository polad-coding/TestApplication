import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { DataService } from '../../app-services/data-service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { UserViewModel } from '../../view-models/user-view-model';
import { ReportTableValueViewModel } from '../../view-models/report-table-value-view-model';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { ReportHTMLContentViewModel } from '../../view-models/report-html-content-view-model';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { SurveyService } from '../../app-services/survey-service';


@Component({
  selector: 'app-practitioner-report',
  templateUrl: './practitioner-report.component.html',
  styleUrls: ['./practitioner-report.component.css'],
  providers: [AccountService, DataService, SurveyService]
})
export class PractitionerReportComponent implements OnInit, AfterViewInit {

  //Image strings are converted to base 64 strings, so we can insert them into our pdf report.
  public imageStringWithoutLegend: string;
  public imageString: string;

  //Used in the practitioner report table, to retrive the title of the perspectives.
  public listOfPerspectivesIds: Array<number> = [1, 2, 3, 4, 5, 6];

  public user: UserViewModel;

  public baseUrl: string = '../..';

  public corePerspectiveId: number;
  public secondaryPerspectiveId: number;

  public valuesFromThirdStage: Array<ValueViewModel> = new Array<ValueViewModel>();

  public relativeWeightOfThePerspectives: Array<number> = new Array<number>();

  public reportTableValues: Array<Array<ReportTableValueViewModel>> = new Array<Array<ReportTableValueViewModel>>();

  public surveyResult: SurveyResultViewModel;

  public fileURL: string;
  public popUpWindow: Window;

  constructor(private _as: AccountService, private _dataService: DataService, private router: Router, private _location: Location, private _surveyService: SurveyService) { }

  /**
   * Opens the window with the generated report.
   * */
  public OpenPopUp() {
    this.popUpWindow = window.open('', 'Individual report', `width=${window.innerWidth},height=${window.innerHeight},menubar=0,toolbar=0`);
    this.popUpWindow.location.href = this.fileURL;

    //Used for mobile phones compatibility primary
    if (this.popUpWindow != null && !this.popUpWindow.closed) {
      setTimeout(() => {
        this._location.back();
        setTimeout(() => {
          location.reload();
        }, 1000)
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
  }

  private InitializeCoreAndSecondaryPerspectives() {
    let temp = new Array<number>();

    this.relativeWeightOfThePerspectives.forEach(e => temp.push(e));

    temp = temp.sort((a, b) => a - b);

    this.corePerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[5]) + 1;
    this.secondaryPerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[4]) + 1;
  }

  /**
   * Sets the base64 string that will be converted to the image and then displayed at the title page of the pdf report.
   * */
  private InitializeChartWithoutTheLegend() {
    let chartWithoutLegend = new Chart('chart-with-the-legend', {
      type: 'polarArea',
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        animation: {
          onComplete: () => {
            this.imageStringWithoutLegend = chartWithoutLegend.toBase64Image();
          }
        },
        legend: {
          display: false,
        },
        scale: {
          gridLines: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      },
      data: {
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

  /**
   * Passes the 'report' container HTML content to the method that will generate blob for file URL.
   * */
  private GenerateReport() {
    let obj = new ReportHTMLContentViewModel();
    obj.html = document.getElementById('report').innerHTML;

    this._dataService.GeneratePdf(obj).subscribe((response: Blob) => {
      this.fileURL = window.URL.createObjectURL(response);
      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      localStorage.setItem('practitionerAccountTabName', 'survey-results-and-reports-section');
    });
  }

  /**
 * Sets the base64 string that will be converted to the image and then displayed at the second page of the pdf report.
 * After that generates the pdf report and makes 'Download your report' button enabled.
 * */
  private InitializeChartWithTheLegend() {
    let chartWithoutTheLegend = new Chart('chart-without-the-legend', {
      type: 'polarArea',
      options: {
        maintainAspectRatio: false,
        aspectRatio: 1,
        layout: {
        },
        animation: {
          onComplete: () => {
            this.imageString = chartWithoutTheLegend.toBase64Image();
            setTimeout(() => {
              this.GenerateReport();
            }, 2000)
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            fontColor: '#006F91',
            fontFamily: 'barlowSemiCondensedLight',
            boxWidth: 10,
            padding: 20
          },
          fullWidth: false
        },
        scale: {
          gridLines: {
            display: false
          },
          ticks: {
            display: false
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

    let surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    this._surveyService.GetParticularSurveyResults(surveyId).pipe(switchMap((getParticularSurveyResultsResponse: any) => {
      this.surveyResult = getParticularSurveyResultsResponse.body;
      this.user = this.surveyResult.surveyTakerUser;

      return this._surveyService.GetTheRelativeWeightOfThePerspectives(surveyId);
    })).pipe(switchMap((getTheRelativeWeightOfThePerspectivesResponse: any) => {
      this.relativeWeightOfThePerspectives = getTheRelativeWeightOfThePerspectivesResponse.body;

      return this._surveyService.GetSurveyThirdStageResults(surveyId);
    })).pipe(switchMap((getSurveyThirdStageResultsResponse: any) => {
      this.valuesFromThirdStage = getSurveyThirdStageResultsResponse.body;

      this.InitializeCoreAndSecondaryPerspectives();

      this.InitializeChartWithoutTheLegend();

      this.InitializeChartWithTheLegend();

      return this._surveyService.GetValuesSelectionsAtDifferentSurveyStages(surveyId);
    })).subscribe((getValuesSelectionsAtDifferentSurveyStagesResponse: any) => {
      this.reportTableValues = getValuesSelectionsAtDifferentSurveyStagesResponse.body;
      this.BalanceTableValuesAmounts();
    });

  }

  /**
   * Balances the number of rows in the report table.
   * */
  private BalanceTableValuesAmounts() {
    let maxNumberOfValuesInPerspective = 22;

    for (var i = 0; i < this.reportTableValues.length; i++) {
      let arrayLength = maxNumberOfValuesInPerspective - this.reportTableValues[i].length;
      for (var a = 0; a < arrayLength; a++) {
        this.reportTableValues[i].push(null);
      }
    }

  }

}
