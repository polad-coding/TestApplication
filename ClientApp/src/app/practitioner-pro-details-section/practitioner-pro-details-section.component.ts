import { Component, ElementRef, HostListener, Input, OnInit, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../app-services/account.service';
import { LanguageViewModel } from '../../view-models/language-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioner-pro-details-section',
  templateUrl: './practitioner-pro-details-section.component.html',
  styleUrls: ['./practitioner-pro-details-section.component.css'],
  providers: [AccountService]
})
export class PractitionerProDetailsSectionComponent implements OnInit {

  public certificationLevel: string = 'Individual assessment';
  public membership: string = 'OK';
  @Input()
  public user: UserViewModel;
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  @ViewChild('languageModalContainer', { read: ElementRef, static: false })
  public languageModal: ElementRef;
  public newLanguagesSelected: Array<LanguageViewModel> = new Array<LanguageViewModel>();
  public profileImageName;
  public regions: Array<RegionViewModel>;
  public languages: Array<LanguageViewModel>;
  public certificateLevel: string = 'Level 1';

  constructor(private renderer2: Renderer2, private renderer: Renderer, private accountService: AccountService, private _router: Router) { }

  ngOnInit() {
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
    if (personalInformationForm.errors === null) {
      this.accountService.CheckIfProfessionalMailIsRegistered(personalInformationForm.value.professionalEmail).subscribe(response => {
        if (response.body === true) {
          //this.formHasError = true;
          //this.errorMessage = this.errorMessage.concat('This email address already exists in our database.');
        }
        else {
          this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
            this._router.navigate(['/practitionerAccount']);
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

  public DisplayLanguagesModal(event: MouseEvent) {
    event.stopPropagation();
    //TODO - deselect all regions
    if (this.languages === undefined) {
      this.accountService.GetAllLanguages().subscribe((response: any) => {
        this.languages = response.body;
      });
    }

    this.renderer2.setStyle(this.languageModal.nativeElement, 'display', 'flex');

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

  public ToggleLanguagesSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this.renderer2.removeClass(element, 'is-not-selected');
      this.renderer2.addClass(element, 'is-selected');
      this.newLanguagesSelected.push(JSON.parse(event.target.value));
    }
    else {
      this.renderer2.removeClass(element, 'is-selected');
      this.renderer2.addClass(element, 'is-not-selected');
      this.newLanguagesSelected = this.newLanguagesSelected.filter(el => !(el.languageName === JSON.parse(event.target.value).languageName));
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

  public SubmitLanguagesForm(languagesForm: NgForm) {
    //populate the regions array with these elements
    this.user.languages = this.newLanguagesSelected;
    //reset form and close it
    languagesForm.resetForm();
    this.newLanguagesSelected = new Array<LanguageViewModel>();
    this.OnDocumentClicked(null);
  }

  public ChooseNewProfileImage(files: FileList) {
    this.ToBase64(files[0]).then((value: string) => {
      this.accountService.UploadProfileImage((value)).subscribe((response: any) => {
        this.profileImageName = response.body;
      });
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
