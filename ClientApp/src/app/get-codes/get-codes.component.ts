import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { render, paypal } from 'creditcardpayments/creditCardPayments';
import { OrderViewModel } from '../../view-models/order-view-model';
import { NgModel } from '@angular/forms';
import { DataService } from '../../app-services/data-service';
import { error } from 'protractor';
import { GetCouponRequestResponseViewModel } from '../../view-models/get-coupon-request-response-view-model';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-get-codes',
  templateUrl: './get-codes.component.html',
  styleUrls: ['./get-codes.component.css'],
  providers: [DataService],
  host: {
    '(document:click)': 'DocumentClicked()',
  }
})
export class GetCodesComponent implements OnInit, AfterViewInit, OnChanges {

  public isPractitioner = false;
  public ordersCounter: number = 0;
  public value: number = 0;
  public errorMessage: string = '';
  public totalSum: number = 0;
  public grandTotalSum: number = 0;
  public listOfOrders: Array<OrderViewModel> = new Array<OrderViewModel>();
  public enablePractitionersDiscount: boolean = false;
  public enableMembershipDiscount: boolean = false;
  @ViewChild('codeOptionsDropDown', { static: false })
  public dropDownList: ElementRef;
  @ViewChildren('orderRow')
  public orders: QueryList<ElementRef>;
  @ViewChildren('couponField')
  public coupons: QueryList<ElementRef>;
  public paypalModalIsVisible = false;
  public counter: number = 0;
  public mobileModeIsOn = false;
  public firstInformationModalIsVisible = false;
  public secondInformationModalIsVisible = false;
  private listOfAssociatedCouponsToCountdown: Array<GetCouponRequestResponseViewModel> = new Array<GetCouponRequestResponseViewModel>();

  constructor(private _renderer2: Renderer2, private _dataService: DataService, private _jwtHelper: JwtHelperService) {
    this.LoadScript();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngAfterViewInit(): void {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 599) {
      if (this.mobileModeIsOn == false) {
        this.listOfOrders = new Array<OrderViewModel>();
        this.counter = 0;
        this.AddNewOrder(null);
        this.grandTotalSum = this.listOfOrders[0].totalPrice;
        this.totalSum = this.listOfOrders[0].pricePerUnit;
        this.mobileModeIsOn = true;
        this.CalculateNewGrandTotalSum();
      }
    }
    else if (event.target.innerWidth > 599) {
      if (this.mobileModeIsOn == true) {
        this.grandTotalSum = this.listOfOrders[0].totalPrice;
        this.totalSum = this.listOfOrders[0].pricePerUnit;
        this.mobileModeIsOn = false;
        this.CalculateNewGrandTotalSum();
      }
    }
  }

  public DisplayInformationModal(modalName: string) {
    if (modalName == 'secondInformationModal') {
      this.secondInformationModalIsVisible = true;
    }
    else if (modalName == 'firstInformationModal') {
      this.firstInformationModalIsVisible = true;
    }
  }

  public CloseInformationModal(modalName: string) {
    if (modalName == 'secondInformationModal') {
      this.secondInformationModalIsVisible = false;
    }
    else if (modalName == 'firstInformationModal'){
      this.firstInformationModalIsVisible = false;
    }
  }

