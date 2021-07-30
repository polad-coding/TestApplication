import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgForm, NgModel, Validators } from '@angular/forms';
import { AccountService } from '../../app-services/account.service';
import { UserViewModel } from '../../view-models/user-view-model';
import { element } from 'protractor';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { LanguageViewModel } from '../../view-models/language-view-model';
import { DataService } from '../../app-services/data-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { Element } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.css'],
  providers: [AccountService, DataService]
})
export class PersonalAccountComponent implements OnInit, AfterViewInit, OnChanges {

  public user: UserViewModel;
  private oldEmail: string;
  private oldName: string;
  private oldSurname: string; 
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  public regions: Array<RegionViewModel>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  @ViewChild('gendersModalContainer', { read: ElementRef, static: false })
  public genderModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public errorMessage: string = '';
  public selectedTab: string = 'my-account-section';
  public formHasError: boolean = false;
  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;
  public userHasUnsignedSurveys: boolean = false;
  public formIsPristine: true;
  public selectedGender: string;
  @ViewChild('personalInformationForm', { read: NgForm, static: false })
  public personalInformationForm: NgForm;

  constructor(private _router: Router, private _renderer2: Renderer2, private _jwtHelper: JwtHelperService, private accountService: AccountService, private _dataService: DataService, private renderer2: Renderer2, private renderer: Renderer) {
    if (_router.getCurrentNavigation().extras.state != null) {
      this.user = _router.getCurrentNavigation().extras.state.user;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngAfterViewInit(): void {
    this.AdjustZIndexes();

  }

  ngOnInit() {

    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }

    if (this._jwtHelper.decodeToken(localStorage.getItem('jwt'))['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] == 'Practitioner') {
      this._router.navigate(['practitionerAccount']);
    }

    this.accountService.GetAllRegions().subscribe((response: any) => {
      this.regions = response.body;
    });

    this._dataService.GetSelectedRegionsForCurrentUser().subscribe((response: any) => {
      this.newRegionsSelected = response.body;
    });

    localStorage.removeItem('currentTabName');
    if (this.user == null || this.user == undefined) {
      this.accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
        this.oldEmail = this.user.email;
        this.oldName = this.user.firstName;
        this.oldSurname = this.user.lastName;

        let currentTab = localStorage.getItem('personalAccountTabName');
        if (currentTab == null) {
          localStorage.setItem('personalAccountTabName', 'my-account-section');
          this.selectedTab = localStorage.getItem('personalAccountTabName');
        }
        else {
          this.selectedTab = currentTab;
        }


        this._dataService.UserHasUnsignedSurveys(this.user.id).subscribe((response: any) => {
          this.userHasUnsignedSurveys = response.body;

          if (!this.userHasUnsignedSurveys) {
            localStorage.removeItem('surveyId');
          }
        });

      });
    }
    else {
      this.oldEmail = this.user.email;
      this.oldName = this.user.firstName;
      this.oldSurname = this.user.lastName;

      if (localStorage.getItem('personalAccountTabName') == null) {
        localStorage.setItem('personalAccountTabName', 'my-account-section');
        this.selectedTab = localStorage.getItem('personalAccountTabName');
      }

      this._dataService.UserHasUnsignedSurveys(this.user.id).subscribe((response: any) => {
        this.userHasUnsignedSurveys = response.body;
        console.log(this.userHasUnsignedSurveys);
      });
    }

  }

