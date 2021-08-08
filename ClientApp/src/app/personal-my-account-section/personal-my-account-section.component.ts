import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { AgeGroupViewModel } from '../../view-models/age-group-view-model';
import { EducationViewModel } from '../../view-models/education-view-model';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { PositionViewModel } from '../../view-models/position-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { SectorOfActivityViewModel } from '../../view-models/sector-of-activity-view-model';
import { UserViewModel } from '../../view-models/user-view-model';
import { PersonalAccountComponentHelperMethods } from '../helper-methods/personal-account-component-helper-methods';

@Component({
  selector: 'app-personal-my-account-section',
  templateUrl: './personal-my-account-section.component.html',
  styleUrls: ['./personal-my-account-section.component.css'],
  providers: [AccountService, DataService, PersonalAccountComponentHelperMethods]
})
export class PersonalMyAccountSectionComponent implements OnInit {

  public user: UserViewModel;

  //If the form submitted was incorrect these three properties will be used to return form fields to initial values.
  private oldEmail: string;
  private oldName: string;
  private oldSurname: string;

  //These field represent all the options that will be displayed when the respective modals are activated.
  public regions: Array<RegionViewModel>;
  public positions: Array<PositionViewModel>;
  public educations: Array<EducationViewModel>;
  public ageGroups: Array<AgeGroupViewModel>;
  public sectorsOfActivities: Array<SectorOfActivityViewModel>;

  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  @ViewChild('gendersModalContainer', { read: ElementRef, static: false })
  public genderModal: ElementRef;
  @ViewChild('ageGroupsModalContainer', { read: ElementRef, static: false })
  public ageGroupsModal: ElementRef;
  @ViewChild('positionModalContainer', { read: ElementRef, static: false })
  public positionModal: ElementRef;
  @ViewChild('educationModalContainer', { read: ElementRef, static: false })
  public educationModal: ElementRef;
  @ViewChild('sectorsOfActivitiesModalContainer', { read: ElementRef, static: false })
  public sectorsOfActivitiesModal: ElementRef;

  //Used to display which options are selected currently, when the modal is opened.
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public newPositionsSelected: Array<PositionViewModel> = new Array<PositionViewModel>();
  public newEducationsSelected: Array<EducationViewModel> = new Array<EducationViewModel>();
  public newSectorsOfActivitiesSelected: Array<SectorOfActivityViewModel> = new Array<SectorOfActivityViewModel>();
  public newAgeGroupSelected: AgeGroupViewModel = new AgeGroupViewModel(undefined, undefined);
  public selectedGender: string;

  public formIsPristine: true;
  public formHasError: boolean = false;

  @Output()
  public emitError: EventEmitter<string> = new EventEmitter<string>();

  public userHasUnsignedSurveys: boolean = false;

  @ViewChild('personalInformationForm', { read: NgForm, static: false })
  public personalInformationForm: NgForm;

  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;

  constructor(
    private _router: Router,
    private _jwtHelper: JwtHelperService,
    private accountService: AccountService,
    private _dataService: DataService,
    private _renderer2: Renderer2,
    private renderer: Renderer,
    private _helperMehtods: PersonalAccountComponentHelperMethods
  ) { }

  ngOnInit() {
    this._helperMehtods.DecideIfJwtTokenIsValid();

    forkJoin(
      this.accountService.GetAllAgeGroups(),
      this.accountService.GetAllRegions(),
      this.accountService.GetAllEducations(),
      this.accountService.GetAllPositions(),
      this.accountService.GetAllSectorsOfActivities()
    ).pipe(map((
      [
        getAllAgeGroupsResponse,
        getAllRegionsResponse,
        getAllEducationsResponse,
        getAllPositionsResponse,
        getAllSectorsOfActivitiesResponse
      ]: any) => {
      this.ageGroups = getAllAgeGroupsResponse.body;
      this.regions = getAllRegionsResponse.body;
      this.educations = getAllEducationsResponse.body;
      this.positions = getAllPositionsResponse.body;
      this.sectorsOfActivities = getAllSectorsOfActivitiesResponse.body;
    })).subscribe();

    this.accountService.GetCurrentUser().pipe(switchMap((getCurrentUserResponse: any) => {
      this.user = getCurrentUserResponse.body;
      this.oldEmail = this.user.email;
      this.oldName = this.user.firstName;
      this.oldSurname = this.user.lastName;
      this.newRegionsSelected = this.user.regions;
      this.newPositionsSelected = this.user.positions;
      this.newEducationsSelected = this.user.educations;
      this.newSectorsOfActivitiesSelected = this.user.sectorsOfActivities;

      return this._dataService.UserHasUnsignedSurveys(this.user.id);
    })).subscribe((userHasUnsignedSurveysResponse: any) => {
      this.userHasUnsignedSurveys = userHasUnsignedSurveysResponse.body;
      if (!this.userHasUnsignedSurveys) {
        localStorage.removeItem('surveyId');
      }

    })
  }