  ngOnInit() {
    if (window.innerWidth <= 599) {
      this.mobileModeIsOn = true;
    }

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] == 'Practitioner') {
      this.enablePractitionersDiscount = true;
    }

    this._dataService.GetMembershipStatus().subscribe((response: any) => {
      if (response.body != null) {
        this.enableMembershipDiscount = true;
      }
    });

    this.AddNewOrder(null);
  }

  public DocumentClicked() {
    this.paypalModalIsVisible = false;
  }

  public RemoveErrorAppearence(event) {
    this._renderer2.setStyle(event.target, 'border', '1px solid #006F91');
    this._renderer2.setStyle(event.target.nextSibling, 'display', 'none');
  }

  public CheckForDiscountValidity(order: OrderViewModel, event) {
    let coupon = event.target.value;

    if (coupon != '' && coupon != undefined) {
      this._dataService.GetCoupon(coupon).subscribe((getCouponResponse: any) => {
        if (getCouponResponse.body != null) {
          order.couponBody = getCouponResponse.body.couponBody;
          order.discountRate = getCouponResponse.body.discountRate;
          order.totalPrice = order.numberOfSurveys * order.pricePerUnit - (order.numberOfSurveys * order.pricePerUnit * order.discountRate / 100);
          this.CalculateNewGrandTotalSum();
        }
      }, error => {
        order.totalPrice = order.numberOfSurveys * order.pricePerUnit;
        order.couponBody = null;
        order.discountRate = 0;
        this.CalculateNewGrandTotalSum();
        this._renderer2.setStyle(event.target, 'border', '1px solid red');
        //discount - coupon - error - text - of - order -
        this._renderer2.setStyle(event.target.nextSibling, 'display', 'initial');
        //this._renderer2.setStyle(document.getElementById('discount-coupon-error-text-of-order-' + order.id), 'display', 'initial');
      });
    }
    else {
      order.totalPrice = order.numberOfSurveys * order.pricePerUnit;
      order.couponBody = null;
      order.discountRate = 0;
      this.CalculateNewGrandTotalSum();

    }
  }




  public DisplayPayPalModal(event: MouseEvent) {
    this._dataService.CheckIfAllCouponsAreValid(this.listOfOrders).subscribe((response: any) => {
      console.info(response);
      if (response.body.result == true) {
        event.stopPropagation();
        this.paypalModalIsVisible = true;
        if (document.getElementById('paypalContainer').firstChild != undefined) {
          document.getElementById('paypalContainer').removeChild(document.getElementById('paypalContainer').firstChild);
        }
        setTimeout(() => {
          document.getElementById('paypalContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        render({
          id: "#paypalContainer",
          currency: "USD",
          value: `${this.grandTotalSum.toFixed(2)}`,
          onApprove: (details) => {

            this._dataService.GenerateCodesForTheUser(this.listOfOrders).subscribe(response => {
              //Perform the operation
              localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
              localStorage.setItem('practitionerAccountTabName', 'servey-results-and-reports-section');
                
              this.listOfOrders = new Array<OrderViewModel>();
              window.location.reload();
            }, error => {
              alert('We had a problem processing your request, please try again!');
            })
          }
        })
      }
      else {
        alert('Some of your coupons were used too many times.');
      }
    });
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

  }

  public ChangeTheCodeType(order: OrderViewModel, event) {
    if (event.target.value == 'monosurveyCode') {
      this.SelectMonosurveyOption(order);
    }
    else if (event.target.value == 'multisurveyCodeFiveSurveys') {
      this.SelectMultisurveyFiveUsagesOption(order);
    }
    else {
      this.SelectMultisurveyTenUsagesOption(order);
    }
  }

  public SelectMonosurveyOption(order: OrderViewModel) {
    console.info(order);

    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 1;
    this.listOfOrders[order.id].pricePerUnit = 40;
    this.listOfOrders[order.id].couponBody = order.couponBody;
    this.listOfOrders[order.id].defaultNumberOfUsages = 1;
    this.listOfOrders[order.id].totalPrice = 40 - (40 * (order.discountRate == null ? 0 : order.discountRate) / 100);
    this.CalculateNewGrandTotalSum();
  }

  public NumberOfCodesChanged(event, order) {
    if (order.numberOfCodes >= 0) {
      this.listOfOrders[order.id].numberOfSurveys = this.listOfOrders[order.id].defaultNumberOfUsages * this.listOfOrders[order.id].numberOfCodes;
      this.listOfOrders[order.id].totalPrice = this.listOfOrders[order.id].numberOfSurveys * this.listOfOrders[order.id].pricePerUnit - (this.listOfOrders[order.id].numberOfSurveys * this.listOfOrders[order.id].pricePerUnit * (order.discountRate == null ? 0 : order.discountRate) / 100);
      this.CalculateNewGrandTotalSum();
      console.info(this.listOfOrders[order.id]);
    }
  }

  //TODO - check why doesn't work here
  public NumberOfCodesChangedMobile(event) {
    if (this.listOfOrders[0].numberOfCodes >= 0) {
      this.listOfOrders[0].numberOfSurveys = this.listOfOrders[0].defaultNumberOfUsages * this.listOfOrders[0].numberOfCodes;
      this.listOfOrders[0].totalPrice = this.listOfOrders[0].numberOfSurveys * this.listOfOrders[0].pricePerUnit - (this.listOfOrders[0].numberOfSurveys * this.listOfOrders[0].pricePerUnit * (this.listOfOrders[0].discountRate == null ? 0 : this.listOfOrders[0].discountRate) / 100);
      this.CalculateNewGrandTotalSum();
    }
  }

  public SelectMultisurveyFiveUsagesOption(order: OrderViewModel) {
    console.info(order);

    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 5;
    this.listOfOrders[order.id].pricePerUnit = 38;
    this.listOfOrders[order.id].couponBody = order.couponBody;
    this.listOfOrders[order.id].defaultNumberOfUsages = 5;
    this.listOfOrders[order.id].totalPrice = 190 - (190 * (order.discountRate == null ? 0 : order.discountRate) / 100);
    this.CalculateNewGrandTotalSum();

  }

  public SelectMultisurveyTenUsagesOption(order: OrderViewModel) {
    console.info(order);
    this.listOfOrders[order.id].numberOfCodes = 1;
    this.listOfOrders[order.id].numberOfSurveys = 10;
    this.listOfOrders[order.id].pricePerUnit = 35.60;
    this.listOfOrders[order.id].couponBody = order.couponBody;
    this.listOfOrders[order.id].defaultNumberOfUsages = 10;
    this.listOfOrders[order.id].totalPrice = 356 - (356 * (order.discountRate == null ? 0 : order.discountRate) / 100);
    this.CalculateNewGrandTotalSum();


  }

  public AddNewOrder(event) {
    this.listOfOrders.push(new OrderViewModel(this.counter, 1, 1, 40, undefined, 40, 1));
    this.counter += 1;
    this.ordersCounter += 1;
    this.CalculateNewGrandTotalSum();
  }

  private CalculateNewGrandTotalSum() {
    this.grandTotalSum = 0;
    this.totalSum = 0;
    this.listOfOrders.forEach(order => {
      this.grandTotalSum += order.totalPrice;
      this.totalSum += order.totalPrice;
    });

    let membershipDiscountValue = 0;
    let practitionerDiscountValue = 0;

    if (this.enableMembershipDiscount = true) {
      membershipDiscountValue = this.grandTotalSum * 20 / 100;
    }

    if (this.enablePractitionersDiscount) {
      practitionerDiscountValue = this.grandTotalSum * 25 / 100;
    }

    this.grandTotalSum -= membershipDiscountValue;
    this.grandTotalSum -= practitionerDiscountValue;

  }

  public DisplayCodesOptionsDropDown(event, order) {
    this._renderer2.setStyle(this.dropDownList.nativeElement, 'display', 'flex');
  }

}
