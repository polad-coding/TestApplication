import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { render, paypal } from 'creditcardpayments/creditCardPayments';
import { OrderViewModel } from '../../view-models/order-view-model';
import { NgModel } from '@angular/forms';
import { DataService } from '../../app-services/data-service';
import { error } from 'protractor';

@Component({
  selector: 'app-get-codes',
  templateUrl: './get-codes.component.html',
  styleUrls: ['./get-codes.component.css'],
  providers: [DataService]
})
export class GetCodesComponent implements OnInit, AfterViewInit, OnChanges {

  public isPractitioner = false;
  public ordersCounter: number = 0;
  public value: number = 0;
  public grandTotalSum: number = 0;
  public listOfOrders: Array<OrderViewModel> = new Array<OrderViewModel>();
  @ViewChild('codeOptionsDropDown', { static: false })
  public dropDownList: ElementRef;
  @ViewChildren('orderRow')
  public orders: QueryList<ElementRef>;

  constructor(private _renderer2: Renderer2, private _dataService: DataService) {
    this.LoadScript();
  }
    ngOnChanges(changes: SimpleChanges): void {

    }
    ngAfterViewInit(): void {

    }

  ngOnInit() {

  }
  
  private LoadScript() {
    let script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQf-UPTlE9mFmveSuPSTXNNlpYzbN5GcUbSaY4V_Xr0EpyYaOBCsgdJj2rwLLQ52a5gagRy3AHotD8aP';
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    script.id = 'paypal-script';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  private RenderPaypal() {
    for (var i = 0; i < document.getElementById('paypalContainer').children.length; i++) {
      document.getElementById('paypalContainer').removeChild(document.getElementById('paypalContainer').children[i]);
    }
    render({
      id: "#paypalContainer",
      currency: "USD",
      value: `${this.grandTotalSum}`,
      onApprove: (details) => {
        this._dataService.GenerateCodesForTheUser(this.listOfOrders).subscribe(response => {
          localStorage.setItem('currentTabName', 'servey-results-and-reports-section');
          this.listOfOrders = new Array<OrderViewModel>();
          window.location.reload();
        }, error => {
            alert('We had a problem processing your request, please try again!');
        })
      }
    })
  }

  public SelectMonosurveyOption(order: OrderViewModel) {
    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 1;
    this.listOfOrders[order.id].pricePerUnit = 40;
    this.listOfOrders[order.id].discountCoupon = undefined;
    this.listOfOrders[order.id].defaultNumberOfUsages = 1;
    this.listOfOrders[order.id].totalPrice = 40;
    this.CalculateNewGrandTotalSum();
    this.RenderPaypal();
  }

  public NumberOfCodesChanged(event, order) {
    if (order.numberOfCodes >= 0) {
      this.listOfOrders[order.id].numberOfSurveys = this.listOfOrders[order.id].defaultNumberOfUsages * this.listOfOrders[order.id].numberOfCodes;
      this.listOfOrders[order.id].totalPrice = this.listOfOrders[order.id].numberOfSurveys * this.listOfOrders[order.id].pricePerUnit;
      this.CalculateNewGrandTotalSum();
      this.RenderPaypal();

    }
  }

  public SelectMultisurveyFiveUsagesOption(order: OrderViewModel) {
    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 5;
    this.listOfOrders[order.id].pricePerUnit = 38;
    this.listOfOrders[order.id].discountCoupon = undefined;
    this.listOfOrders[order.id].defaultNumberOfUsages = 5;
    this.listOfOrders[order.id].totalPrice = 190;
    this.CalculateNewGrandTotalSum();
    this.RenderPaypal();

  }

  public SelectMultisurveyTenUsagesOption(order: OrderViewModel) {
    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 10;
    this.listOfOrders[order.id].pricePerUnit = 35.60;
    this.listOfOrders[order.id].discountCoupon = undefined;
    this.listOfOrders[order.id].defaultNumberOfUsages = 10;
    this.listOfOrders[order.id].totalPrice = 356;
    this.CalculateNewGrandTotalSum();
    this.RenderPaypal();


  }

  public AddNewOrder(event) {
    this.listOfOrders.push(new OrderViewModel(this.ordersCounter, 1, 1, 40, undefined, 40, 1));
    this.ordersCounter += 1;
    this.CalculateNewGrandTotalSum();
    this.RenderPaypal();

  }

  private CalculateNewGrandTotalSum() {
    this.grandTotalSum = 0;
    this.listOfOrders.forEach(order => {
      this.grandTotalSum += order.totalPrice;
    });
  }

  public DisplayCodesOptionsDropDown(event, order) {
    this._renderer2.setStyle(this.dropDownList.nativeElement, 'display', 'flex');
  }

}
