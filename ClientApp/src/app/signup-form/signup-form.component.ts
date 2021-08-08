import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { from } from 'rxjs';
import { RegisterViewModel } from '../../view-models/register-view-model';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { UserViewModel } from '../../view-models/user-view-model';
import { SignInViewModel } from '../../view-models/signin-view-model';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
  providers: [AuthenticationService]
})
export class SignupFormComponent implements OnInit {
  public surveyCode: string;
  public formIsInvalid: boolean = false;
  public errorMessage = "";
  public registerViewModel: RegisterViewModel = new RegisterViewModel();
  public user: UserViewModel;
  public agreeToTermsRadioChecked: boolean = false;
  @Input()
  public redirectToAccountPage: boolean = true;
  @Output()
  public displayIfOperationSuccessful = new EventEmitter<UserViewModel>();

  constructor(private _authService: AuthenticationService, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('surveyCode') != null) {
      this.surveyCode = localStorage.getItem('surveyCode');
    }
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
    }
    else if (this.registerViewModel.password != this.registerViewModel.confirmPassword) {
      this.DisplayErrorMessage('Please enter the same password.');
    }
    else {
      this._authService.RegisterUser(this.registerViewModel)
        .pipe(switchMap((registerUserResponse: any) => {
          let svw = new SignInViewModel();

          svw.email = this.registerViewModel.email;
          svw.password = this.registerViewModel.password;

          return this._authService.SignInUser(svw);
        }))
        .subscribe((signInUserResponse: any) => {
          this.user = signInUserResponse.body;

          localStorage.setItem("jwt", this.user.accessToken);

          if (this.redirectToAccountPage == true) {
            if (this.surveyCode == null) {
              this._router.navigate(['personalAccount']);
            }
          }
          else {
            this.displayIfOperationSuccessful.emit(this.user);
          }
        }, error => {
            this.DisplayErrorMessage('The given data is incorrect, check if you entered correct email and password.');
        });
    }
  }
}