  /**
 *Associates user's anonymus data with the survey, at the step when the survey is compleated and account data confirmation is asked.
 * 
 * @param personalInformationForm
 */
  public AssociateUserDataToTheSurvey(personalInformationForm: NgForm) {
    if (!this._helperMehtods.ModalTypeFieldsAreNotEmpty(this.user.regions, this.user.educations, this.user.positions, this.user.sectorsOfActivities, this.user.ageGroup)) {
      this.emitError.emit('Some of the mandatory fields are left empty please, fill up all mandatory fields.')
      return;
    }

    this.ChangeProfileData(null, personalInformationForm);

    if (!this.formHasError) {
      this._dataService.AssociateUserDataToTheSurvey(this.user.id).subscribe((response: any) => {
        if (response.ok) {
          this._router.navigate(['wrap-up']);
        }
      });
    }
  }

  public DisplayFieldModal(event: MouseEvent, optionType: string, optionsSelected: Array<any>, modal: ElementRef<any>) {
    event.stopPropagation();

    let elements = document.getElementsByClassName('checkbox-container');

    for (var i = 0; i < elements.length; i++) {
      this._renderer2.removeClass(elements[i].lastChild, 'is-selected');
      this._renderer2.addClass(elements[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < optionsSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${optionType}-with-id-${optionsSelected[i].id}`), 'is-selected');
    }

    this._renderer2.setStyle(modal.nativeElement, 'display', 'flex');
    modal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
  }

  public EditInputField(fieldName: string, event: MouseEvent) {
    event.stopPropagation();
    this.OnDocumentClicked(null);

    let elements = this.inputFields.filter(el => el.nativeElement.name === fieldName);

    elements.forEach(element => {
      this._renderer2.removeAttribute(element.nativeElement, 'disabled');
      this._renderer2.setStyle(element.nativeElement, 'border', '1px solid #9AC7EC');
      this.renderer.invokeElementMethod(element.nativeElement, 'focus');
    });
  }

  /**
  *Checks the if the form is correct, submits it to the DB if that is the case.
  * @param event
  * @param personalInformationForm
  */
  public ChangeProfileData(event: MouseEvent, personalInformationForm: NgForm) {
    if (!this.CheckIfNameAndSurnameFieldsAreFilledCorrectly(personalInformationForm)) {
      this.emitError.emit('Name or Surname fields were not filled correctly.Reminder: these fields must contain at least 2 characters and must not contain any numbers.');
      return;
    }

    if (!this.CheckIfEmailStringIsCorrect(personalInformationForm)) {
      this.emitError.emit('Your email addess is incorrect. Reminder: email address must be valid email.');
      return;
    }

    if (personalInformationForm.controls['email'].pristine) {
      this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        if (!this.userHasUnsignedSurveys) {
          location.reload();
        }
      });

      return;
    }

    this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body === true) {
        this.emitError.emit('This email address already exists in our database.');

        this.user.email = this.oldEmail;

        personalInformationForm.controls['email'].markAsPristine();
        return;
      }
      return this.accountService.ChangeUserPersonalData(this.user);
    })).subscribe((changeUserPersonalDataResponse: any) => {
      if (!this.userHasUnsignedSurveys) {
        location.reload();
      }
    });
  }

  private CheckIfEmailStringIsCorrect(personalInformationForm: NgForm): boolean {
    let email: string = personalInformationForm.controls['email'].value;
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (email.length > 0) {
      if (stringIsEmail.test(email)) {
        return true;
      }
    }

    this.emitError.emit('Your email addess is incorrect. Reminder: email address must be valid email.')

    this.user.email = this.oldEmail;

    personalInformationForm.controls['email'].markAsPristine();

    return false;
  }

  private CheckIfNameAndSurnameFieldsAreFilledCorrectly(personalInformationForm: NgForm): boolean {
    let firstName: string = personalInformationForm.controls['firstName'].value;
    let lastName: string = personalInformationForm.controls['lastName'].value;
    let hasANumber = new RegExp('[0-9]');

    if (firstName.length > 1 && lastName.length > 1) {
      if (!hasANumber.test(firstName) && !hasANumber.test(lastName)) {
        return true;
      }
    }

    this.emitError.emit('Name or Surname fields were not filled correctly. Reminder: these fields must contain at least 2 characters and must not contain any numbers.')

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
      this._renderer2.removeClass(nextSibling, 'gender-option-selected');
      nextSibling = nextSibling.nextElementSibling;
    }

    for (var i = 0; i < genderContainer.children.length; i++) {
      if (genderContainer.children[i].innerText.toString() == this.user.gender.genderName) {
        this._renderer2.addClass(genderContainer.children[i], 'gender-option-selected');
        break;
      }
    }

    this.genderModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
  }

  public SelectAgeGroup(event, ageGroup: AgeGroupViewModel) {
    this.newAgeGroupSelected = ageGroup;

    let nextSibling = event.target.nextElementSibling;

    while (nextSibling) {
      this._renderer2.removeClass(nextSibling, 'age-group-option-selected');
      nextSibling = nextSibling.nextElementSibling;
    }

    let previousSibling = event.target.previousElementSibling;

    while (previousSibling) {
      this._renderer2.removeClass(previousSibling, 'age-group-option-selected');
      previousSibling = previousSibling.previousElementSibling;
    }


    this._renderer2.addClass(event.target, 'age-group-option-selected');
  }

  public DisplayAgeGroupModal(event: any) {
    event.stopPropagation();

    this._renderer2.setStyle(this.ageGroupsModal.nativeElement, 'display', 'flex');
    this.newAgeGroupSelected = this.user.ageGroup;

    let ageGroupContainer = this.ageGroupsModal.nativeElement.firstChild.children[1];

    let nextSibling = this.ageGroupsModal.nativeElement.firstChild.children[1].firstChild.nextSibling;

    while (nextSibling) {
      this._renderer2.removeClass(nextSibling, 'age-group-option-selected');
      nextSibling = nextSibling.nextElementSibling;
    }


    for (var i = 0; i < ageGroupContainer.children.length; i++) {
      if (ageGroupContainer.children[i].innerText.toString() == this.user.ageGroup.groupAgeRange) {
        this._renderer2.addClass(ageGroupContainer.children[i], 'age-group-option-selected');
        break;
      }
    }

    this.ageGroupsModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
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
    let newGender = new GenderViewModel();
    this.personalInformationForm.form.markAsDirty();
    newGender.genderName = this.selectedGender;
    this.user.gender = newGender;
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
  }

  public SetAgeGroup(personalInformationForm: NgForm) {
    let newAgeGroup = new AgeGroupViewModel(this.newAgeGroupSelected.id, this.newAgeGroupSelected.groupAgeRange);
    this.personalInformationForm.form.markAsDirty();
    this.user.ageGroup = newAgeGroup;
    this._renderer2.setStyle(this.ageGroupsModal.nativeElement, 'display', 'none');
  }

  /**
  * When document is clicked disables all the fields, hides all the modals and error messages.
  * @param event
  */
  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.inputFields.forEach(el => {
      this._renderer2.setAttribute(el.nativeElement, 'disabled', 'disabled');
      this._renderer2.setStyle(el.nativeElement, 'border', 'none');
    });

    this.formHasError = false;
    document.getElementById('error-message-container').style.display = 'none';

    this._renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.positionModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.educationModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.sectorsOfActivitiesModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.ageGroupsModal.nativeElement, 'display', 'none');
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this._renderer2.removeClass(element, 'is-not-selected');
      this._renderer2.addClass(element, 'is-selected');
    }
    else {
      this._renderer2.removeClass(element, 'is-selected');
      this._renderer2.addClass(element, 'is-not-selected');
    }
  }

  public SubmitMultipleChoiceForm(optionType: string, form: NgForm) {
    let newOptionsSelected = new Array<any>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      newOptionsSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }

    if (optionType == 'region') {
      this.newRegionsSelected = newOptionsSelected;
      this.user.regions = this.newRegionsSelected;
    }
    else if (optionType == 'position') {
      this.newPositionsSelected = newOptionsSelected;
      this.user.positions = this.newPositionsSelected;
    }
    else if (optionType == 'education') {
      this.newEducationsSelected = newOptionsSelected;
      this.user.educations = this.newEducationsSelected;
    }
    else if (optionType == 'sectorOfActivity') {
      this.newSectorsOfActivitiesSelected = newOptionsSelected;
      this.user.sectorsOfActivities = this.newSectorsOfActivitiesSelected;
    }

    this.personalInformationForm.form.markAsDirty();
    form.resetForm();
    this.OnDocumentClicked(null);
  }

}
