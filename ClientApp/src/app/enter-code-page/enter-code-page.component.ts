import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { error } from 'protractor';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { TransferCodesViewModel } from '../../view-models/transfer-codes-view-model';
import { UserViewModel } from '../../view-models/user-view-model';


@Component({
  selector: 'app-enter-code-page',
  templateUrl: './enter-code-page.component.html',
  styleUrls: ['./enter-code-page.component.css'],
  providers: [DataService, AccountService]
})
export class EnterCodePageComponent implements OnInit {

  public userAgreedWithTheClause: boolean = false;
  public secondStage: boolean = false;
  public errorMessage: string;
  public codeEntered: string;
  public userIsAuthorized: boolean = false

  constructor(private _dataService: DataService, private _jwtHelper: JwtHelperService, private _router: Router, private _accountService: AccountService) { }

  ngOnInit() {
    let jwt = localStorage.getItem('jwt');
    if (jwt && !this._jwtHelper.isTokenExpired(jwt)) {
      this.userIsAuthorized = true;
    }
  }

  public GetOperationResult(eventResponse) {
    if (eventResponse == true) {
      this.userIsAuthorized = true;
    }
  }

  public ChangeUserAgreementFlag() {
    this.userAgreedWithTheClause = true;
  }

  public NextPageButtonClicked() {
    this.secondStage = true;
  }

  public RedirectToGetCodeTab() {
    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt')['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) == 'User') {
      localStorage.setItem('personalAccountTabName', 'get-codes-section');
      this._router.navigate(['personalAccount']);
    }
    else {
      localStorage.setItem('personalAccountTabName', 'get-codes-and-support-section');
      this._router.navigate(['practitionerAccount']);
    }
  }

  public ProceedToTheNextStage(event: MouseEvent) {
    if (this.codeEntered != null && this.codeEntered != '') {
      this._dataService.CheckIfCodeIsValid(this.codeEntered).subscribe(response => {
        if (response.body == true) {
          //Proceed next
          this.errorMessage = null;
          this._dataService.TransferTheCode(new TransferCodesViewModel(this.codeEntered, this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'])).subscribe((response: any) => {
            if (response.ok) {
              if (this._jwtHelper.decodeToken(localStorage.getItem('jwt')['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) == 'User') {
                localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
                this._router.navigate(['personalAccount']);
              }
              else {
                localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
                this._router.navigate(['practitionerAccount']);
              }
            }
          });
        }
        else {
          //Display errors
          this.errorMessage = 'The entered code is not valid. Please try something else.';
          document.getElementById('error-section-placeholder').focus();
          document.getElementById('error-section').focus();
        }
      })
    }
    else {
      this.errorMessage = 'Please enter the code.';
      document.getElementById('error-section-placeholder').focus();
      document.getElementById('error-section').focus();
    }
  }

}
