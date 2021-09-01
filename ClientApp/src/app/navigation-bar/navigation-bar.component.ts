import { AfterViewInit, Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AccountService } from '../../app-services/account.service';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
  providers: [AccountService],
  host: {
    '(document:click)': 'DocumentClicked()',
  }
})
export class NavigationBarComponent implements OnInit, AfterViewInit {

  public user: UserViewModel;
  public userRole: string = 'user';
  public isMobileVersion: boolean = false;
  public actionsSideBarIsVisible: boolean = false;
  public languagesSideBarIsVisible: boolean = false;
  public userIsAuthorized: boolean = false;
  public languageSelected: string = 'english';
  public languageModalIsVisible: boolean = false;
  public userAccountManagementContainerIsVisible: boolean = false;
  public currentNavigationBarTabName: string;

  constructor(
    private _router: Router,
    private _accountService: AccountService,
    private _jwtHelper: JwtHelperService,
    private _renderer2: Renderer2
  ) { }

  /**
   * Displays languages modal. Used in desktop of the site.
   * @param event
   */
  public ToggleLanguageModalVisibility(event: any) {
    event.stopPropagation();

    if (this.languageModalIsVisible) {
      this.languageModalIsVisible = false;
      this._renderer2.setStyle(event.target.nextElementSibling, 'transform', 'rotate(-90deg)');
      return;
    }

    this.languageModalIsVisible = true;
    this._renderer2.setStyle(event.target.nextElementSibling, 'transform', 'rotate(-270deg)');
  }

  public SelectLanguage(event: any) {
    let language = event.target.id.split('-')[0];
    this.languageSelected = language;
    this.languageModalIsVisible = false;
  }

  ngAfterViewInit(): void {
    this.onResize(null);
  }

  ngOnInit() {
    this.onResize(null);

    let jwt = localStorage.getItem('jwt');
    this.currentNavigationBarTabName = localStorage.getItem('currentNavigationBarTabName');

    if (jwt && !this._jwtHelper.isTokenExpired(jwt)) {
      this.userIsAuthorized = true;

      this._accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
      });
    }

    this.IdentifyRoleOfTheUser();
  }

  private IdentifyRoleOfTheUser() {
    let decodedToken = this._jwtHelper.decodeToken(localStorage.getItem('jwt'));

    if (decodedToken != null && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
      this.userRole = 'user';
    }
    else if (decodedToken != null && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'Practitioner') {
      this.userRole = 'practitioner';
    }
    else {
      this.userRole = 'admin';
    }
  }

  public RedirectToBackOffice() {
    this._router.navigate(['backOffice']);
  }

  public RedirectToPractitionersDirectory() {
    localStorage.setItem('personalAccountTabName', 'my-account-section');
    localStorage.setItem('practitionerAccountTabName', 'my-account-section');
    this._router.navigate(['practitionersDirectory']);
  }

  public RedirectToSignInPage() {
    this._router.navigate(['authorizationPage']);
  }

  public RedirectToPersonalAccount() {
    localStorage.setItem('personalAccountTabName', 'my-account-section');
    this._router.navigate(['personalAccount']);
  }

  public RedirectToPractitionerAccount() {
    localStorage.setItem('practitionerAccountTabName', 'my-account-section');
    localStorage.setItem('currentNavigationBarTabName', 'prosAccess');
    this._router.navigate(['practitionerAccount']);
  }

  public RedirectToSurveyPage() {
    this._router.navigate(['survey']);
  }

  public RedirectToHomePage() {
    this._router.navigate(['']);
  }

  public LogOutUser() {
    localStorage.removeItem('jwt');
    this._router.navigate(['']);
    window.location.reload();
  }

  public DocumentClicked() {
    this.actionsSideBarIsVisible = false;
    this.languagesSideBarIsVisible = false;

    if (this.languageModalIsVisible) {
      this._renderer2.setStyle(document.getElementById('arrow-image'), 'transform', 'rotate(-90deg)');
    }

    this.languageModalIsVisible = false;
    this.userAccountManagementContainerIsVisible = false;
  }

  /**
   * Displays th modal that appears under the email of the user in navigation bar. Modal provides actions to manipulate the session and other actions related to the user.
   * @param event
   */
  public DisplayUserAccountManagementContainer(event: any) {
    event.stopPropagation();
    this.userAccountManagementContainerIsVisible = true;
  }

  /**
   * Displays actions sidebar in mobile version of the site.
   * @param event
   */
  public DisplayActionsSideBar(event: MouseEvent) {
    event.stopPropagation();
    this.actionsSideBarIsVisible = true;
  }

  /**
   * Displays languages sidebar in mobile version of the site.
   * @param event
   */
  public DisplayLanguagesSideBar(event: MouseEvent) {
    event.stopPropagation();
    this.languagesSideBarIsVisible = true;
  }

  public LanguagesSideBarClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  public ActionsSideBarClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth < 768) {
      this.isMobileVersion = true;
    }
    else {
      this.isMobileVersion = false;
    }
  }
}
