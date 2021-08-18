import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SignInViewModel } from '../../view-models/signin-view-model'
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { UserViewModel } from '../../view-models/user-view-model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css'],
  providers: [AuthenticationService]
})
export class SigninFormComponent implements OnInit {

  public signInViewModel: SignInViewModel = new SignInViewModel();

  public formIsInvalid: boolean = false;
  public errorMessage = "";

  public user: UserViewModel = new UserViewModel();

  //These flag points if, after the successful signin, we need to redirect the user to his account. Or we should display him enter code page if its not the case.
  @Input()
  public redirectToAccountPage: boolean = true;
  //Notify parent (enter code component) if the signin was successful.
  @Output()
  public displayIfOperationSuccessful = new EventEmitter<UserViewModel>();

  constructor(private _router: Router,
    private _authService: AuthenticationService,
    private jwtHelper: JwtHelperService
  ) {
  }

  ngOnInit() {

  }

  public SubmitSignInForm(signInForm: NgForm) {
    if (!signInForm.valid) {
      this.DisplayError('The entered data is in incorrect format, your email must be valid email address and your password must consist of at least 8 characters.')
      return;
    }

    this._authService.SignInUser(this.signInViewModel).subscribe(response => {
      this.user = response.body;
      localStorage.setItem("jwt", this.user.accessToken);

      //Just notify the parent, without redirection.
      if (!this.redirectToAccountPage) {
        this.displayIfOperationSuccessful.emit(this.user);
        return;
      }

      this.RedirectToTheNeededAccountPage();
    },
      error => this.DisplayError('The given data is incorrect, check if you entered correct email and password.')
    );
  }

  private DisplayError(errorMessage: string) {
    this.formIsInvalid = true;
    this.errorMessage = errorMessage;
    setTimeout(() => {
      document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  private RedirectToTheNeededAccountPage() {
    if (this.user.accessToken && this.jwtHelper.decodeToken(this.user.accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
      localStorage.setItem('personalAccountTabName', 'my-account-section');
      this._router.navigate(['/personalAccount'], { state: { user: this.user } });
    }
    else {
      localStorage.setItem('practitionerAccountTabName', 'my-account-section');
      this._router.navigate(['/practitionerAccount']);
    }
  }

}
