import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  public user: UserViewModel;

  public startFromSecondStage: boolean = false;

  public errorMessage: string;

  public codeEntered: string;

  public userIsAuthorized: boolean = false;


  constructor(private _dataService: DataService, private _jwtHelper: JwtHelperService, private _router: Router, private _accountService: AccountService) { }

  private AssureThatUserIsAuthorized() {
    let jwt = localStorage.getItem('jwt');

    if (!jwt || this._jwtHelper.isTokenExpired(jwt)) {
      return;
    }

    this.userIsAuthorized = true;
  }

  private AssureThatUserIsNotAPractitioner() {
    let jwt = localStorage.getItem('jwt');

    if (this._jwtHelper.decodeToken(jwt)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] != 'User') {
      this._router.navigate(['']);
    }
  }

  ngOnInit() {
    let userAgreedOnTheClause = localStorage.getItem('userAgreedOnTheClause');

    this.AssureThatUserIsAuthorized();

    this.AssureThatUserIsNotAPractitioner();

    if (userAgreedOnTheClause != null && userAgreedOnTheClause == 'true') {
      this.userAgreedWithTheClause = true;
      this.startFromSecondStage = true;
    }
  }

  /**
   * Gets the authorization page result, in case if response is ok, reloads the page.
   * @param eventResponse
   */
  public GetAuthorizationOperationResult(eventResponse) {
    if (eventResponse != null) {
      window.location.reload();
    }
  }

  public ChangeUserAgreementFlag() {
    this.userAgreedWithTheClause = true;
    localStorage.setItem('userAgreedOnTheClause', 'true');
  }

  public NextPageButtonClicked() {
    this.startFromSecondStage = true;
  }

  public RedirectToGetCodeTab() {
    localStorage.setItem('personalAccountTabName', 'get-codes-section');
    this._router.navigate(['personalAccount']);
  }

  private DisplayErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    document.getElementById('error-section-placeholder').focus();
    document.getElementById('error-section').focus();
  }

  public ProceedToTheNextStage(event: MouseEvent) {
    if (this.codeEntered == null || this.codeEntered == '') {
      this.DisplayErrorMessage('Please enter the code.');
      return;
    }

    this._dataService.CheckIfCodeIsValid(this.codeEntered).pipe(switchMap((checkIfCodeIsValidResponse) => {
      if (checkIfCodeIsValidResponse.body == false) {
        return of('The entered code is not valid. Please try something else.');
      }

      this.errorMessage = null
      return this._dataService.TransferTheCode(new TransferCodesViewModel(this.codeEntered, this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']));
    })).subscribe((transferTheCodeResponse: any) => {
      if (typeof transferTheCodeResponse == 'string') {
        this.DisplayErrorMessage(transferTheCodeResponse);
        return;
      }

      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }, error => {
      let userWantsToProceedToHisPersonalSpace = window.confirm('This code already belongs to your account, do you want to proceed to your personal space?');

      if (userWantsToProceedToHisPersonalSpace) {
        localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
        this._router.navigate(['personalAccount']);
      }
    });
  }

}
