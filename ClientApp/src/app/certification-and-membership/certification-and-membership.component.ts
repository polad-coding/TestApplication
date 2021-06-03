import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { AccountService } from '../../app-services/account.service';
import { AuthenticationService } from '../../app-services/authentication-service';
import { DataService } from '../../app-services/data-service';
import { ApplicationUserCertificationViewModel } from '../../view-models/application-user-certification-view-model';
import { CertificationViewModel } from '../../view-models/certification-view-model';
import { MembershipViewModel } from '../../view-models/membership-view-model';
import { UserViewModel } from '../../view-models/user-view-model';
import { render, paypal } from 'creditcardpayments/creditCardPayments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certification-and-membership',
  templateUrl: './certification-and-membership.component.html',
  styleUrls: ['./certification-and-membership.component.css'],
  providers: [DataService, AccountService]
})
export class CertificationAndMembershipComponent implements OnInit, AfterViewInit {

  @Input()
  public user: UserViewModel;
  public certifications: Array<CertificationViewModel>;
  public practitionersCertifications: Array<ApplicationUserCertificationViewModel>;
  public membership: MembershipViewModel;
  public desktopVersion: boolean = true;
  public paypalModalIsVisible: boolean = false;

  constructor(private _dataService: DataService, private _accountService: AccountService, private _router: Router) { }

  ngAfterViewInit(): void {
    if (window.innerWidth <= 850) {
      this.desktopVersion = false;
    }
    else if (window.innerWidth > 850) {
      this.desktopVersion = true;
    }


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
    this._accountService.GetCurrentUser().subscribe((response: any) => {
      this.user = response.body;
      this._dataService.GetAllCertifications().subscribe((response: any) => {
        if (response.ok) {
          render({
            id: "#paypalContainer",
            currency: "USD",
            value: "50",
            onApprove: (details) => {
              this._dataService.RenewMembership().subscribe(response => {
                if (response.ok) {
                  console.log('here');
                  location.reload();
                }
              }, error => {
                alert('We had a problem processing your request, please try again!');
              })
            }
          })
          this.certifications = response.body;
          this._dataService.GetPractitionersCertifications(null).subscribe((practitionersCertificationResponse: any) => {
            console.log(practitionersCertificationResponse);
            this.practitionersCertifications = practitionersCertificationResponse.body;
            this._dataService.GetMembershipStatus().subscribe((membershipStatusResponse: any) => {
              this.membership = membershipStatusResponse.body;
            });
          });
        }
      });
    })
  }

}
