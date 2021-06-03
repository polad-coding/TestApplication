import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { SignInViewModel } from '../../view-models/signin-view-model'
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { error } from 'protractor';
import { UserViewModel } from '../../view-models/user-view-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css'],
  providers: [AuthenticationService]
})
export class SigninFormComponent implements OnInit {

  public surveyCode: string;
  public signInViewModel: SignInViewModel = new SignInViewModel();
  public formIsInvalid: boolean = false;
  public errorMessage = "";
  public user: UserViewModel = new UserViewModel();

  constructor(private _router: Router,
    private _authService: AuthenticationService,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
  }

  ngOnInit() {
    if (localStorage.getItem('surveyCode') != null) {
        this.surveyCode = localStorage.getItem('surveyCode');
    }
  }

  public SubmitSignInForm(signInForm: NgForm) {
    if (signInForm.valid) {
      this._authService.SignInUser(this.signInViewModel).subscribe(response => {
        //Assign value to user variable and set token
        this.user = response.body;
        localStorage.setItem("jwt", this.user.accessToken);
        if (this.surveyCode == null) {
          if (this.user.accessToken && this.jwtHelper.decodeToken(this.user.accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
            this._router.navigate(['/personalAccount'], { state: { user: this.user } });
          }
          else if (this.user.accessToken && this.jwtHelper.decodeToken(this.user.accessToken)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'Practitioner') {
            this._router.navigate(['/practitionerAccount']);
          }
        }
        else {
          this._router.navigate(['enterSurveyAccount']);
        }
      },
        error => {
          this.formIsInvalid = true;
          this.errorMessage = "The given data is incorrect, check if you entered correct email and password.";
        });
    }
    else {
      this.formIsInvalid = true;
      this.errorMessage = "The entered data is in incorrect format, your email must be valid email address and your password must consist of at least 8 characters.";
    }
  }

}
