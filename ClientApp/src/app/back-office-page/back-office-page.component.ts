import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  public couponCreationType: string;

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

  public DisplayGeneralCouponCreationPage() {
    this.backOfficeCurrentPageName = 'generate-coupon-page';
    this.couponCreationType = 'general';
  }

  public DisplayAssociatedCouponCreationPage() {
    this.backOfficeCurrentPageName = 'generate-coupon-page';
    this.couponCreationType = 'associated';
  }

  public EmittErrorContainerHideEvent(event) {
    this.pageHasError = false;
    this.errorMessage = '';
  }

  public EmittError(eventBody) {
    this.pageHasError = true;
    this.errorMessage = eventBody;
    setTimeout(() => {
      document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  public EmittCurrentPage(event) {
    this.backOfficeCurrentPageName = event;
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
