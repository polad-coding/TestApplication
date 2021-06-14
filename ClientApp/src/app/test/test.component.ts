import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { render } from 'creditcardpayments/creditCardPayments';
import { DataService } from '../../app-services/data-service';
import { SingleDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { UserViewModel } from '../../view-models/user-view-model';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [AccountService, DataService] 
})
export class TestComponent implements OnInit, AfterViewInit {

  public imageString: string;
  public myChart: any;
  public user: UserViewModel;
  public corePerspectiveId: number;
  public secondaryPerspectiveId: number;
  public valuesFromThirdStage: Array<ValueViewModel> = new Array<ValueViewModel>();
  private relativeWeightOfThePerspectives: Array<number> = new Array<number>();
  //TODO - get information about survey taker and survey 

  constructor(private _as: AccountService, private _ds: DataService, private router: Router) {

  }


  ngAfterViewInit(): void {
    //setTimeout(() => {
    //  this._ds.GeneratePdf(document.getElementById('report').outerHTML).subscribe((response: Blob) => {
    //    const fileUrl = window.URL.createObjectURL(response);
    //    const showWindow = window.open(fileUrl);
    //  });
    //}, 0);

    //this._ds.GeneratePdf(document.getElementById('report').outerHTML).subscribe((response: Blob) => {
    //  const fileUrl = window.URL.createObjectURL(response);
    //  const showWindow = window.open(fileUrl);
    //});

    console.debug(document.getElementById('report').innerHTML);
    console.debug(document.getElementById('report').outerHTML);

  }

  ngOnInit() {

    //this._as.GetCurrentUser().subscribe((response: any) => {
    //  this.user = response.body;

      //let surveyId = Number.parseInt(localStorage.getItem('surveyId'));

      //this._ds.GetTheRelativeWeightOfThePerspectives(1).subscribe((response: any) => {
      //  if (response.ok) {
      //    this.relativeWeightOfThePerspectives = response.body;
      //    this._ds.GetSurveyThirdStageResults(1).subscribe((thirdStageResults: any) => {
      //      if (thirdStageResults.ok) {
      //        this.valuesFromThirdStage = thirdStageResults.body;
      //        console.debug(this.valuesFromThirdStage);

      //        let maxGraphSliceValue = 0;
      //        this.relativeWeightOfThePerspectives.forEach(v => {
      //          if (v > maxGraphSliceValue) {
      //            console.log(v);
      //            maxGraphSliceValue = v;
      //          }
      //        });

      //        //Get the biggest values

      //        let temp = new Array<number>();

      //        this.relativeWeightOfThePerspectives.forEach(e => temp.push(e));

      //        temp = temp.sort((a, b) => a - b);

      //        this.corePerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[5]) + 1;
      //        this.secondaryPerspectiveId = this.relativeWeightOfThePerspectives.indexOf(temp[4]) + 1;
      //      }

            this.myChart = new Chart('myChart', {
              type: 'polarArea',
              options: {
                animation: {
                  onComplete: () => {
                    this.imageString = this.myChart.toBase64Image();
                    setTimeout(() => {
                      this._ds.GeneratePdf(document.getElementById('report').outerHTML).subscribe((response: Blob) => {
                        const fileUrl = window.URL.createObjectURL(response);
                        const showWindow = window.open(fileUrl);
                      });
                    }, 3000);
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
                    max: 10,
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
                  data: [5, 3, 2, 6, 9, 4],
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

          //});
        }

      //});

    //});

    
    
  }


