import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { ApplicationUserCertificationViewModel } from '../../view-models/application-user-certification-view-model';
import { CertificationViewModel } from '../../view-models/certification-view-model';
import { MembershipViewModel } from '../../view-models/membership-view-model';
import { UserViewModel } from '../../view-models/user-view-model';
import { render, paypal } from 'creditcardpayments/creditCardPayments';
import { Router } from '@angular/router';
import { EmailSenderService } from '../../app-services/email-sender-service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-certification-and-membership',
  templateUrl: './certification-and-membership.component.html',
  styleUrls: ['./certification-and-membership.component.css'],
  providers: [DataService, AccountService, EmailSenderService]
})
export class CertificationAndMembershipComponent implements OnInit, AfterViewInit {

  @Input()
  public user: UserViewModel;

  public certifications: Array<CertificationViewModel>;
  public practitionersCertifications: Array<ApplicationUserCertificationViewModel>;
  public membership: MembershipViewModel;

  public desktopVersion: boolean = true;

  public paypalModalIsVisible: boolean = false;

  constructor(private _dataService: DataService, private _accountService: AccountService, private _router: Router, private _emailSenderService: EmailSenderService) {
    //Here we are loading script because for some reason DinkToPdf library that we are using to generate PDFs is conflicting with paypal script, and throws the error when we try to generate PDF.
    this.LoadScript();
  }

  ngAfterViewInit(): void {
    if (window.innerWidth <= 850) {
      this.desktopVersion = false;
    }
    else if (window.innerWidth > 850) {
      this.desktopVersion = true;
    }
  }

  /**
  *Loads the script needed for paypal transactions.
  * */
  private LoadScript() {
    let script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AQf-UPTlE9mFmveSuPSTXNNlpYzbN5GcUbSaY4V_Xr0EpyYaOBCsgdJj2rwLLQ52a5gagRy3AHotD8aP';
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    script.id = 'paypal-script';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.paypalModalIsVisible = false;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth <= 850) {
      this.desktopVersion = false;
    }
    else if (window.innerWidth > 850) {
      this.desktopVersion = true;
    }
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ShowPayPalModal(event: MouseEvent) {
    this.PreventEventPropagation(event);
    this.paypalModalIsVisible = true;
  }

  ngOnInit() {
    localStorage.setItem('practitionerAccountTabName', 'certification-membership-section');

    this.onResize(null);

    this._dataService.GetAllCertifications().pipe(switchMap((getAllCertificationsResponse: any) => {
      if (!getAllCertificationsResponse.ok) {
        return of(null);
      }

      this.certifications = getAllCertificationsResponse.body;
      this.certifications = this.certifications.reverse();

      return this._dataService.GetPractitionersCertifications(null);
    })).pipe(switchMap((getPractitionersCertificationsResponse: any) => {
      if (getPractitionersCertificationsResponse == null) {
        return of(null);
      }

      this.practitionersCertifications = getPractitionersCertificationsResponse.body;
      this.practitionersCertifications = this.practitionersCertifications.reverse();

      return this._dataService.GetMembershipStatus();
    })).subscribe((getMembershipStatusResponse: any) => {
      if (getMembershipStatusResponse == null) {
        return
      }

      this.membership = getMembershipStatusResponse.body;
    });

    setTimeout(() => {
      this.RenderPaypal();
    }, 300);
  }

  /**
   *Renders paypal actions inside modal, on transaction approval, renews the membership.
   * */
  private RenderPaypal() {
    render({
      id: "#paypalContainer",
      currency: "USD",
      value: "50",
      onApprove: (details) => {
        this._dataService.RenewMembership().subscribe(response => {
          if (response.ok) {
            location.reload();
          }
        }, error => {
          alert('We had a problem processing your request, please try again!');
        })
      }
    })
  }
}
