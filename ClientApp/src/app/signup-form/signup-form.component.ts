import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegisterViewModel } from '../../view-models/register-view-model';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { UserViewModel } from '../../view-models/user-view-model';
import { SignInViewModel } from '../../view-models/signin-view-model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
  providers: [AuthenticationService, AccountService]
})
export class SignupFormComponent implements OnInit {
  public formIsInvalid: boolean = false;
  public errorMessage = "";

  public registerViewModel: RegisterViewModel = new RegisterViewModel();

  public user: UserViewModel;

  public agreeToTermsRadioChecked: boolean = false;

  //These flag points if, after the successful signin, we need to redirect the user to his account. Or we should display him enter code page if its not the case.
  @Input()
  public redirectToAccountPage: boolean = true;

  //Notify parent (enter code component) if the signin was successful.
  @Output()
  public displayIfOperationSuccessful = new EventEmitter<UserViewModel>();

  constructor(private _authService: AuthenticationService, private _router: Router, private _accountService: AccountService) { }

  ngOnInit() {

  }

  public CheckAgreeToTermRadio() {
    this.agreeToTermsRadioChecked = true;
  }

  private DisplayErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.formIsInvalid = true;
    setTimeout(() => {
      document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  public SubmitSignUpForm(registerForm: NgForm) {
    if (this.registerViewModel.email != this.registerViewModel.confirmEmail) {
      this.DisplayErrorMessage('Please enter the same email address.');
      return;
    }

    if (this.registerViewModel.password != this.registerViewModel.confirmPassword) {
      this.DisplayErrorMessage('Please enter the same password.');
      return;
    }

    this._accountService.CheckIfMailIsRegistered(this.registerViewModel.email).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body == true) {
        this.DisplayErrorMessage('This email is already registered in our Database.')
        return of(null);
      }

      return this._accountService.CheckIfProfessionalMailIsRegistered(this.registerViewModel.email);
    })).pipe(switchMap((checkIfProfessionalMailIsRegisteredResponse: any) => {
      if (checkIfProfessionalMailIsRegisteredResponse == null) {
        return of(null);
      }

      if (checkIfProfessionalMailIsRegisteredResponse.body == true) {
        this.DisplayErrorMessage('This email is already registered in our Database.')
        return of(null);
      }

      return this._authService.RegisterUser(this.registerViewModel);
    })).pipe(switchMap((registerUserResponse: any) => {
      if (registerUserResponse == null) {
        return of(null);
      }

      let svw = new SignInViewModel();

      svw.email = this.registerViewModel.email;
      svw.password = this.registerViewModel.password;

      return this._authService.SignInUser(svw);
    })).subscribe((signInUserResponse: any) => {
      if (signInUserResponse == null) {
        return;
      }

      this.user = signInUserResponse.body;

      localStorage.setItem("jwt", this.user.accessToken);

      if (this.redirectToAccountPage == true) {
        this._router.navigate(['personalAccount']);
        return;
      }

      this.displayIfOperationSuccessful.emit(this.user);
    }, error => this.DisplayErrorMessage('The given data is incorrect, check if you entered correct email and password.')
    );
  }
}
