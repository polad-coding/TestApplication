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
  public isMobile: boolean = false;
  public actionsSideBarIsVisible: boolean = false;
  public languagesSideBarIsVisible: boolean = false;
  public userIsAuthorized: boolean = false;
  public languageSelected: string = 'english';
  public languageModalIsVisible: boolean = false;
  public userAuthorizationOperationsContainerIsVisible: boolean = false;
  public currentTabName: string;


  constructor(private _router: Router, private _accountService: AccountService, private _jwtHelper: JwtHelperService, private _renderer2: Renderer2) {

  }

  public DisplayLanguageModal(event: any) {
    event.stopPropagation();
    if (this.languageModalIsVisible == true) {
      this.languageModalIsVisible = false;
      this._renderer2.setStyle(event.target.nextElementSibling, 'transform', 'rotate(-90deg)');
    }
    else {
      this.languageModalIsVisible = true;
      this._renderer2.setStyle(event.target.nextElementSibling, 'transform', 'rotate(-270deg)');
    }
    console.debug(event.target.nextSibling);
  }

  public SelectLanguage(event: any) {
    let language = event.target.id.split('-')[0];
    this.languageSelected = language;
    this.languageModalIsVisible = false;
  }

  ngAfterViewInit(): void {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }

    let jwt = localStorage.getItem('jwt');
    if (jwt && !this._jwtHelper.isTokenExpired(jwt)) {
      this.userIsAuthorized = true;
      this._accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
      });
    }

    this.currentTabName = localStorage.getItem('currentTabName');

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
      this.userRole = 'user';
    }
    else {
      this.userRole = 'practitioner';
    }
  }


  public RedirectToPractitionersDirectory() {
    localStorage.setItem('personalAccountTabName', 'my-account-section');
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
  }

  public DocumentClicked() {
    this.actionsSideBarIsVisible = false;
    this.languagesSideBarIsVisible = false;
    if (this.languageModalIsVisible) {
      this._renderer2.setStyle(document.getElementById('arrow-image'), 'transform', 'rotate(-90deg)');
    }
    this.languageModalIsVisible = false;
    this.userAuthorizationOperationsContainerIsVisible = false;
  }

  public DisplayUserAuthorizationManipulationModal(event: any) {
    event.stopPropagation();
    this.userAuthorizationOperationsContainerIsVisible = true;
  }

  public DisplayActionsSideBar(event: MouseEvent)
  {
    event.stopPropagation();
    this.actionsSideBarIsVisible = true;
  }

  public DisplayLanguagesSideBar(event: MouseEvent) {
    event.stopPropagation();
    this.languagesSideBarIsVisible = true;
  }

  public LanguagesSideBarClick(event: MouseEvent) {
    event.stopPropagation();
  }

  public ActionsSideBarClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth < 768) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }



}
