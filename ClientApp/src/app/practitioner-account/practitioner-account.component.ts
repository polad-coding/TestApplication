import { Component, ElementRef, HostListener, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../../app-services/account.service';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-account',
  templateUrl: './practitioner-account.component.html',
  styleUrls: ['./practitioner-account.component.css'],
  providers: [AccountService]
})
export class PractitionerAccountComponent {

  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;
  public selectedTab: string = 'my-account-section';
  public user: UserViewModel;
  public errorMessage: string = '';

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }

  constructor(private renderer2: Renderer2, private _router: Router, private accountService: AccountService, private _jwtHelper: JwtHelperService) { }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    document.getElementById('error-message-container').style.display = 'none';
  }

  public OnError(eventBody) {
    this.errorMessage = eventBody;
    document.getElementById('error-message-container').style.display = 'flex';
    document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    localStorage.removeItem('surveyId');
    localStorage.setItem('currentNavigationBarTabName', 'prosAccess');
    this.selectedTab = localStorage.getItem('practitionerAccountTabName');

    this.AssureThatJwtTokenIsValid();

    this.AssureThatUserIsPractitioner();

    this.accountService.GetCurrentUser().subscribe((response: any) => {
      this.user = response.body;
    });
  }

  private AssureThatJwtTokenIsValid() {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }
  }

  private AssureThatUserIsPractitioner() {
    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
      this._router.navigate(['personalAccount']);
    }
  }

  public SelectTab(event: any) {

    this.accountSectionTabs.forEach((el) => {
      this.renderer2.removeClass(el.nativeElement, 'section-selected');
      this.renderer2.addClass(el.nativeElement, 'section-not-selected');
    });

    this.selectedTab = event.target.id;
    this.renderer2.removeClass(event.target, 'section-not-selected');
    this.renderer2.addClass(event.target, 'section-selected');

    this.AdjustZIndexes();
  }

  /**
  *Adjusts the Z indexes of the tabs, so the shadow of the higher hierarchy tabs falls on the lower hierarchy tabs.
  * */
  private AdjustZIndexes() {
    this.accountSectionTabs.forEach((el, index) => {
      if (el.nativeElement.className === 'practitioner-account-section section-selected') {
        this.currentSelectedTabIndex = index;
      }
    });

    for (var i = this.currentSelectedTabIndex; i >= 0; i--) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${i}`);
        continue;
      }

      this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
    }

    for (var i = this.currentSelectedTabIndex; i < this.accountSectionTabs.length; i++) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${this.accountSectionTabs.length - i}`);
        continue;
      }

      this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
    }
  }

}
