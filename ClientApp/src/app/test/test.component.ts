import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { render } from 'creditcardpayments/creditCardPayments';
import { DataService } from '../../app-services/data-service';
import { SingleDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [DataService] 
})
export class TestComponent implements OnInit, AfterViewInit {

  public myChart: any;
  //public imageString: string;
  //public filePath: string = '/var/www/somefreedomain/TestApplication/wwwroot/dist/assets/Downut/KP-Downut-GB-HumanEnergy.svg';

  constructor(private _ds: DataService, private router: Router) {
  }


  ngAfterViewInit(): void {

    this._ds.GeneratePdf(document.getElementById('report-content').innerHTML).subscribe((response: Blob) => {
        const fileUrl = window.URL.createObjectURL(response);
        const showWindow = window.open(fileUrl);
      });
    }

  ngOnInit() {
    //this.myChart = new Chart('myChart', {
    //  type: 'polarArea',
    //  options: {
    //    animation: {
    //      onComplete: () => {
    //        this.imageString = this.myChart.toBase64Image();
    //        console.log(this.imageString);
    //      }
    //    },
    //    legend: {
    //      //display: false,
    //      position: 'bottom',
    //      labels: {
    //        fontColor: '#006F91',
    //        fontFamily: 'barlowSemiCondensedLight',
    //        boxWidth: 10,
    //        padding: 20
    //      },
    //      fullWidth: false
    //    },
    //    scale: {
    //      gridLines: {
    //        display: false
    //      },
    //      ticks: {
    //        display: false,
    //        max: 10,
    //        min: 0
    //      }
    //    }
    //  },
    //  data: {
    //    labels: [
    //      'Expansion',
    //      'Systems',
    //      'Relational',
    //      'Management',
    //      'Family',
    //      'Grounding'
    //    ],
    //    datasets: [{
    //      data: [5, 3, 2, 6, 9, 4],
    //      backgroundColor: [
    //        '#544595',
    //        '#009EE3',
    //        '#009640',
    //        '#FFCC00',
    //        '#ED7102',
    //        '#E30513'
    //      ]
    //    }]
    //  }
    //});
    
  }

}
