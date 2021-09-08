import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { EmailSenderService } from '../../app-services/email-sender-service';
import { SurveyService } from '../../app-services/survey-service';
import { EmailMessageToPractitionerViewModel } from '../../view-models/email-message-to-practitioner-view-model';
import { SurveyResultViewModel } from '../../view-models/survey-result-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-personal-survey-results-and-reports',
  templateUrl: './personal-survey-results-and-reports.component.html',
  styleUrls: ['./personal-survey-results-and-reports.component.css'],
  providers: [DataService, SurveyService, AccountService, EmailSenderService]
})
export class PersonalSurveyResultsAndReportsComponent implements OnInit {

  public user: UserViewModel;
  public surveys: Array<SurveyResultViewModel> = new Array<SurveyResultViewModel>();
  public surveyId: number;
  public currentPractitionerFullName: string;
  public currentPractitionerId: string;
  public messageSubject: string = 'Private message';
  public messageBody: string;
  public sendEmailModalFieldsAreCorrect: boolean = false;
  public sendEmailModalIsVisible: boolean = false;

  constructor(private _emailService: EmailSenderService, private _router: Router, private _dataService: DataService, private _accountService: AccountService, private _surveyService: SurveyService) { }

  ngOnInit() {
    this._accountService.GetCurrentUser().pipe(switchMap((getCurrentUserResponse: any) => {
      this.user = getCurrentUserResponse.body;

      return this._surveyService.GetSurveysOfTheGivenUser(this.user.id);
    })).subscribe((getSurveyResultsResponse: any) => {
      this.surveys = getSurveyResultsResponse.body;
    });
  }

  public SwitchToGetCodesTab() {
    localStorage.setItem('personalAccountTabName', 'get-codes-section');
    window.location.reload();
  }

  public RedirectToEnterCodePage() {
    this._router.navigate(['enterCode']);
  }

  public GenerateIndividualReport(surveyId: number) {
    localStorage.setItem('surveyId', surveyId.toString());
    this._router.navigate(['personalReport']);
  }

  public TransferToSynthesisPage(surveyId: number) {
    localStorage.setItem('surveyId', surveyId.toString());
    this._router.navigate(['wrap-up']);
  }

  public CheckIfSendEmailModalFieldsAreCorrect() {
    if (this.messageBody.length > 0 && this.messageSubject.length > 0) {
      this.sendEmailModalFieldsAreCorrect = true;
    }
    else {
      this.sendEmailModalFieldsAreCorrect = false;
    }
  }

  public OpenSendEmailModal(event: MouseEvent, surveyResult: SurveyResultViewModel) {
    event.stopPropagation();
    this.sendEmailModalIsVisible = true;
    this.currentPractitionerFullName = surveyResult.practitionerFullName;
    this.currentPractitionerId = surveyResult.practitionerId;
    this.messageSubject = 'Private message';
    this.messageBody = '';
    setTimeout(() => {
      document.getElementById('send-email-modal').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200)
  }

  @HostListener('document:click', ['$event'])
  public DocumentClicked(event) {
    this.sendEmailModalIsVisible = false;
  }

  public StopEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ResumeSurvey(surveyId: number) {
    if (surveyId === 0) {
      console.log('here 8');

      localStorage.setItem('surveyId', surveyId.toString());
      this._router.navigate(['surveyFirstStage']);

      return;
    }
    console.log('here 9');

    localStorage.setItem('surveyId', surveyId.toString());

    this._surveyService.DecideToWhichStageToTransfer(surveyId).subscribe((stageTransferResponse: any) => {
      this._router.navigate([stageTransferResponse.body]);
    });
  }

  public EmailMessageToPractitioner() {
    let emailMessageToPractitioner: EmailMessageToPractitionerViewModel = new EmailMessageToPractitionerViewModel(this.currentPractitionerId, this.messageSubject, this.messageBody);

    this._emailService.SendMessageToPractitioner(emailMessageToPractitioner).subscribe((response) => {
      if (response.ok) {
        this.sendEmailModalIsVisible = false;
        alert('Mail is sent successfuly!');
      }
    });
  }

}
