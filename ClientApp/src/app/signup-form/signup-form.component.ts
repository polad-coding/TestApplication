import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { from } from 'rxjs';
import { RegisterViewModel } from '../../view-models/register-view-model';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { UserViewModel } from '../../view-models/user-view-model';
import { SignInViewModel } from '../../view-models/signin-view-model';
import { Router } from '@angular/router';
import { error } from 'protractor';

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

  public SubmitSignUpForm(registerForm: NgForm)
  {
    if (this.registerViewModel.email != this.registerViewModel.confirmEmail) {
      this.errorMessage = 'Please enter the same email addresses.';
      this.formIsInvalid = true;
      setTimeout(() => {
        document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    else if (this.registerViewModel.password != this.registerViewModel.confirmPassword) {
      this.formIsInvalid = true;  
      this.errorMessage = 'Please enter the same passwords.';
      setTimeout(() => {
        document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    else {
      this._authService.RegisterUser(this.registerViewModel).subscribe(response => {
        let svw = new SignInViewModel();
        svw.email = this.registerViewModel.email;
        svw.password = this.registerViewModel.password;
        this._authService.SignInUser(svw).subscribe(res => {
          this.user = res.body;
          localStorage.setItem("jwt", this.user.accessToken);
          if (this.redirectToAccountPage == true) {
              if (this.surveyCode == null) {
              this._router.navigate(['personalAccount']);
            }
          }
          else {
            //TODO - implement event emitter
            this.displayIfOperationSuccessful.emit(this.user);
          }
        },
          error => {
            this.formIsInvalid = true;
            this.errorMessage = "The given data is incorrect, check if you entered correct email and password.";
            setTimeout(() => {
              document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
            }, 100);
          })
      },
        error => {
          this.formIsInvalid = true;
          this.errorMessage = "The given data is incorrect, check if you entered correct email and password.";
          setTimeout(() => {
            document.getElementById('error-section').scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
    }

  }


}
