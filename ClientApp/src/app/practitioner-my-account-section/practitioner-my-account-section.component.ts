import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { AgeGroupViewModel } from '../../view-models/age-group-view-model';
import { CertificationViewModel } from '../../view-models/certification-view-model';
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
  private oldEmail: string;
  private oldName: string;
  private oldSurname: string;
  //public errorMessage: string = '';
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
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
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public newPositionsSelected: Array<PositionViewModel> = new Array<PositionViewModel>();
  public newEducationsSelected: Array<EducationViewModel> = new Array<EducationViewModel>();
  public newSectorsOfActivitiesSelected: Array<SectorOfActivityViewModel> = new Array<SectorOfActivityViewModel>();
  public newAgeGroupSelected: AgeGroupViewModel = new AgeGroupViewModel(undefined, undefined);
  public profileImageName;
  @Input()
  public certificateLevel: string = '';
  public imageSectionIsVisible: string = 'true';
  @Output() errorMessage: EventEmitter<string> = new EventEmitter<string>();
  public isUploadingProccess: boolean = false;
  public selectedGender: string;
  @ViewChild('personalInformationForm', { read: NgForm, static: false })
  public personalInformationForm: NgForm;
  public dummyNumber: number;


  constructor(private _dataService: DataService, private _router: Router, private _renderer2: Renderer2, private accountService: AccountService, private renderer: Renderer) { }
  ngAfterViewInit(): void {
    this._dataService.GetPractitionersCertifications(this.user.id).subscribe((response: any) => {
      let certifications: any = response.body;
      console.log(certifications);
      certifications = certifications.sort((a, b) => a.certification.level - b.certification.level);
      if (certifications.length > 0) {
        this.certificateLevel = 'Level ' + certifications[certifications.length - 1].certification.level;
      }
      else {
        this.certificateLevel = '';
      }
    });
    //setTimeout(() => {
    this.oldEmail = this.user.email;
    this.oldName = this.user.firstName;
    this.oldSurname = this.user.lastName;
    console.log(this.oldName);
    console.log(this.oldSurname);
    //}, 100);
  }

  ngOnInit() {
    this.accountService.GetAllAgeGroups().subscribe((response: any) => {
      this.ageGroups = response.body;
      console.log(this.ageGroups);
    });

    this.accountService.GetAllRegions().subscribe((response: any) => {
      this.regions = response.body;
    });

    this.accountService.GetAllEducations().subscribe((response: any) => {
      this.educations = response.body;
    });

    this.accountService.GetAllPositions().subscribe((response: any) => {
      this.positions = response.body;

    });

    this.accountService.GetAllSectorsOfActivities().subscribe((response: any) => {
      this.sectorsOfActivities = response.body;
    });

    this._dataService.GetSelectedRegionsForCurrentUser().subscribe((response: any) => {
      this.newRegionsSelected = response.body;
    });

    this._dataService.GetSelectedEducationsForCurrentUser().subscribe((response: any) => {
      this.newEducationsSelected = response.body;
    });

    this._dataService.GetSelectedPositionsForCurrentUser().subscribe((response: any) => {
      this.newPositionsSelected = response.body;
    });

    this._dataService.GetSelectedSectorsOfActivityForCurrentUser().subscribe((response: any) => {
      this.newSectorsOfActivitiesSelected = response.body;
    });

    localStorage.setItem('practitionerAccountTabName', 'my-account-section');

    this.dummyNumber = Math.floor(Math.random() * 100000);
  }

  public DisplayPositionModal(event: MouseEvent) {
    event.stopPropagation();

    let positionsContainers = document.getElementsByClassName('checkbox-container');

    for (var i = 0; i < positionsContainers.length; i++) {
      this._renderer2.removeClass(positionsContainers[i].lastChild, 'is-selected');
      this._renderer2.addClass(positionsContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newPositionsSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${this.newPositionsSelected[i].positionName}-position-container`), 'is-selected');
    }

    this._renderer2.setStyle(this.positionModal.nativeElement, 'display', 'flex');
    this.positionModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });

  }

  public DisplayEducationsModal(event: MouseEvent) {
    event.stopPropagation();

    let educationsContainers = document.getElementsByClassName('checkbox-container');
    console.log(this.educationModal);

    for (var i = 0; i < educationsContainers.length; i++) {
      this._renderer2.removeClass(educationsContainers[i].lastChild, 'is-selected');
      this._renderer2.addClass(educationsContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newEducationsSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${this.newEducationsSelected[i].educationName}-education-container`), 'is-selected');
    }

    this._renderer2.setStyle(this.educationModal.nativeElement, 'display', 'flex');
    this.educationModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });

  }

  public DisplaySectorsOfActivitiesModal(event: MouseEvent) {
    event.stopPropagation();

    let sectorsOfActivitiesContainers = document.getElementsByClassName('checkbox-container');

    for (var i = 0; i < sectorsOfActivitiesContainers.length; i++) {
      this._renderer2.removeClass(sectorsOfActivitiesContainers[i].lastChild, 'is-selected');
      this._renderer2.addClass(sectorsOfActivitiesContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newSectorsOfActivitiesSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${this.newSectorsOfActivitiesSelected[i].sectorOfActivityName}-sector-of-activity-container`), 'is-selected');
    }

    this._renderer2.setStyle(this.sectorsOfActivitiesModal.nativeElement, 'display', 'flex');
    this.sectorsOfActivitiesModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });

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

  public DisplayRegionsModal(event: MouseEvent) {
    event.stopPropagation();
    //TODO - deselect all regions

    let regionContainers = document.getElementsByClassName('checkbox-container');

    for (var i = 0; i < regionContainers.length; i++) {
      this._renderer2.removeClass(regionContainers[i].lastChild, 'is-selected');
      this._renderer2.addClass(regionContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newRegionsSelected.length; i++) {
      this._renderer2.addClass(document.getElementById(`${this.newRegionsSelected[i].regionName}-country-container`), 'is-selected');
    }

    this._renderer2.setStyle(this.regionModal.nativeElement, 'display', 'flex');
    this.regionModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });
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
    if (!this.CheckIfNameAndSurnameFieldsAreFilledCorrectly(personalInformationForm)) {
      return;
    }

    if (!this.CheckIfEmailStringIsCorrect(personalInformationForm)) {
      return;
    }

    if (personalInformationForm.controls['email'].pristine) {
      this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        window.location.reload();
      });
    }
    else {
      this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
        if (response.body === true) {
          this.user.email = this.oldEmail;
          personalInformationForm.controls['email'].markAsPristine();
          this.errorMessage.emit('Entered email is already registered. Please enter something else.');
        }
        else {
          this.accountService.CheckIfProfessionalMailIsRegistered(personalInformationForm.value.email).subscribe((response: any) => {
            if (response.body) {
              this.errorMessage.emit('This email address is already registered.');

            }
            else {
              this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
                window.location.reload();
              });
            }
          })
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

    this.errorMessage.emit('Your email addess is incorrect. Reminder: email address must be valid email.');
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

    this.errorMessage.emit('Name or Surname fields were not filled correctly. Reminder: these fields must contain at least 2 characters and must not contain any numbers.');
    this.user.firstName = this.oldName;
    this.user.lastName = this.oldSurname;
    personalInformationForm.controls['firstName'].markAsPristine();
    personalInformationForm.controls['lastName'].markAsPristine();

    return false;
  }

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

  public SubmitPositionForm(positionForm: NgForm) {
    this.newPositionsSelected = new Array<PositionViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newPositionsSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }



    this.user.positions = this.newPositionsSelected;
    //reset form and close it
    this.personalInformationForm.form.markAsDirty();
    positionForm.resetForm();
    this.OnDocumentClicked(null);
  }

  public SubmitEducationForm(educationForm: NgForm) {
    this.newEducationsSelected = new Array<EducationViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    console.log(elements);

    for (var i = 0; i < elements.length; i++) {
      this.newEducationsSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }

    console.log(this.newEducationsSelected);


    this.user.educations = this.newEducationsSelected;
    //reset form and close it
    this.personalInformationForm.form.markAsDirty();
    educationForm.resetForm();
    this.OnDocumentClicked(null);
  }

  public SubmitSectorOfActivityForm(sectorOfActivityForm: NgForm) {
    this.newSectorsOfActivitiesSelected = new Array<SectorOfActivityViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newSectorsOfActivitiesSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }



    this.user.sectorsOfActivities = this.newSectorsOfActivitiesSelected;
    //reset form and close it
    this.personalInformationForm.form.markAsDirty();
    sectorOfActivityForm.resetForm();
    this.OnDocumentClicked(null);
  }


  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this._renderer2.removeClass(element, 'is-not-selected');
      this._renderer2.addClass(element, 'is-selected');
      //this.newRegionsSelected.push(JSON.parse(event.target.value));
    }
    else {
      this._renderer2.removeClass(element, 'is-selected');
      this._renderer2.addClass(element, 'is-not-selected');
      //this.newRegionsSelected = this.newRegionsSelected.filter(el => !(el.regionName === JSON.parse(event.target.value).regionName));
    }
  }

  public SubmitRegionsForm(regionsForm: NgForm) {
    //populate the regions array with these elements
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

  public ChooseNewProfileImage(files: FileList) {
    this.isUploadingProccess = true;
    this.ToBase64(files[0]).then((value: string) => {
      this.accountService.UploadProfileImage((value)).subscribe((response: any) => {
        window.location.reload();
        this.profileImageName = response.body;
      }, error => window.location.reload());
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
