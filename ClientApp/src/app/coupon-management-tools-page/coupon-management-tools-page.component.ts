import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { AssociatedCouponViewModel } from '../../view-models/associated-coupon-view-model';
import { GeneralCouponViewModel } from '../../view-models/general-coupon-view-model';

@Component({
  selector: 'app-coupon-management-tools-page',
  templateUrl: './coupon-management-tools-page.component.html',
  styleUrls: ['./coupon-management-tools-page.component.css'],
  providers: [AccountService, DataService]
})
export class CouponManagementToolsPageComponent implements OnInit {


  @Input()
  public couponCreationType: string;
  public listOfGeneralCoupons: Array<GeneralCouponViewModel> = new Array<GeneralCouponViewModel>();
  public associatedCoupon: AssociatedCouponViewModel = new AssociatedCouponViewModel();
  public pageHasError: boolean = false;
  public errorMessage: string = '';
  @Output()
  public errorMessageEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public currentPageNameEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public hideErrorContainerEventEmitter: EventEmitter<any> = new EventEmitter();
  public addAssociatedEmailModalIsVisible: boolean = false;
  public emailOfNewUserToAssociate: string = '';

  constructor(private _dataService: DataService, private _accountService: AccountService) { }

  ngOnInit() {
  }

  public AssociateNewUser(event: MouseEvent) {
    event.stopPropagation();

    if (this.emailOfNewUserToAssociate.length == 0) {
      this.errorMessageEmitter.emit('Entered email is incorrect.');
      return;
    }

    this._accountService.CheckIfMailIsRegistered(this.emailOfNewUserToAssociate).subscribe((response: any) => {
      console.log(response);
      if (response.body == true) {

        if (!this.CheckIfAssociatedCouponAlreadyHasUserEmail(this.emailOfNewUserToAssociate)) {
          this.associatedCoupon.associatedUsersEmails.push(this.emailOfNewUserToAssociate);
          this.emailOfNewUserToAssociate = '';
          this.addAssociatedEmailModalIsVisible = false;
          this.hideErrorContainerEventEmitter.emit(null);
          return;
        }
      }
      this.errorMessageEmitter.emit('Entered email is incorrect.');
    });
  }

  public CreateAssociatedCoupon() {

    if (this.AssociatedCouponIsCorrect() == true) {
      this._dataService.CreateAssociatedCoupon(this.associatedCoupon).subscribe((response: any) => {
        this.associatedCoupon = new AssociatedCouponViewModel();
        this.emailOfNewUserToAssociate = '';
      });
    }
  }

  private AssociatedCouponIsCorrect(): boolean {
    if (this.associatedCoupon.couponBody == undefined || this.associatedCoupon.couponBody.length == 0) {
      this.errorMessageEmitter.emit('Coupon body must contain at least one character.');
      return false;
    }
    else if (this.associatedCoupon.discountRate == undefined || this.associatedCoupon.discountRate <= 0 || this.associatedCoupon.discountRate >= 100) {
      this.errorMessageEmitter.emit('Discount rate is incorrect. Reminder: discount rate must be more that 0% and less than 100%.');
      return false;
    }
    else if (this.associatedCoupon.numberOfUsages == undefined || this.associatedCoupon.numberOfUsages <= 0) {
      this.errorMessageEmitter.emit('Number of usages must be more than 0.');
      return false;
    }

    return true;
  }

  private CheckIfAssociatedCouponAlreadyHasUserEmail(userEmail: string): boolean {
    this.associatedCoupon.associatedUsersEmails.forEach(aue => {
      if (aue == userEmail) {
        return true;
      }
    });
    return false;
  }

  public DisplayAddAssociatedEmailModal() {
    this.addAssociatedEmailModalIsVisible = true;
  }

  public CreateGeneralCoupons() {
    this.CheckIfGeneralCouponsAreValid();
    if (this.pageHasError != true) {
      this._dataService.CreateGeneralCoupons(this.listOfGeneralCoupons).subscribe(response => {
        if (response.ok) {
          this.listOfGeneralCoupons = new Array<GeneralCouponViewModel>();
        }
      }, error => {
        this.pageHasError = true;
        setTimeout(() => {
          document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
          this.errorMessage = 'You have entered duplicate coupons';
          return false;
        }, 100);
      });
    }
  }

  public AddNewGeneralCoupon() {
    this.listOfGeneralCoupons.push(new GeneralCouponViewModel());
  }

  public GoBackToHomeBackOfficePage() {
    this.currentPageNameEmitter.emit('home');
  }

  private CheckIfGeneralCouponsAreValid() {

    if (this.listOfGeneralCoupons.length == 0) {
      //document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
      this.errorMessageEmitter.emit('You must add at least one coupon');
      return false;

    }

    this.listOfGeneralCoupons.forEach(gc => {
      if (gc.couponBody == undefined || gc.couponBody.length == 0) {
        this.errorMessageEmitter.emit('One of your coupon bodys are null');
      }
      else if (gc.discountRate == undefined || gc.discountRate > 100 || gc.discountRate <= 0) {
        this.errorMessageEmitter.emit('Some of your discount rates are invalid. Reminder: discount rate must be more than 0 and less than or equal to 100');
      }
    })

    if (this.pageHasError) return false;

    this._dataService.CheckIfAllGeneralCouponsAreUnique(this.listOfGeneralCoupons).subscribe(response => {
      if (response.body == false) {
        this.errorMessageEmitter.emit('Some of your coupons already exist in the DB.');
      }
    });

  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.hideErrorContainerEventEmitter.emit(null);
  }

}
