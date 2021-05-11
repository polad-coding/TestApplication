import { Component, OnInit } from '@angular/core';
import { SingleDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { ValueViewModel } from '../../view-models/value-view-model';
import { DataService } from '../../app-services/data-service';
import { fstat } from 'fs';

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

  constructor(private _dataService: DataService) {

  }

  ngOnInit() {

    let surveyId = Number.parseInt(localStorage.getItem('surveyId'));

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

            var myChart = new Chart('myChart', {
              type: 'polarArea',
              options: {
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
          }
        });
      }
    });
  }
}