  public AssociateUserDataToTheSurvey(personalInformationForm: NgForm) {
    this.ChangeProfileData(null, personalInformationForm);

    if (!this.formHasError) {
      this._dataService.AssociateUserDataToTheSurvey(this.user.id).subscribe((response: any) => {
        if (response.ok) {
          this._router.navigate(['wrap-up']);
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
      localStorage.setItem('personalAccountTabName', this.selectedTab);
      this.renderer2.removeClass(event.target.parentElement, 'section-not-selected');
      this.renderer2.addClass(event.target.parentElement, 'section-selected');
    }
    else {
      this.selectedTab = event.target.id;
      localStorage.setItem('personalAccountTabName', this.selectedTab);
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
    console.log(this.newRegionsSelected);

    let regionContainers = document.getElementsByClassName('region-checkbox-container');

    for (var i = 0; i < regionContainers.length; i++) {
      this._renderer2.removeClass(regionContainers[i].lastChild, 'is-selected');
      this._renderer2.addClass(regionContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newRegionsSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${this.newRegionsSelected[i].regionName}-country-container`), 'is-selected');
    }

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'flex');
    this.regionModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
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

    if (!this.CheckIfNameAndSurnameFieldsAreFilledCorrectly(personalInformationForm)) {
      console.info(this.formHasError);
      setTimeout(() => {
        document.getElementById('error-message-container').style.display = 'flex';
        document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
        this.formHasError = true;
      }, 100);
      return;
    }

    if (!this.CheckIfEmailStringIsCorrect(personalInformationForm)) {
      setTimeout(() => {
        document.getElementById('error-message-container').style.display = 'flex';
        document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
        this.formHasError = true;

      }, 100);
      return;
    }

    if (personalInformationForm.controls['email'].pristine) {
      this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        if (!this.userHasUnsignedSurveys) {
          location.reload();

          return;
        }
      });
    }
    else {
      this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
        if (response.body === true) {
          document.getElementById('error-message-container').style.display = 'flex';
          this.errorMessage = this.errorMessage.concat('This email address already exists in our database.');
          this.formHasError = true;

          this.user.email = this.oldEmail;
          personalInformationForm.controls['email'].markAsPristine();
          setTimeout(() => {
            document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        else {
          if (this.user.professionalEmail != personalInformationForm.value.email) {
            this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
              if (!this.userHasUnsignedSurveys) {
                location.reload();

                return;
              }
            });
          }
          else {
            document.getElementById('error-message-container').style.display = 'flex';
            this.formHasError = true;

            this.errorMessage = this.errorMessage.concat('This email address is already registered as your professional email.');
            this.user.email = this.oldEmail;
            personalInformationForm.controls['email'].markAsPristine();
            setTimeout(() => {
              document.getElementById('error-message-container').scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      });
    }
  }

  public CheckIfEmailStringIsCorrect(personalInformationForm: NgForm): boolean {
    let email: string = personalInformationForm.controls['email'].value;
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (email.length > 0) {
      if (stringIsEmail.test(email)) {
        return true;
      }
    }
    this.formHasError = true;

    this.errorMessage = 'Your email addess is incorrect. Reminder: email address must be valid email.';
    this.user.email = this.oldEmail;
    personalInformationForm.controls['email'].markAsPristine();

    return false;
  }

  public CheckIfNameAndSurnameFieldsAreFilledCorrectly(personalInformationForm: NgForm): boolean {
    let firstName: string = personalInformationForm.controls['firstName'].value;
    let lastName: string = personalInformationForm.controls['lastName'].value;
    let checkIfNumberExist = new RegExp('[0-9]');

    if (firstName.length > 1 && lastName.length > 1) {
      if (!checkIfNumberExist.test(firstName) && !checkIfNumberExist.test(lastName)) {
        return true;
      }
    }
    this.formHasError = true;

    this.errorMessage = 'Name or Surname fields were not filled correctly. Reminder: these fields must contain at least 2 characters and must not contain any numbers.';
    this.user.firstName = this.oldName;
    this.user.lastName = this.oldSurname;
    personalInformationForm.controls['firstName'].markAsPristine();
    personalInformationForm.controls['lastName'].markAsPristine();

    return false;
  }

  public DisplayGenderModal(event: any) {
    event.stopPropagation();
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'flex');
    this.selectedGender = this.user.gender.genderName;

    let genderContainer = this.genderModal.nativeElement.firstChild.children[1];

    let nextSibling = this.genderModal.nativeElement.firstChild.children[1].firstChild;

    while (nextSibling) {
      console.log(nextSibling);
      this._renderer2.removeClass(nextSibling, 'gender-option-selected');
      nextSibling = nextSibling.nextElementSibling;
    }


    for (var i = 0; i < genderContainer.children.length; i++) {
      console.log(genderContainer.children[i].innerText.toString());
      if (genderContainer.children[i].innerText.toString() == this.user.gender.genderName) {
        this._renderer2.addClass(genderContainer.children[i], 'gender-option-selected');
        break;
      }
      
    }

    this.genderModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
  }

  public SelectGender(event: any, gender: string) {
    this.selectedGender = gender;

    let nextSibling = event.target.nextElementSibling;

    while (nextSibling) {
      this._renderer2.removeClass(nextSibling, 'gender-option-selected');
      nextSibling = nextSibling.nextElementSibling;
    }

    let previousSibling = event.target.previousElementSibling;

    while (previousSibling) {
      this._renderer2.removeClass(previousSibling, 'gender-option-selected');
      previousSibling = previousSibling.previousElementSibling;
    }


    this._renderer2.addClass(event.target, 'gender-option-selected');
  }

  public SetGender(personalInformationForm: NgForm) {
    console.log(this.personalInformationForm);
    let newGender = new GenderViewModel();
    this.personalInformationForm.form.markAsDirty();
    newGender.genderName = this.selectedGender;
    this.user.gender = newGender;
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.inputFields.forEach(el => {
      this.renderer2.setAttribute(el.nativeElement, 'disabled', 'disabled');
      this.renderer2.setStyle(el.nativeElement, 'border', 'none');
    });
    this.formHasError = false;

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
    this.renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
    document.getElementById('error-message-container').style.display = 'none';
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleRegionSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this.renderer2.removeClass(element, 'is-not-selected');
      this.renderer2.addClass(element, 'is-selected');
    }
    else {
      this.renderer2.removeClass(element, 'is-selected');
      this.renderer2.addClass(element, 'is-not-selected');
    }
  }

  public SubmitRegionsForm(regionsForm: NgForm) {
    this.newRegionsSelected = new Array<RegionViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newRegionsSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }



    this.user.regions = this.newRegionsSelected;
    //reset form and close it
    this.personalInformationForm.form.markAsDirty();
    regionsForm.resetForm();
    this.OnDocumentClicked(null);
  }

}
