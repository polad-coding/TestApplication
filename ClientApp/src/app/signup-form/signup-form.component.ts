import { Component, OnInit } from '@angular/core';
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

  constructor(private _authService: AuthenticationService, private _router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('surveyCode') != null) {
      this.surveyCode = localStorage.getItem('surveyCode');
    }
  }


  public SubmitSignUpForm(registerForm: NgForm) {
    this._authService.RegisterUser(this.registerViewModel).subscribe(response => {
      let svw = new SignInViewModel();
      svw.email = this.registerViewModel.email;
      svw.password = this.registerViewModel.password;
      this._authService.SignInUser(svw).subscribe(res => {
        this.user = res.body;
        localStorage.setItem("jwt", this.user.accessToken);
        if (this.surveyCode == null) {
          this._router.navigate(['personalAccount']);
        }
        else {
          this._router.navigate(['enterSurveyAccount']);
        }
      },
        error => {
          this.formIsInvalid = true;
          this.errorMessage = "The given data is incorrect, check if you entered correct email and password.";
        })
    },
      error => {
        this.formIsInvalid = true;
        this.errorMessage = "The given data is incorrect, check if you entered correct email and password.";
      });
  }


}
