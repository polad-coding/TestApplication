import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { ResetPasswordViewModel } from '../../view-models/reset-password-view-model';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css'],
  providers: [AccountService]
})
export class ResetPasswordPageComponent implements OnInit {

  public email: string;
  public errorMessageIsVisible: boolean = false;
  public errorMessage: string = '';
  public passwordResetToken: string = '';
  public tokenIsSet: boolean = false;
  public linkIsSent: boolean = false;
  public resetPasswordViewModel: ResetPasswordViewModel = new ResetPasswordViewModel();

  constructor(private _accountService: AccountService, private _activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((response) => {
      this.passwordResetToken = response['token'];
      this.email = response['email'];

      if (this.passwordResetToken && this.email) {
        this.tokenIsSet = true;
      }
    })
  }

  @HostListener('document:click', ['$event'])
  public DocumentClicked(event) {
    this.errorMessageIsVisible = false;
  }

  public EmailResetPasswordLink(event: MouseEvent) {
    event.stopPropagation();

    if (!this.InputIsEmail()) {
      this.DisplayError('Entered string is in incorrect format. Please enter the valid email address.');
      return;
    }

    this._accountService.CheckIfMailIsRegistered(this.email).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body == true) {
        return of(true);
      }

      return this._accountService.CheckIfProfessionalMailIsRegistered(this.email);
    })).pipe(switchMap((firstBlockResponse: any) => {
      if (firstBlockResponse != true && firstBlockResponse.body != true) {
        this.DisplayError('This email address is not registered in our database.')
        return of(null);
      }

      return this._accountService.EmailPasswordResetLink(this.email);
    })).subscribe((secondBlockResponse: any) => {
      if (secondBlockResponse != null && secondBlockResponse.ok) {
        this.linkIsSent = true;
      }
    });
  }

  private DisplayError(errorMessage: string) {
    this.errorMessageIsVisible = true;
    this.errorMessage = errorMessage;
  }

  private InputIsEmail() {
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (this.email.length == 0) {
      return false;
    }

    if (stringIsEmail.test(this.email)) {
      return true;
    }

    return false;
  }

  public ResetPassword(event: MouseEvent) {
    event.stopPropagation();

    if (this.resetPasswordViewModel.password != this.resetPasswordViewModel.confirmPassword) {
      this.DisplayError('Please enter the same passwords!');
      return;
    }

    if (!this.PasswordIsCorrect()) {
      this.DisplayError('The entered password is in incorrect format. Reminder: password must be at least 8 characters long, it must contain 1 digit, 1 upper case letter, 1 special character and 1 lower case letter.')
      return;
    }

    this.resetPasswordViewModel.resetToken = this.passwordResetToken;
    this.resetPasswordViewModel.email = this.email;

    this._accountService.ResetPassword(this.resetPasswordViewModel).subscribe((response: any) => {
      if (response.ok) {
        localStorage.removeItem('jwt');
        this._router.navigate(['authorizationPage']);
      }
    }, error => {
      this.DisplayError('Sorry for some reason operation didn\'t proceed as expected, please try later.');
    });
  }

  private PasswordIsCorrect(): boolean {
    if (this.resetPasswordViewModel.password.length < 8) {
      return false;
    }

    let hasDigit = new RegExp('[0-9]');
    let hasLowerCaseLetter = new RegExp('[a-z]');
    let hasUpperCaseLetter = new RegExp('[A-Z]');
    let hasSpecialLetter = new RegExp('[^a-zA-Z0-9]');

    if (
      !hasDigit.test(this.resetPasswordViewModel.password)
      || !hasLowerCaseLetter.test(this.resetPasswordViewModel.password)
      || !hasUpperCaseLetter.test(this.resetPasswordViewModel.password)
      || !hasSpecialLetter.test(this.resetPasswordViewModel.password)
    ) {
      return false;
    }

    return true;
  }

}
