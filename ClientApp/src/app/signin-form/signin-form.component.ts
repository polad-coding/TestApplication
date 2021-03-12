import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { SignInViewModel } from '../../view-models/signin-view-model'
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../app-services/authentication-service';
import { error } from 'protractor';
import { UserViewModel } from '../../view-models/user-view-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-form',
  templateUrl: './signin-form.component.html',
  styleUrls: ['./signin-form.component.css'],
  providers: [AuthenticationService]
})
export class SigninFormComponent implements OnInit {

  public surveyCode: string = "AVKSI78";
  public signInViewModel: SignInViewModel = new SignInViewModel();
  public formIsInvalid: boolean = false;
  public errorMessage = "";
  public user: UserViewModel = new UserViewModel();

  constructor(private _router: Router, private _authService: AuthenticationService, private http: HttpClient) {
  }

  ngOnInit() {
  }

  public SubmitSignInForm(signInForm: NgForm) {
    if (signInForm.valid) {
      this._authService.SignInUser(this.signInViewModel).subscribe(response => {
        this.user = response.body;
        localStorage.setItem("jwt", this.user.accessToken);
        console.log('here');
        this._router.navigate(['/success']);
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
