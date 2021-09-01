import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { LanguageViewModel } from '../../view-models/language-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-pro-details-section',
  templateUrl: './practitioner-pro-details-section.component.html',
  styleUrls: ['./practitioner-pro-details-section.component.css'],
  providers: [AccountService, DataService]
})
export class PractitionerProDetailsSectionComponent implements OnInit, AfterViewInit {

  public currentCertificationLevelTitle: string;
  public certificateLevelString: string = '';
  public membershipStatusText: string;

  @Input()
  public user: UserViewModel;

  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  @ViewChild('proInformationForm', { read: NgForm, static: false })
  public proInformationForm: NgForm;

  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  @ViewChild('languageModalContainer', { read: ElementRef, static: false })
  public languageModal: ElementRef;

  //Used to display which options are selected currently, when the modal is opened.
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public newLanguagesSelected: Array<LanguageViewModel> = new Array<LanguageViewModel>();

  public regions: Array<RegionViewModel>;
  public languages: Array<LanguageViewModel>;

  public profileImageName;
  public dummyNumber: number;

  //Used to share a loading gif when user is uploading new image.
  public isImageUploadingProccess: boolean = false;

  @Output() errorMessage: EventEmitter<string> = new EventEmitter<string>();

  //If the form submitted was incorrect these three properties will be used to return form fields to initial values.
  public oldProfessionalEmail: string;
  public oldPhoneNumber: string;
  public oldWebsite: string;

  constructor(
    private _dataService: DataService,
    private renderer2: Renderer2,
    private renderer: Renderer,
    private _accountService: AccountService,
    private _router: Router
  ) { }

  ngAfterViewInit(): void {
    this.oldProfessionalEmail = this.user.professionalEmail;
    this.oldPhoneNumber = this.user.phoneNumber;
    this.oldWebsite = this.user.website;

    this._accountService.GetPractitionersCertifications(this.user.id).subscribe((response: any) => {
      console.log(response);
      let certifications: any = response.body;
      certifications = certifications.sort((a, b) => a.certification.level - b.certification.level);

      if (certifications.length > 0) {
        this.certificateLevelString = 'Level ' + certifications[certifications.length - 1].certification.level;
        this.currentCertificationLevelTitle = certifications[certifications.length - 1].certification.certificationType;
        return;
      }

      this.certificateLevelString = '';
    });
  }

