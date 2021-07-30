import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { error } from 'console';
import { DataService } from '../../app-services/data-service';
import { GeneralCouponViewModel } from '../../view-models/general-coupon-view-model';

@Component({
  selector: 'app-back-office-page',
  templateUrl: './back-office-page.component.html',
  styleUrls: ['./back-office-page.component.css'],
  providers: [DataService]
})
export class BackOfficePageComponent implements OnInit {

  public backOfficeCurrentPageName: string;
  public pageHasError: boolean = false;
  public errorMessage: string = '';
  public listOfGeneralCoupons: Array<GeneralCouponViewModel> = new Array<GeneralCouponViewModel>();

  constructor(private _jwtHelper: JwtHelperService, private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    let jwt = localStorage.getItem('jwt');
    let currentPage = localStorage.getItem('backOfficeCurrentPageName');

    if (currentPage == undefined) {
      this.backOfficeCurrentPageName = 'home';
      localStorage.setItem('backOfficeCurrentPageName', 'home');
    }
    else {
      this.backOfficeCurrentPageName = currentPage;
    }

    if (jwt == null || this._jwtHelper.isTokenExpired(jwt) || this._jwtHelper.decodeToken(jwt)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] != 'Admin') {
      this._router.navigate(['']);
    }

  }

  public CreateGeneralCoupons() {
    this.CheckIfGeneralCouponsAreValid();
    if (this.pageHasError != true) {
      this._dataService.CreateGeneralCoupons(this.listOfGeneralCoupons).subscribe(response => {
        if (response.ok) {
          this.listOfGeneralCoupons = new Array<GeneralCouponViewModel>();
          this.backOfficeCurrentPageName = 'home';
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

  private CheckIfGeneralCouponsAreValid() {
    this.pageHasError = false;

    if (this.listOfGeneralCoupons.length == 0) {
      this.pageHasError = true;
      setTimeout(() => {
        document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
        this.errorMessage = 'You must add at least one coupon';
      }, 100);
      return false;

    }

    this.listOfGeneralCoupons.forEach(gc => {
      if (gc.couponBody == undefined || gc.couponBody.length == 0) {
        this.pageHasError = true;
        setTimeout(() => {
          document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
          this.errorMessage = 'One of your coupon bodys are null';
        }, 100);
      }
      else if (gc.discountRate == undefined || gc.discountRate > 100 || gc.discountRate <= 0) {
        this.pageHasError = true;
        setTimeout(() => {
          document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
          this.errorMessage = 'Some of your discount rates are invalid. Reminder: discount rate must be more than 0 and less than or equal to 100';
        }, 100);
      }
    })

    if (this.pageHasError) return false;

    this._dataService.CheckIfAllGeneralCouponsAreUnique(this.listOfGeneralCoupons).subscribe(response => {
      if (response.body == false) {
        this.pageHasError = true;
        setTimeout(() => {
          document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
          this.errorMessage = 'Some of your coupons already exist in the DB.';
        }, 100);
      }
    });

  }

  public AddNewGeneralCoupon() {
    this.listOfGeneralCoupons.push(new GeneralCouponViewModel());
  }

  public PreventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleActionsVisibility(event) {
    //event.stopPropagation();
    console.log(event);
    let nextSibling: HTMLElement = event.target.nextElementSibling;
    let arrowImage: HTMLElement = event.target.lastChild;

    if (nextSibling.style.display == 'none') {
      nextSibling.style.display = 'flex';
      nextSibling.scrollIntoView({ behavior: 'smooth' });
      arrowImage.style.transform = "rotate(90deg)";
    }
    else {
      nextSibling.style.display = 'none';
      nextSibling.scrollIntoView({ behavior: 'smooth' });
      arrowImage.style.transform = "rotate(-90deg)";
    }
  }

}
