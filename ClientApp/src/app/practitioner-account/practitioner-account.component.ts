////import { toBase64String } from '@angular/compiler/src/output/source_map';
import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
  public user: UserViewModel = new UserViewModel();

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }

  constructor(private renderer2: Renderer2, private accountService: AccountService) {

}

  ngOnInit() {
    this.user.age = 45;
    this.user.bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel nisi consequat, malesuada nisl non, laoreet risus. Fusce vestibulum molestie purus, a accumsan urna pellentesque sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec vitae placerat ipsum. In nec tincidunt elit, quis bibendum ligula. Phasellus consequat ac ligula eu accumsan. Nam eget purus et nisi ultrices sagittis. Donec sed fringilla nulla, sed blandit nibh. Quisque nec lacinia odio, vitae varius nulla. Nam ultrices sodales nulla, nec aliquam nisl convallis a. Curabitur eu sapien sit amet velit interdum tristique. ';
    this.user.education = 'PhD';
    this.user.email = 'andy@gmail.com';
    this.user.firstName = 'Andy';
    this.user.lastName = 'Willson';
    let g: GenderViewModel = new GenderViewModel();
    g.genderName = 'Male'
    this.user.gender = g;
    let l: Array<LanguageViewModel> = new Array<LanguageViewModel>();
    let l1 = new LanguageViewModel();
    l1.languageName = 'English';
    let l2 = new LanguageViewModel();
    l2.languageName = 'Russian';
    let l3 = new LanguageViewModel();
    l3.languageName = 'French';
    l.push(l1);
    l.push(l2);
    l.push(l3);
    console.log(l);
    this.user.languages = l;
    this.user.myerBriggsCode = 'AJK1';
    this.user.phoneNumber = '+30 698 823 90';
    this.user.position = 'Professor in the University';
    this.user.professionalEmail = 'andyprfessional@gmail.com';
    this.user.profileImageName = 'andy@gmail.com-user-profile-image';
    this.user.sectorOfActivity = 'IT';
    this.user.website = 'liveofaperson.com';
    let r: Array<RegionViewModel> = new Array<RegionViewModel>();
    let r1 = new RegionViewModel();
    r1.regionName = 'England';
    let r2 = new RegionViewModel();
    r2.regionName = 'Russia';
    let r3 = new RegionViewModel();
    r3.regionName = 'France';
    r.push(r1);
    r.push(r2);
    r.push(r3);
    console.log(r);

    this.user.regions = r;
    //if (this.user == null || this.user == undefined) {
    //  this.accountService.GetCurrentUser().subscribe((response: any) => {
    //    this.user = response.body;
    //    console.log(this.user);
    //  });
    //}
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
