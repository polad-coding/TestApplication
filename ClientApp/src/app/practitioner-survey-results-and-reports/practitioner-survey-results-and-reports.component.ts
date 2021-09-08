import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { EmailSenderService } from '../../app-services/email-sender-service';
import { OrderService } from '../../app-services/order-service';
import { SurveyService } from '../../app-services/survey-service';
import { CodeTransferEmailViewModel } from '../../view-models/code-transfer-email-view-model';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-survey-results-and-reports',
  templateUrl: './practitioner-survey-results-and-reports.component.html',
  styleUrls: ['./practitioner-survey-results-and-reports.component.css'],
  providers: [DataService, AccountService, SurveyService, OrderService, EmailSenderService]
})
export class PractitionerSurveyResultsAndReportsComponent implements OnInit {

  @Input()
  public user: UserViewModel;
  public surveys: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;
  public codeTransferModalIsVisible: boolean = false;
  public receiversEmailIsIncorrect: boolean = true;
  public currentSurveyResult: SurveyResultViewModel;
  public messageSubject: string = 'Code transfer';
  public messageBody: string = '';
  public receiversEmail: string = '';

  constructor(private _emailService: EmailSenderService, private _orderService: OrderService, private _dataService: DataService, private _renderer2: Renderer2, private _accountService: AccountService, private _router: Router, private _surveyService: SurveyService) { }

  ngOnInit() {
    localStorage.setItem('practitionerAccountTabName', 'survey-results-and-reports-section');

    this._surveyService.GetSurveysOfTheGivenUser(null).subscribe((response: any) => {
      this.surveys = response.body;
    });
  }

  public SwitchToGetCodesTab() {
    localStorage.setItem('practitionerAccountTabName', 'get-codes-and-support-section');
    window.location.reload();
  }

  public GenerateIndividualReport(surveyId: string) {
    localStorage.setItem('surveyId', surveyId);

    this._router.navigate(['personalReport']);
  }

  public GeneratePractitionerReport(surveyId: string) {
    localStorage.setItem('surveyId', surveyId);

    this._router.navigate(['practitionerReport']);
  }

  public DisplayCodeTransferModal(event: MouseEvent, surveyResult: SurveyResultViewModel) {
    event.stopPropagation();
    this.codeTransferModalIsVisible = true;
    this.currentSurveyResult = surveyResult;
    setTimeout(() => {
      document.getElementById('code-transfer-modal').scrollIntoView({ behavior: 'smooth', block: 'center' });
    },200)
  }

  private DisplayReceiversEmailError(element, errorMessage: string) {
    this._renderer2.setStyle(element, 'border', '0.5px solid red');
    this._renderer2.setStyle(element.nextSibling, 'visibility', 'visible');
    element.nextSibling.innerText = errorMessage;
    this.receiversEmailIsIncorrect = true;
  }

  public RemoveErrorAppearence(event) {
    this._renderer2.setStyle(event.target, 'border', '0.5px solid #006F91');
    this._renderer2.setStyle(event.target.nextSibling, 'visibility', 'hidden');
    event.target.nextSibling.innerText = 'Empty';
    this.receiversEmailIsIncorrect = false;
  }

  public EmailCodeTransferLink(event) {
    let codeTransferEmailViewModel: CodeTransferEmailViewModel = new CodeTransferEmailViewModel(this.receiversEmail, this.messageSubject, this.messageBody, this.currentSurveyResult.code)

    this._orderService.TransferTheCodeUsingEmailString(this.receiversEmail, this.currentSurveyResult.code).pipe(switchMap((transferTheCodeUsingEmailStringResponse) => {
      if (transferTheCodeUsingEmailStringResponse.ok) {
        return this._emailService.EmailUserAboutNewCodeTransfered(codeTransferEmailViewModel);
      }

      return of(null);
    })).pipe(switchMap((firstBlockResponse: any) => {
      if (firstBlockResponse == null) {
        return of(null);
      }

      return this._surveyService.GetSurveysOfTheGivenUser(null);
    })).subscribe((secondBlockResponse: any) => {
      if (secondBlockResponse == null) {
        alert('Something went wrong, please try again later.')
        return;
      }

      this.surveys = secondBlockResponse.body;
      this.codeTransferModalIsVisible = false;
      this.messageBody= '';
      this.receiversEmail = '';
    });
  }

  public CheckIfReceiversEmailIsCorrect(event) {
    let receiversEmail: string = event.target.value;

    if (receiversEmail.length == 0) {
      this.DisplayReceiversEmailError(event.target, 'This field cannot be empty');
      return;
    }

    if (!this.StringIsEmail(receiversEmail)) {
      this.DisplayReceiversEmailError(event.target, 'The string must be valid email address');
      return;
    }

    this._accountService.CheckIfMailIsRegistered(receiversEmail).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body == true) {
        return of(true);
      }

      return this._accountService.CheckIfProfessionalMailIsRegistered(receiversEmail);
    })).pipe(switchMap((firstBlockResponse: any) => {
      if (firstBlockResponse == true || firstBlockResponse.body == true) {
        return this._accountService.CheckIfGivenPersonIsInUserRole(receiversEmail);
      }

      return of(null);
    })).subscribe((secondBlockResponse: any) => {
      if (secondBlockResponse == null) {
        this.DisplayReceiversEmailError(event.target, 'The entered email is not registered in our DB');
        return;
      }

      if (secondBlockResponse.body == false) {
        this.DisplayReceiversEmailError(event.target, 'The receiver cannot be the practitioner');
        return;
      }
    })
  }

  public StopEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  private StringIsEmail(str: string): boolean {
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (stringIsEmail.test(str)) {
      return true;
    }

    return false;
  }

  @HostListener('document:click', ['$event'])
  public DocumentClicked(event) {
    this.codeTransferModalIsVisible = false;
  }

}
