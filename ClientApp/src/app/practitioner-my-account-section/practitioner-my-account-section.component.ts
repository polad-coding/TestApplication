import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
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

@Component({
  selector: 'app-practitioner-my-account-section',
  templateUrl: './practitioner-my-account-section.component.html',
  styleUrls: ['./practitioner-my-account-section.component.css'],
  providers: [AccountService, DataService]
})
export class PractitionerMyAccountSectionComponent implements OnInit, AfterViewInit {

  @Input()
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

  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;

  @Input()
  public certificateLevel: string = '';
  public profileImageName;

  //Used to share a loading gif when user is uploading new image.
  public isImageUploadingProccess: boolean = false;

  @Output()
  public errorMessage: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('personalInformationForm', { read: NgForm, static: false })
  public personalInformationForm: NgForm;

  //Used to assign the dummy number to the image attribute, to avoid image caching by the browser.
  public dummyNumber: number;

  constructor(
    private _dataService: DataService,
    private _router: Router,
    private _renderer2: Renderer2,
    private _accountService: AccountService,
    private renderer: Renderer
  ) { }

  ngAfterViewInit(): void {
    this.oldEmail = this.user.email;
    this.oldName = this.user.firstName;
    this.oldSurname = this.user.lastName;
    this.newRegionsSelected = this.user.regions;
    this.newPositionsSelected = this.user.positions;
    this.newEducationsSelected = this.user.educations;
    this.newSectorsOfActivitiesSelected = this.user.sectorsOfActivities;

  }

  ngOnInit() {
    localStorage.setItem('practitionerAccountTabName', 'my-account-section');

    forkJoin(
      this._accountService.GetAllAgeGroups(),
      this._accountService.GetAllRegions(),
      this._accountService.GetAllEducations(),
      this._accountService.GetAllPositions(),
      this._accountService.GetAllSectorsOfActivities()
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

    this._accountService.GetCurrentUser().pipe(switchMap((getCurrentResponse: any) => {
      this.user = getCurrentResponse.body;

      return this._accountService.GetPractitionersCertifications(this.user.id);
    })).subscribe((getPractitionersCertificationsResponse: any) => {
      let certifications: any = getPractitionersCertificationsResponse.body;
      certifications = certifications.sort((a, b) => a.certification.level - b.certification.level);

      if (certifications.length > 0) {
        this.certificateLevel = 'Level ' + certifications[certifications.length - 1].certification.level;
        return;
      }

      this.certificateLevel = '';
    });

    this.dummyNumber = Math.floor(Math.random() * 100000);
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

  public SetAgeGroup(personalInformationForm: NgForm) {
    let newAgeGroup = new AgeGroupViewModel(this.newAgeGroupSelected.id, this.newAgeGroupSelected.groupAgeRange);
    this.personalInformationForm.form.markAsDirty();
    this.user.ageGroup = newAgeGroup;
    this._renderer2.setStyle(this.ageGroupsModal.nativeElement, 'display', 'none');
  }

  public DisplayGenderModal(event: any) {
    event.stopPropagation();
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'flex');

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
    let newGender = new GenderViewModel();
    console.log(personalInformationForm);
    personalInformationForm.form.markAsDirty();
    newGender.genderName = this.selectedGender;
    this.user.gender = newGender;
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
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

  public ChangeProfileData(event: MouseEvent, personalInformationForm: NgForm) {
    event.stopPropagation();
    if (!this.NameAndSurnameFieldsAreFilledCorrectly(personalInformationForm)) {
      return;
    }

    if (!this.EmailStringIsCorrect(personalInformationForm)) {
      return;
    }

    if (personalInformationForm.controls['email'].pristine) {
      this._accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        window.location.reload();
      });

      return;
    }

    this._accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body === true) {

        this.errorMessage.emit('This email address already exists in our database.');
        this.user.email = this.oldEmail;

        personalInformationForm.controls['email'].markAsPristine();
        return of(null);
      }

      return this._accountService.CheckIfProfessionalMailIsRegistered(personalInformationForm.value.email);
    })).pipe(switchMap((checkIfProfessionalMailIsRegisteredResponse: any) => {
      if (checkIfProfessionalMailIsRegisteredResponse == null) {
        return of(null);
      }

      if (checkIfProfessionalMailIsRegisteredResponse.body == true) {
        this.errorMessage.emit('This email address already exists in our database.');
        this.user.email = this.oldEmail;
        personalInformationForm.controls['email'].markAsPristine();
        return of(null);
      }

      return this._accountService.ChangeUserPersonalData(this.user);
    })).subscribe((changeUserPersonalDataResponse: any) => {
      if (changeUserPersonalDataResponse == null) {
        return;
      }

      location.reload();
    });
  }

  public EmailStringIsCorrect(personalInformationForm: NgForm): boolean {
    let email: string = personalInformationForm.controls['email'].value;
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (email.length > 0) {
      if (stringIsEmail.test(email)) {
        return true;
      }
    }

    this.errorMessage.emit('Your email addess is incorrect. Reminder: email address must be valid email.');
    this.user.email = this.oldEmail;
    personalInformationForm.controls['email'].markAsPristine();

    return false;
  }

  public NameAndSurnameFieldsAreFilledCorrectly(personalInformationForm: NgForm): boolean {
    let firstName: string = personalInformationForm.controls['firstName'].value;
    let lastName: string = personalInformationForm.controls['lastName'].value;
    let checkIfNumberExist = new RegExp('[0-9]');

    if (firstName.length > 1 && lastName.length > 1) {
      if (!checkIfNumberExist.test(firstName) && !checkIfNumberExist.test(lastName)) {
        return true;
      }
    }

    this.errorMessage.emit('Name or Surname fields were not filled correctly. Reminder: these fields must contain at least 2 characters and must not contain any numbers.');
    this.user.firstName = this.oldName;
    this.user.lastName = this.oldSurname;
    personalInformationForm.controls['firstName'].markAsPristine();
    personalInformationForm.controls['lastName'].markAsPristine();

    return false;
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

    this._renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.genderModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.positionModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.educationModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.sectorsOfActivitiesModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.ageGroupsModal.nativeElement, 'display', 'none');
  }

  public SubmitMultipleChoiceModalSelections(optionType: string, form: NgForm) {
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

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleModalOptionSelection(event: any) {
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

  public ChooseNewProfileImage(files: FileList) {
    this.isImageUploadingProccess = true;
    this.ToBase64(files[0]).then((value: string) => {
      this._accountService.UploadProfileImage((value)).subscribe((response: any) => {
        location.reload();
        this.profileImageName = response.body;
      }, error => location.reload());
    });
  }

  private ToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
