import { Component, ElementRef, HostListener, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { render, paypal } from 'creditcardpayments/creditCardPayments';
import { OrderViewModel } from '../../view-models/order-view-model';
import { DataService } from '../../app-services/data-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserViewModel } from '../../view-models/user-view-model';
import { EmailSenderService } from '../../app-services/email-sender-service';
import { SurveyService } from '../../app-services/survey-service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountService } from '../../app-services/account.service';

@Component({
  selector: 'app-get-codes',
  templateUrl: './get-codes.component.html',
  styleUrls: ['./get-codes.component.css'],
  providers: [DataService, EmailSenderService, AccountService, SurveyService],
  host: {
    '(document:click)': 'DocumentClicked()',
  }
})
export class GetCodesComponent implements OnInit {

  @Input()
  public user: UserViewModel;

  public ordersCounter: number = 0;
  public counter: number = 0;

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
  public firstInformationModalIsVisible = false;
  public secondInformationModalIsVisible = false;
  public mobileModeIsOn = false;

  constructor(private _accountService: AccountService, private _surveyService: SurveyService, private _renderer2: Renderer2, private _dataService: DataService, private _jwtHelper: JwtHelperService, private _emailSenderService: EmailSenderService) {
    //Here we are loading script because for some reason DinkToPdf library that we are using to generate PDFs is conflicting with paypal script, and throws the error when we try to generate PDF.
    this.LoadScript();
  }

  /**
   * On resize, swithes between mobile and desktop modes if needed.
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 599 && this.mobileModeIsOn == false) {
      this.listOfOrders = new Array<OrderViewModel>();
      this.counter = 0;
      this.AddNewOrder(null);
      this.grandTotalSum = this.listOfOrders[0].totalPrice;
      this.totalSum = this.listOfOrders[0].pricePerUnit;
      this.mobileModeIsOn = true;
    }
    else if (event.target.innerWidth > 599 && this.mobileModeIsOn == true) {
      this.grandTotalSum = this.listOfOrders[0].totalPrice;
      this.totalSum = this.listOfOrders[0].pricePerUnit;
      this.mobileModeIsOn = false;
    }
    this.CalculateNewGrandTotalSum();
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
    else if (modalName == 'firstInformationModal') {
      this.firstInformationModalIsVisible = false;
    }
  }

  private SetTheVersionOfThePage() {
    if (window.innerWidth <= 599) {
      this.mobileModeIsOn = true;
    }
  }

  public CurrentUserIsPractitioner(): boolean {
    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] == 'Practitioner') {
      return true;
    }

    return false;
  }

  ngOnInit() {
    localStorage.setItem('practitionerAccountTabName', 'get-codes-and-support-section');

    this.SetTheVersionOfThePage();

    this._accountService.GetCurrentUser().pipe(switchMap((getCurrentUserResponse: any) => {
      this.user = getCurrentUserResponse.body;

      if (this.CurrentUserIsPractitioner()) {
        console.log('here');
        this.enablePractitionersDiscount = true;
        return this._dataService.GetMembershipStatus();
      }

      return of(null);
    })).subscribe((getMembershipStatusResponse: any) => {
      if (getMembershipStatusResponse != null && getMembershipStatusResponse.body != null) {
        this.enableMembershipDiscount = true;
      }
    });

    this.AddNewOrder(null);
  }

  public DocumentClicked() {
    this.paypalModalIsVisible = false;
  }

  /**
   * Removes error appearence from coupon input fields.
   * @param event
   */
  public RemoveErrorAppearence(event) {
    this._renderer2.setStyle(event.target, 'border', '1px solid #006F91');
    this._renderer2.setStyle(event.target.nextSibling, 'display', 'none');
  }

  /**
   * Checks if entered coupon is valid or not.
   * @param order
   * @param event
   */
  public CheckForDiscountValidity(order: OrderViewModel, event) {
    let coupon = event.target.value;

    if (coupon == '' || coupon == undefined) {
      order.totalPrice = order.numberOfUsages * order.pricePerUnit;
      order.couponBody = null;
      order.discountRate = 0;
      this.CalculateNewGrandTotalSum();
      return;
    }

    this._dataService.GetCoupon(coupon).subscribe((getCouponResponse: any) => {
      if (getCouponResponse.body == null) {
        return;
      }

      order.couponBody = getCouponResponse.body.couponBody;
      order.discountRate = getCouponResponse.body.discountRate;
      order.totalPrice = order.numberOfUsages * order.pricePerUnit - (order.numberOfUsages * order.pricePerUnit * order.discountRate / 100);
      this.CalculateNewGrandTotalSum();
    }, error => {
      order.totalPrice = order.numberOfUsages * order.pricePerUnit;
      order.couponBody = null;
      order.discountRate = 0;
      this.CalculateNewGrandTotalSum();
      this._renderer2.setStyle(event.target, 'border', '1px solid red');
      this._renderer2.setStyle(event.target.nextSibling, 'display', 'initial');
    });
  }

  /**
   *On transaction approval, generates orders with codes, creates the surveys from these orders and then removes them.
   * */
  private RenderPayPal() {
    render({
      id: "#paypalContainer",
      currency: "USD",
      value: `${this.grandTotalSum.toFixed(2)}`,
      onApprove: (details) => {
        this._dataService.GenerateCodesForTheUser(this.listOfOrders).pipe(switchMap((generateCodesForTheUserResponse: any) => {
          console.log('here 4');

          localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
          localStorage.setItem('practitionerAccountTabName', 'survey-results-and-reports-section');

          return this._surveyService.CreateSurvey(generateCodesForTheUserResponse.body);
        })).pipe(switchMap((surveysCreateResponse) => {
          return this._dataService.DeleteAllOrdersOfTheCurrentUser();
        })).subscribe((deleteAllOrdersOfTheUserResponse: any) => {
          location.reload();
        });
      }
    })
  }

  /**
   * Before displaying paypal checks if all entered associated coupons related to the user and used adequate amount of times, then displays the paypal modal and renders the paypal actions inside it.
   * @param event
   */
  public DisplayPayPalModal(event: MouseEvent) {
    event.stopPropagation();

    this._dataService.CheckIfAllCouponsAreValid(this.listOfOrders).subscribe((response: any) => {
      if (response.body.result == false) {
        alert('Some of your coupons were used too many times.');
        return;
      }

      this.paypalModalIsVisible = true;
      document.getElementById('paypalContainer').innerHTML = '';
      setTimeout(() => {
        document.getElementById('paypalContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      this.RenderPayPal();
    });
  }

  /**
   *Loads the script needed for paypal transactions.
   * */
  private LoadScript() {
    let script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQf-UPTlE9mFmveSuPSTXNNlpYzbN5GcUbSaY4V_Xr0EpyYaOBCsgdJj2rwLLQ52a5gagRy3AHotD8aP';
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    script.id = 'paypal-script';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  /**
   * Changes the type of the code. Codes can be of two types: monosurvey code (code with 1 usage), multisurvey codes (with 5 and 10 usages).
   * @param order
   * @param event
   */
  public ChangeTheCodeType(order: OrderViewModel, event) {
    if (event.target.value == 'monosurveyCode') {
      this.SelectNewOption(order, 1, 1, 40, 1);
    }
    else if (event.target.value == 'multisurveyCodeFiveSurveys') {
      this.SelectNewOption(order, 1, 5, 38, 5);
    }
    else {
      this.SelectNewOption(order, 1, 10, 35.60, 10);
    }
  }

  public SelectNewOption(order: OrderViewModel, numberOfCodes: number, numberOfUsages: number, pricePerUnit: number, defaultNumberOfUsages: number) {
    this.listOfOrders[order.id].numberOfCodes = numberOfCodes;
    this.listOfOrders[order.id].numberOfUsages = numberOfUsages;
    this.listOfOrders[order.id].pricePerUnit = pricePerUnit;
    this.listOfOrders[order.id].couponBody = order.couponBody;
    this.listOfOrders[order.id].defaultNumberOfUsages = defaultNumberOfUsages;
    this.listOfOrders[order.id].totalPrice = pricePerUnit * numberOfUsages - (pricePerUnit * numberOfUsages * (order.discountRate == null ? 0 : order.discountRate) / 100);
    this.CalculateNewGrandTotalSum();
  }

  public NumberOfCodesChanged(event, order) {
    if (order.numberOfCodes < 0) {
      return;
    }

    order.numberOfCodes = Math.floor(order.numberOfCodes);
    this.listOfOrders[order.id].numberOfUsages = this.listOfOrders[order.id].defaultNumberOfUsages * this.listOfOrders[order.id].numberOfCodes;
    this.listOfOrders[order.id].totalPrice = this.listOfOrders[order.id].numberOfUsages * this.listOfOrders[order.id].pricePerUnit - (this.listOfOrders[order.id].numberOfUsages * this.listOfOrders[order.id].pricePerUnit * (order.discountRate == null ? 0 : order.discountRate) / 100);
    this.CalculateNewGrandTotalSum();
  }

  public NumberOfCodesChangedMobile(event) {
    if (this.listOfOrders[0].numberOfCodes < 0) {
      return;
    }

    this.listOfOrders[0].numberOfCodes = Math.floor(this.listOfOrders[0].numberOfCodes);
    this.listOfOrders[0].numberOfUsages = this.listOfOrders[0].defaultNumberOfUsages * this.listOfOrders[0].numberOfCodes;
    this.listOfOrders[0].totalPrice = this.listOfOrders[0].numberOfUsages * this.listOfOrders[0].pricePerUnit - (this.listOfOrders[0].numberOfUsages * this.listOfOrders[0].pricePerUnit * (this.listOfOrders[0].discountRate == null ? 0 : this.listOfOrders[0].discountRate) / 100);
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

    if (this.enableMembershipDiscount == true) {
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
