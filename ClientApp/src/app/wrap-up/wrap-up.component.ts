import { Component, OnInit } from '@angular/core';
import { SingleDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ValueViewModel } from '../../view-models/value-view-model';
import { DataService } from '../../app-services/data-service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-wrap-up',
  templateUrl: './wrap-up.component.html',
  styleUrls: ['./wrap-up.component.css'],
  providers: [DataService]
})
export class WrapUpComponent implements OnInit {

  public corePerspectiveId: number;
  public secondaryPerspectiveId: number;
  public valuesFromThirdStage: Array<ValueViewModel> = new Array<ValueViewModel>();
  private relativeWeightOfThePerspectives: Array<number> = new Array<number>();
  public resultsSectionMyChart: Chart;
  public imageString;

  constructor(private _dataService: DataService, private _router: Router) {

    let surveyId = localStorage.getItem('surveyId');

    if (surveyId == null || surveyId == undefined) {
      localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }

    this._dataService.DecideToWhichStageToTransfer(Number.parseInt(localStorage.getItem('surveyId'))).subscribe(response => {
      if (response.body != 'wrap-up') {
        this._router.navigate([response.body]);
      }
    });
  }

  public DownloadYourPersonalReport() {
    this._router.navigate(['personalReport']);
  }

  public TransferToPersonalAccountPage() {
    localStorage.setItem('currentTabName', 'my-account-section');
    this._router.navigate(['personalAccount']);
  }

  public TransferToPractitionersDirectory() {
    this._router.navigate(['practitionersDirectory']);
  }

  ngOnInit() {

    let surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this._dataService.GetTheRelativeWeightOfThePerspectives(surveyId).subscribe((response: any) => {
      if (response.ok) {
        this.relativeWeightOfThePerspectives = response.body;
        this._dataService.GetSurveyThirdStageResults(surveyId).subscribe((thirdStageResults: any) => {
          if (thirdStageResults.ok) {
            this.valuesFromThirdStage = thirdStageResults.body;
            let maxGraphSliceValue = 0;
            this.relativeWeightOfThePerspectives.forEach(v => {
              if (v > maxGraphSliceValue) {
                console.log(v);
                maxGraphSliceValue = v;
              }
            });

            //Get the biggest values

            let temp = new Array<number>();

            this.relativeWeightOfThePerspectives.forEach(e => temp.push(e));

            temp = temp.sort((a, b) => a - b);

            this.corePerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[5]) + 1;
            this.secondaryPerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[4]) + 1;

            maxGraphSliceValue += 1;
            maxGraphSliceValue = Math.round(maxGraphSliceValue);

            this.resultsSectionMyChart = new Chart('resultsSectionMyChart', {
              type: 'polarArea',
              options: {
                animation: {
                  onComplete: () => {
                    this.imageString = this.resultsSectionMyChart.toBase64Image();
                  }
                },
                legend: {
                  display: false,
                  position: 'bottom',
                  labels: {
                    fontColor: '#006F91',
                    fontFamily: 'barlowSemiCondensedLight',
                    boxWidth: 0,
                    padding: 0,
                    fontSize:0 
                  },
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
                //labels: [
                //  'Expansion',
                //  'Systems',
                //  'Relational',
                //  'Management',
                //  'Family',
                //  'Grounding'
                //],
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
                  borderWidth:0
                }]
              }
            });


            var myChart = new Chart('myChart', {
              type: 'polarArea',
              options: {
                legend: {
                  display: false,
                  position: 'bottom',
                  labels: {
                    fontColor: '#006F91',
                    fontFamily: 'barlowSemiCondensedLight',
                    boxWidth: 10,
                    padding: 30
                  },
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
        });
      }
    });
  }
}
