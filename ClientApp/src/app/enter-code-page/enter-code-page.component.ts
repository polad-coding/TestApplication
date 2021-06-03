import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { error } from 'protractor';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';


@Component({
  selector: 'app-enter-code-page',
  templateUrl: './enter-code-page.component.html',
  styleUrls: ['./enter-code-page.component.css'],
  providers: [DataService, AccountService]
})
export class EnterCodePageComponent implements OnInit {

  public userAgreedWithTheClause: boolean = false;
  public errorMessage: string;
  public codeEntered: string;

  constructor(private _dataService: DataService, private _router: Router, private _accountService: AccountService) { }

  ngOnInit() {
  }

  public ProceedToTheNextStage(event: MouseEvent) {
    if (this.codeEntered != null && this.codeEntered != '') {
      this._dataService.CheckIfCodeIsValid(this.codeEntered).subscribe(response => {
        if (response.body == true) {
          //Proceed next
          this.errorMessage = null;
          localStorage.setItem('surveyCode', this.codeEntered);
          this._accountService.GetCurrentUser().subscribe(response => {
            if (response.ok) {
              this._router.navigate(['enterSurveyAccount']);
            }
          },
            error => {
              this._router.navigate(['signin']);
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
