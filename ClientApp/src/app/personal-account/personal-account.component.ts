import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { PersonalAccountComponentHelperMethods } from '../helper-methods/personal-account-component-helper-methods';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css'],
  providers: [PersonalAccountComponentHelperMethods]
})
export class PersonalAccountComponent implements OnInit, AfterViewInit {

  public errorMessage: string = '';
  public formHasError: boolean = false;
  public formIsPristine: true;

  public selectedTab: string = 'my-account-section';
  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;

  public userHasUnsignedSurveys: boolean = false;

  constructor(private _renderer2: Renderer2, private _helperMethods: PersonalAccountComponentHelperMethods) { }

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }

  ngOnInit() {
    this._helperMethods.DecideIfJwtTokenIsValid();

    localStorage.removeItem('currentNavigationBarTabName');
    localStorage.removeItem('userAgreedOnTheClause');
    this.selectedTab = this._helperMethods.GetCurrentTab();
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

  public SetIfUserHasUnsignedSurvey(hasUnsignedSurvey) {
    this.userHasUnsignedSurveys = hasUnsignedSurvey;
  }
}