  ngOnInit() {
    this.dummyNumber = Math.floor(Math.random() * 100000);

    forkJoin(
      this._accountService.GetSelectedRegionsForCurrentUser(),
      this._accountService.GetSelectedLanguagesForCurrentUser(),
      this._accountService.GetAllRegions(),
      this._accountService.GetAllLanguages()).pipe(map(([firstResponse, secondResponse, thirdResponse, fourthResponse]: any) => {
        this.newRegionsSelected = firstResponse.body;
        this.newLanguagesSelected = secondResponse.body;
        this.regions = thirdResponse.body;
        this.languages = fourthResponse.body;
      })).subscribe();

    this._accountService.GetMembershipStatus().subscribe((response: any) => {
      if (response.body != '' && response.body != undefined && response.body != null) {
        this.membershipStatusText = 'OK';
      }
    });

    localStorage.setItem('practitionerAccountTabName', 'pro-details-section');
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
    event.stopPropagation();

    if (!this.EmailStringIsCorrect(personalInformationForm)) {
      return;
    }

    if (!this.MobileNumberIsCorrect(personalInformationForm)) {
      return;
    }

    if (personalInformationForm.controls['professionalEmail'].pristine) {
      this._accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        window.location.reload();
      });
      return;
    }

    this._accountService.CheckIfMailIsRegistered(personalInformationForm.value.professionalEmail).pipe(switchMap((checkIfMailIsRegisteredResponse: any) => {
      if (checkIfMailIsRegisteredResponse.body == true) {
        this.errorMessage.emit('Your ordinary and professional email addresses cannot be duplicate.');
        this.user.professionalEmail = this.oldProfessionalEmail;
        personalInformationForm.controls['professionalEmail'].markAsPristine();
        return of(null);
      }

      return this._accountService.CheckIfProfessionalMailIsRegistered(personalInformationForm.value.professionalEmail);
    })).pipe(switchMap((checkIfProfessionalMailIsRegisteredResponse: any) => {
      if (checkIfProfessionalMailIsRegisteredResponse == null) {
        return of(null);
      }

      if (checkIfProfessionalMailIsRegisteredResponse.body == true) {
        this.errorMessage.emit('This email address already exists in our database.');
        this.user.professionalEmail = this.oldProfessionalEmail;
        personalInformationForm.controls['professionalEmail'].markAsPristine();
        return of(null);
      }

      return this._accountService.ChangeUserPersonalData(this.user);
    })).subscribe((changeUserPersonalDataResponse: any) => {
      if (changeUserPersonalDataResponse == null) {
        return;
      }

      window.location.reload();
      return
    });
  }

  private MobileNumberIsCorrect(personalInformationForm: NgForm): boolean {
    if (personalInformationForm.controls['phoneNumber'].pristine) {
      return true;
    }

    let phoneNumber: string = personalInformationForm.controls['phoneNumber'].value;
    let stringIsNumber = new RegExp('^[0-9]*$');

    if (phoneNumber != null && phoneNumber.length > 0 && stringIsNumber.test(phoneNumber)) {
      return true;
    }

    this.errorMessage.emit('Your phone number is in incorrect format. Reminder:phone number must be without whitespaces.');
    this.user.phoneNumber = this.oldPhoneNumber;
    personalInformationForm.controls['phoneNumber'].markAsPristine();

    return false;
  }

  private EmailStringIsCorrect(personalInformationForm: NgForm): boolean {
    if (personalInformationForm.controls['professionalEmail'].pristine) {
      return true;
    }

    let email: string = personalInformationForm.controls['professionalEmail'].value;
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (email != null && email.length > 0 && stringIsEmail.test(email)) {
      return true;
    }

    this.errorMessage.emit('Your email addess is incorrect. Reminder: email address must be valid email.');
    this.user.professionalEmail = this.oldProfessionalEmail;
    personalInformationForm.controls['professionalEmail'].markAsPristine();

    return false;
  }

  public DisplayRegionsModal(event: MouseEvent) {
    event.stopPropagation();

    let regionContainers = document.getElementsByClassName('checkbox-container');

    for (var i = 0; i < regionContainers.length; i++) {
      this.renderer2.removeClass(regionContainers[i].lastChild, 'is-selected');
      this.renderer2.addClass(regionContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newRegionsSelected.length; i++) {
      this.renderer2.addClass(document.getElementById(`${this.newRegionsSelected[i].regionName}-country-container`), 'is-selected');
    }

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'flex');
    this.regionModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });

  }

  public DisplayLanguagesModal(event: MouseEvent) {
    event.stopPropagation();

    let languageContainers = document.getElementsByClassName('checkbox-container');
    console.log(languageContainers);
    console.log(this.newLanguagesSelected);
    for (var i = 0; i < languageContainers.length; i++) {
      this.renderer2.removeClass(languageContainers[i].lastChild, 'is-selected');
      this.renderer2.addClass(languageContainers[i].lastChild, 'is-not-selected');
    }

    for (var i = 0; i < this.newLanguagesSelected.length; i++) {
      this.renderer2.addClass(document.getElementById(`${this.newLanguagesSelected[i].languageName}-language-container`), 'is-selected');
    }

    this.renderer2.setStyle(this.languageModal.nativeElement, 'display', 'flex');
    this.languageModal.nativeElement.firstChild.scrollIntoView({ behavior: 'smooth' });

  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.inputFields.forEach(el => {
      this.renderer2.setAttribute(el.nativeElement, 'disabled', 'disabled');
      this.renderer2.setStyle(el.nativeElement, 'border', 'none');
    });

    this.renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
    this.renderer2.setStyle(this.languageModal.nativeElement, 'display', 'none');
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * Toggles option selection inside the modals.
   * @param event
   */
  public ToggleModalOptionSelection(event: any) {
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

  public SubmitRegionsModal(regionsForm: NgForm) {
    this.newRegionsSelected = new Array<RegionViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newRegionsSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }

    this.user.regions = this.newRegionsSelected;
    this.proInformationForm.form.markAsDirty();
    regionsForm.resetForm();
    this.OnDocumentClicked(null);
  }

  public SubmitLanguagesModal(languagesForm: NgForm) {
    this.newLanguagesSelected = new Array<LanguageViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newLanguagesSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }

    this.user.languages = this.newLanguagesSelected;
    this.proInformationForm.form.markAsDirty();
    languagesForm.resetForm();
    this.OnDocumentClicked(null);
  }

  public ChooseNewProfileImage(files: FileList) {
    this.isImageUploadingProccess = true;
    this.ToBase64(files[0]).then((value: string) => {
      this._accountService.UploadProfileImage((value)).subscribe((response: any) => {
        window.location.reload();
        console.log('here');
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
