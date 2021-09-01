import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css']
})
export class PersonalAccountComponent implements OnInit, AfterViewInit {

  public errorMessage: string = '';
  public formHasError: boolean = false;

  public selectedTab: string = 'my-account-section';
  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;

  public userHasUnsignedSurveys: boolean = false;

  constructor(private _renderer2: Renderer2, private _jwtHelper: JwtHelperService, private _router: Router) { }

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }

  ngOnInit() {
    this.AssureThatJwtTokenIsValid();

    localStorage.removeItem('currentNavigationBarTabName');
    localStorage.removeItem('userAgreedOnTheClause');
    this.selectedTab = this.GetCurrentTab();
  }

  private AssureThatJwtTokenIsValid(): void {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'Practitioner') {
      this._router.navigate(['practitionerAccount']);
    }
  }

  private GetCurrentTab(): string {
    let currentTab = localStorage.getItem('personalAccountTabName');

    if (currentTab == null) {
      localStorage.setItem('personalAccountTabName', 'my-account-section');
      currentTab = localStorage.getItem('personalAccountTabName');
    }

    return currentTab;
  }

  public DisplayError(errorMessage: string) {
    setTimeout(() => {
      document.getElementById('error-message-container').style.display = 'flex';
      document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
      this.errorMessage = errorMessage;
      this.formHasError = true;
    }, 100);
  }

  public SelectTab(event: any) {
    this.accountSectionTabs.forEach((el) => {
      this._renderer2.removeClass(el.nativeElement, 'section-selected');
      this._renderer2.addClass(el.nativeElement, 'section-not-selected');
    });

    this.selectedTab = event.target.id;
    console.log('here 6');

    localStorage.setItem('personalAccountTabName', this.selectedTab);
    this._renderer2.removeClass(event.target, 'section-not-selected');
    this._renderer2.addClass(event.target, 'section-selected');

    this.AdjustZIndexes();
  }

  /**
   *Adjusts the Z indexes of the tabs, so the shadow of the higher hierarchy tabs falls on the lower hierarchy tabs.
   * */
  private AdjustZIndexes() {
    this.accountSectionTabs.forEach((el, index) => {
      if (el.nativeElement.className === 'personal-account-section section-selected') {
        this.currentSelectedTabIndex = index;
      }
    });

    for (var i = this.currentSelectedTabIndex; i >= 0; i--) {
      if (this.currentSelectedTabIndex != i) {
        this._renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${i}`);
      }
      else {
        this._renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
      }
    }

    for (var i = this.currentSelectedTabIndex; i < this.accountSectionTabs.length; i++) {
      if (this.currentSelectedTabIndex != i) {
        this._renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${this.accountSectionTabs.length - i}`);
      }
      else {
        this._renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
      }
    }
  }


  /**
   * When document is clicked disables all the fields, hides all the modals and error messages.
   * @param event
   */
  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.formHasError = false;
    document.getElementById('error-message-container').style.display = 'none';
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public IdentifyIfUserHasUnsignedSurvey(hasUnsignedSurvey) {
    this.userHasUnsignedSurveys = hasUnsignedSurvey;
  }
}
