import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'protractor';
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

  public certificationLevel: string;
  public membership: string;
  @Input()
  public user: UserViewModel;
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  @ViewChild('proInformationForm', { read: NgForm, static: false })
  public proInformationForm: NgForm;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  @ViewChild('languageModalContainer', { read: ElementRef, static: false })
  public languageModal: ElementRef;
  public newLanguagesSelected: Array<LanguageViewModel> = new Array<LanguageViewModel>();
  public profileImageName;
  public regions: Array<RegionViewModel>;
  public languages: Array<LanguageViewModel>;
  @Output() errorMessage: EventEmitter<string> = new EventEmitter<string>();
  public certificateLevel: string = '';
  public oldProfessionalEmail: string;
  public oldPhoneNumber: string;
  public oldWebsite: string;
  public isUploadingProccess: boolean = false;
  public dummyNumber: number;

  constructor(private _dataService: DataService, private renderer2: Renderer2, private renderer: Renderer, private accountService: AccountService, private _router: Router) { }

  ngAfterViewInit(): void {
    this.oldProfessionalEmail = this.user.professionalEmail;
    this.oldPhoneNumber = this.user.phoneNumber;
    this.oldWebsite = this.user.website;
    this._dataService.GetMembershipStatus().subscribe((response: any) => {
      console.log(response.body);
      if (response.body != '' && response.body != undefined && response.body != null) {
        this.membership = 'OK';
      }
    });

    this._dataService.GetPractitionersCertifications(this.user.id).subscribe((response: any) => {
      let certifications: any = response.body;
      console.log(certifications);
      certifications = certifications.sort((a, b) => a.certification.level - b.certification.level);
      if (certifications.length > 0) {
        this.certificateLevel = 'Level ' + certifications[certifications.length - 1].certification.level;
        this.certificationLevel = certifications[certifications.length - 1].certification.certificationType;
      }
      else {
        this.certificateLevel = '';
      }
    });
  }

  ngOnInit() {
    this.dummyNumber = Math.floor(Math.random() * 100000);

    this._dataService.GetSelectedRegionsForCurrentUser().subscribe((response: any) => {
      this.newRegionsSelected = response.body;
    });

    this._dataService.GetSelectedLanguagesForCurrentUser().subscribe((response: any) => {
      this.newLanguagesSelected = response.body;
    });

    this.accountService.GetAllRegions().subscribe((response: any) => {
      this.regions = response.body;
    });

    this.accountService.GetAllLanguages().subscribe((response: any) => {
      this.languages = response.body;
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

    if (!this.CheckIfEmailStringIsCorrect(personalInformationForm)) {
      return;
    }

    if (!this.CheckIfMobileNumber(personalInformationForm)) {
      return;
    }

    if (personalInformationForm.controls['professionalEmail'].pristine) {
      this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
        window.location.reload();
      });
    }
    else {
      if (personalInformationForm.errors === null) {
        this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.professionalEmail).subscribe(response => {
          if (response.body == true) {
            this.errorMessage.emit('Your ordinary and professional email addresses cannot be duplicate.');
          }
          else {
            this.accountService.CheckIfProfessionalMailIsRegistered(personalInformationForm.value.professionalEmail).subscribe(response => {
              if (response.body === true) {
                this.errorMessage.emit('This email address already exists in our database.');
              }
              else {
                this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
                  window.location.reload();
                });
              }
            });
          }
        });
      }
      else {
        if (personalInformationForm.controls['email'].errors.required) {
        }
        else if (personalInformationForm.controls['email'].errors.pattern) {
        }
      }
    }
  }

  public CheckIfValidWebURL(personalInformationForm: NgForm): boolean {
    if (personalInformationForm.controls['website'].pristine) {
      return true;
    }

    let website: string = personalInformationForm.controls['website'].value;
    let stringIsWebsite = new RegExp('/^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/ig');



    if (website != null && website.length > 0) {
      if (stringIsWebsite.test(website)) {
        return true;
      }
    }
    else {
      return true;
    }

    this.errorMessage.emit('Your website URL is in incorrect format.');
    this.user.website = this.oldWebsite;
    personalInformationForm.controls['website'].markAsPristine();

    return false;
  }

  public CheckIfMobileNumber(personalInformationForm: NgForm): boolean {
    if (personalInformationForm.controls['phoneNumber'].pristine) {
      return true;
    }

    let phoneNumber: string = personalInformationForm.controls['phoneNumber'].value;
    let stringIsNumber = new RegExp('^[0-9]*$');

    if (phoneNumber != null && phoneNumber.length > 0) {
      if (stringIsNumber.test(phoneNumber)) {
        return true;
      }
    }
    else {
      return true;
    }

    this.errorMessage.emit('Your phone number is in incorrect format. Reminder:phone number must be without whitespaces.');
    this.user.profileImageName = this.oldPhoneNumber;
    personalInformationForm.controls['phoneNumber'].markAsPristine();

    return false;
  }

  public CheckIfEmailStringIsCorrect(personalInformationForm: NgForm): boolean {
    if (personalInformationForm.controls['professionalEmail'].pristine) {
      return true;
    }

    let email: string = personalInformationForm.controls['professionalEmail'].value;
    let stringIsEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

    if (email != null && email.length > 0) {
      if (stringIsEmail.test(email)) {
        return true;
      }
    }
    else {
      return true;
    }

    this.errorMessage.emit('Your email addess is incorrect. Reminder: email address must be valid email.');
    this.user.professionalEmail = this.oldProfessionalEmail;
    personalInformationForm.controls['professionalEmail'].markAsPristine();

    return false;
  }


  public DisplayRegionsModal(event: MouseEvent) {
    event.stopPropagation();
    //TODO - deselect all regions

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
    //TODO - deselect all regions

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



  public ToggleSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this.renderer2.removeClass(element, 'is-not-selected');
      this.renderer2.addClass(element, 'is-selected');
      //this.newRegionsSelected.push(JSON.parse(event.target.value));
    }
    else {
      this.renderer2.removeClass(element, 'is-selected');
      this.renderer2.addClass(element, 'is-not-selected');
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
    this.proInformationForm.form.markAsDirty();
    regionsForm.resetForm();
    this.OnDocumentClicked(null);
  }


  public SubmitLanguagesForm(languagesForm: NgForm) {
    this.newLanguagesSelected = new Array<LanguageViewModel>();
    let elements = document.getElementsByClassName('is-selected');

    for (var i = 0; i < elements.length; i++) {
      this.newLanguagesSelected.push(JSON.parse((<any>elements[i].previousSibling).value));
    }



    this.user.languages = this.newLanguagesSelected;
    //reset form and close it
    this.proInformationForm.form.markAsDirty();
    languagesForm.resetForm();
    this.OnDocumentClicked(null);
  }

  public ChooseNewProfileImage(files: FileList) {
    this.isUploadingProccess = true;
    this.ToBase64(files[0]).then((value: string) => {
      this.accountService.UploadProfileImage((value)).subscribe((response: any) => {
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
