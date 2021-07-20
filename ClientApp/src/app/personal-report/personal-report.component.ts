import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { render } from 'creditcardpayments/creditCardPayments';
import { DataService } from '../../app-services/data-service';
import { SingleDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { UserViewModel } from '../../view-models/user-view-model';
import { groupBy } from 'rxjs/internal/operators/groupBy';
import { ReportTableValueViewModel } from '../../view-models/report-table-value-view-model';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { ReportHTMLContentViewModel } from '../../view-models/report-html-content-view-model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-personal-report',
  templateUrl: './personal-report.component.html',
  styleUrls: ['./personal-report.component.css'],
  providers: [AccountService, DataService]
})
export class PersonalReportComponent implements OnInit, AfterViewInit {

  public imageString: string;
  public imageStringWithoutLegend: string;
  public textFilePerspectiveIndexes: Array<number> = [1, 2, 3, 4, 5, 6];
  public myChart: any;
  public myChartWithoutLegend: any;
  public maxGraphSliceValue: number;
  public minGraphSliceValue: number;
  public user: UserViewModel;
  public corePerspectiveId: number;
  public secondaryPerspectiveId: number;
  public valuesFromThirdStage: Array<ValueViewModel> = new Array<ValueViewModel>();
  public relativeWeightOfThePerspectives: Array<number> = new Array<number>();
  public reportTableValues: Array<Array<ReportTableValueViewModel>> = new Array<Array<ReportTableValueViewModel>>();
  public surveyResults: SurveyResultViewModel;
  public fileURL: string;
  public popUpWindow: Window;
  //TODO - get information about survey taker and survey 

  constructor(private _as: AccountService, private _ds: DataService, private router: Router, private _location: Location) {
  }


  ngAfterViewInit(): void {
    let questions: any = document.getElementsByClassName('value-container-questions');

    for (var i = 0; i < questions.length; i++) {
      let text: string = questions[i].innerText;
      let questionsChunks = text.split('\n');
      questions[i].removeChild(questions[i].firstChild);
      questions[i].appendChild(document.createElement('ul'));

      questionsChunks.forEach(chunk => {
        questions[i].firstChild.appendChild(document.createElement('li'));
        questions[i].firstChild.lastChild.classList.add('questions-li-element');
        questions[i].firstChild.lastChild.appendChild(document.createElement('span'));
        questions[i].firstChild.lastChild.firstChild.innerText = chunk;
      })

    }

  }

  public OpenPopUp() {
    this._location.back();
    location.reload();

    this.popUpWindow = window.open('', 'Individual report', `width=${window.innerWidth},height=${window.innerHeight},menubar=0,toolbar=0`);
    this.popUpWindow.location.href = this.fileURL;
  }

  ngOnInit() {

    let surveyId = Number.parseInt(localStorage.getItem('surveyId'));



    this._ds.GetParticularSurveyResults(surveyId).subscribe((surveyResultResponse: any) => {

      this.surveyResults = surveyResultResponse.body;

      this.user = this.surveyResults.surveyTakerUser;

      console.debug(this.surveyResults);
      console.debug(this.user);

      this._ds.GetTheRelativeWeightOfThePerspectives(surveyId).subscribe((response: any) => {
        if (response.ok) {
          this.relativeWeightOfThePerspectives = response.body;
          console.debug(this.relativeWeightOfThePerspectives);

          this._ds.GetSurveyThirdStageResults(surveyId).subscribe((thirdStageResults: any) => {
            if (thirdStageResults.ok) {
              this.valuesFromThirdStage = thirdStageResults.body;
              console.debug(this.valuesFromThirdStage);

              this.maxGraphSliceValue = 0;
              this.relativeWeightOfThePerspectives.forEach(v => {
                if (v > this.maxGraphSliceValue) {
                  console.log(v);
                  this.maxGraphSliceValue = v;
                }
              });

              this.minGraphSliceValue = Number.MAX_VALUE;
              this.relativeWeightOfThePerspectives.forEach(v => {
                if (v < this.minGraphSliceValue) {
                  console.log(v);
                  this.minGraphSliceValue = v;
                }
              });

              //Get the biggest values

              let temp = new Array<number>();

              this.relativeWeightOfThePerspectives.forEach(e => temp.push(e));

              temp = temp.sort((a, b) => a - b);

              this.corePerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[5]) + 1;
              this.secondaryPerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[4]) + 1;
            }

            this.myChartWithoutLegend = new Chart('myChart', {
              type: 'polarArea',
              options: {
                maintainAspectRatio: false,
                aspectRatio: 1,
                layout: {
                },
                animation: {
                  onComplete: () => {
                    this.imageStringWithoutLegend = this.myChart.toBase64Image();
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
                    display: false,
                    //max: this.maxGraphSliceValue,
                    //min: 0
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
                  data: this.relativeWeightOfThePerspectives.reverse(),
                  backgroundColor: [
                    '#544595',
                    '#009EE3',
                    '#009640',
                    '#FFCC00',
                    '#ED7102',
                    '#E30513'
                  ]
                }]
              }
            });

            this.myChart = new Chart('myChart', {
              type: 'polarArea',
              options: {
                maintainAspectRatio: false,
                aspectRatio: 1,
                layout: {
                },
                animation: {
                  onComplete: () => {
                    this.imageString = this.myChart.toBase64Image();
                    setTimeout(() => {
                      let obj = new ReportHTMLContentViewModel();
                      obj.html = document.getElementById('report').innerHTML;
                      this._ds.GenerateIndividualPdfReport(obj).subscribe((response: Blob) => {
                        this.fileURL = window.URL.createObjectURL(response);
                        //this.popUpWindow.location.href = this.fileURL;
                        localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
                        localStorage.setItem('practitionerAccountTabName', 'servey-results-and-reports-section');
                      });
                    }, 0);
                  }
                },
                legend: {
                  //display: false,
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
                    display: false,
                    //max: this.maxGraphSliceValue,
                    //min: 0
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
                  ]
                }]
              }
            });

          });
        }

        //Get values and set find the selections at different survey stages
        this._ds.GetValuesSelectionsAtDifferentSurveyStages(surveyId).subscribe((response: any) => {
          this.reportTableValues = response.body;
          this.BalanceTableValuesAmounts();
          console.log(this.reportTableValues);
        })

      });

    });
  }

  public DownloadTheReport() {
    let win = window.open(this.fileURL);
  }

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
