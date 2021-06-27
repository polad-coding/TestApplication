import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgForm, NgModel, Validators } from '@angular/forms';
import { AccountService } from '../../app-services/account.service';
import { UserViewModel } from '../../view-models/user-view-model';
import { element } from 'protractor';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { LanguageViewModel } from '../../view-models/language-view-model';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css'],
  providers: [AccountService]
})
export class PersonalAccountComponent implements OnInit, AfterViewInit {

  public user: UserViewModel;
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  public regions: Array<RegionViewModel>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public errorMessage: string = '';
  public selectedTab: string = 'my-account-section';
  public formHasError: boolean = false;
  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;

  constructor(private _router: Router, private accountService: AccountService, private renderer2: Renderer2, private renderer: Renderer) {
    if (_router.getCurrentNavigation().extras.state != null) {
      this.user = _router.getCurrentNavigation().extras.state.user;
    }
  }
    ngAfterViewInit(): void {
      this.AdjustZIndexes();

    }

  ngOnInit() {
    if (this.user == null || this.user == undefined) {
      this.accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
        let currentTab = localStorage.getItem('currentTabName');
        if (currentTab == null) {
          this.selectedTab = 'my-account-section';
        }
        else {
          this.selectedTab = currentTab;
        }
      });
    }
  }

  public SelectTab(event: any) {

    this.accountSectionTabs.forEach((el) => {
      this.renderer2.removeClass(el.nativeElement, 'section-selected');
      this.renderer2.addClass(el.nativeElement, 'section-not-selected');
    });
    if (event.target.localName === 'p') {
      this.selectedTab = event.target.parentElement.id;
      localStorage.setItem('currentTabName', this.selectedTab);
      this.renderer2.removeClass(event.target.parentElement, 'section-not-selected');
      this.renderer2.addClass(event.target.parentElement, 'section-selected');
    }
    else {
      this.selectedTab = event.target.id;
      localStorage.setItem('currentTabName', this.selectedTab);
      this.renderer2.removeClass(event.target, 'section-not-selected');
      this.renderer2.addClass(event.target, 'section-selected');
    }

    this.AdjustZIndexes();

  }


  private AdjustZIndexes() {
    //adjust z-indexes
    this.accountSectionTabs.forEach((el, index) => {
      if (el.nativeElement.className === 'personal-account-section section-selected') {
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

  public DisplayRegionsModal(event: MouseEvent) {
    event.stopPropagation();
    //TODO - deselect all regions
    if (this.regions === undefined) {
      this.accountService.GetAllRegions().subscribe((response: any) => {
        this.regions = response.body;
      });
    }

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'flex');

  }

  public EditInputField(fieldName: string, event: MouseEvent) {
    event.stopPropagation();
    this.OnDocumentClicked(null);
    let elements = this.inputFields.filter(el => el.nativeElement.name === fieldName);
    elements.forEach(element => {
      this.renderer2.removeAttribute(element.nativeElement, 'disabled');
      this.renderer2.setStyle(element.nativeElement, 'border', '1px solid #9AC7EC');
      this.renderer.invokeElementMethod(element.nativeElement, 'focus');
    });
  }

  public ChangeProfileData(event: MouseEvent, personalInformationForm: NgForm) {
    this.errorMessage = '';
    personalInformationForm.control.enable();
    if (personalInformationForm.errors === null) {
      this.formHasError = false;
      //TODO - check if email and Myer code are correct
      if (personalInformationForm.controls['email'].pristine) {
        this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
          window.location.reload();
        });
      }
      else {
        this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
          if (response.body === true) {
            this.formHasError = true;
            this.errorMessage = this.errorMessage.concat('This email address already exists in our database.');
          }
          else {
            this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
              window.location.reload();
            });
          }
        });
      }

      //TODO - perform the changes if so
      console.log(this.user);
    }
    else {
      this.formHasError = true;
      console.log(personalInformationForm);
      if (personalInformationForm.controls['email'].errors.required) {
        this.errorMessage = this.errorMessage.concat('Email address is a compulsory field! ');
      }
      else if (personalInformationForm.controls['email'].errors.pattern) {
        this.errorMessage = this.errorMessage.concat('Incorrect email address! ');
      }

      if (true) {

      }
    }
    
  }

  public SetGender(event: MouseEvent, gender: string) {
    let newGender = new GenderViewModel();
    newGender.genderName = gender;
    this.user.gender = newGender;
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.inputFields.forEach(el => {
      this.renderer2.setAttribute(el.nativeElement, 'disabled', 'disabled');
      this.renderer2.setStyle(el.nativeElement, 'border', 'none');
    });

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleRegionSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this.renderer2.removeClass(element, 'is-not-selected');
      this.renderer2.addClass(element, 'is-selected');
      this.newRegionsSelected.push(JSON.parse(event.target.value));
    }
    else {
      this.renderer2.removeClass(element, 'is-selected');
      this.renderer2.addClass(element, 'is-not-selected');
      this.newRegionsSelected = this.newRegionsSelected.filter(el => !(el.regionName === JSON.parse(event.target.value).regionName));
    }
  }

  public SubmitRegionsForm(regionsForm: NgForm) {
    //populate the regions array with these elements
    this.user.regions = this.newRegionsSelected;
    //reset form and close it
    regionsForm.resetForm();
    this.newRegionsSelected = new Array<RegionViewModel>();
    this.OnDocumentClicked(null);
  }

}
