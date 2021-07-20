////import { toBase64String } from '@angular/compiler/src/output/source_map';
import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { element } from 'protractor';
import { AccountService } from '../../app-services/account.service';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { LanguageViewModel } from '../../view-models/language-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';
//import Tobasng } from '@angular/compiler/src/util';


@Component({
  selector: 'app-practitioner-account',
  templateUrl: './practitioner-account.component.html',
  styleUrls: ['./practitioner-account.component.css'],
  providers: [AccountService]
})
export class PractitionerAccountComponent   {

  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;
  public selectedTab: string = 'my-account-section';
  public user: UserViewModel;
  public formHasError: boolean = false;
  public errorMessage: string = '';

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }

  constructor(private renderer2: Renderer2, private _router: Router, private accountService: AccountService, private _jwtHelper: JwtHelperService) {

  }

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

    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'User') {
      this._router.navigate(['personalAccount']);
    }

    if (this.user == null || this.user == undefined) {
      this.accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
        console.log(this.user);
        localStorage.setItem('currentTabName', 'prosAccess');
      });
    }

    this.selectedTab = localStorage.getItem('practitionerAccountTabName');
  }

  public SelectTab(event: any) {

    this.accountSectionTabs.forEach((el) => {
      this.renderer2.removeClass(el.nativeElement, 'section-selected');
      this.renderer2.addClass(el.nativeElement, 'section-not-selected');
    });
    if (event.target.localName === 'p') {
      this.selectedTab = event.target.parentElement.id;
      this.renderer2.removeClass(event.target.parentElement, 'section-not-selected');
      this.renderer2.addClass(event.target.parentElement, 'section-selected');
    }
    else {
      this.selectedTab = event.target.id;
      this.renderer2.removeClass(event.target, 'section-not-selected');
      this.renderer2.addClass(event.target, 'section-selected');
    }

    this.AdjustZIndexes();

  }

  private AdjustZIndexes() {
    //adjust z-indexes
    this.accountSectionTabs.forEach((el, index) => {
      if (el.nativeElement.className === 'practitioner-account-section section-selected') {
        this.currentSelectedTabIndex = index;
      }
    });

    for (var i = this.currentSelectedTabIndex; i >= 0; i--) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${i}`);
      }
      else {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
      }
    }

    for (var i = this.currentSelectedTabIndex; i < this.accountSectionTabs.length; i++) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${this.accountSectionTabs.length - i}`);
      }
      else {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
      }
    }
  }

}
