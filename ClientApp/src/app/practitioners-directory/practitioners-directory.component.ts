import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, HostListener, OnInit, Renderer2, ViewChildren } from '@angular/core';
import { element } from 'protractor';
import { timer } from 'rxjs';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { CertificationViewModel } from '../../view-models/certification-view-model';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { LanguageViewModel } from '../../view-models/language-view-model';
import { PractitionersSearchFilterViewModel } from '../../view-models/practitioners-search-filter-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-practitioners-directory',
  templateUrl: './practitioners-directory.component.html',
  styleUrls: ['./practitioners-directory.component.css'],
  providers: [AccountService, DataService]
})
export class PractitionersDirectoryComponent implements OnInit {

  public numberOfPractitioners: number;
  public selectedGendersText: string = 'No gender preference';
  public currentPractitionerIndex: number = 0;
  public amountOfPractitionersToShow = 5;
  public selectedLanguagesText: string = 'No language preference';
  public selectedRegionsText: string = 'No geographic preference';
  public languages: Array<LanguageViewModel> = new Array<LanguageViewModel>();
  public geographicalLocations: Array<RegionViewModel> = new Array<RegionViewModel>();
  public currentPractitioners: Array<UserViewModel> = new Array<UserViewModel>();
  public practitionersCertifications: Array<Array<CertificationViewModel>> = new Array<Array<CertificationViewModel>>();
  public practitionersSearchFilterViewModel: PractitionersSearchFilterViewModel = new PractitionersSearchFilterViewModel();
  public languagesModalIsVisible: boolean = false;
  public regionsModalIsVisible: boolean = false;
  public gendersModalIsVisible: boolean = false;

  constructor(private _accountService: AccountService, private _dataService: DataService, private _renderer2: Renderer2) { }

  ngOnInit() {
    this.onResize(null);

    localStorage.setItem('currentTabName', 'whoWeAre');

    this._accountService.GetAllLanguages().subscribe((response: any) => {
      this.languages = response.body;
    });

    this._accountService.GetAllRegions().subscribe((response: any) => {
      this.geographicalLocations = response.body;
      console.log(this.geographicalLocations);
    });

    this._dataService.ReturnNumberOfPractitioners().subscribe((response: any) => {
      this.numberOfPractitioners = response.body;
      console.log(this.numberOfPractitioners);
    });

    this.practitionersSearchFilterViewModel.startingIndex = 0;
    this.practitionersSearchFilterViewModel.endingIndex = this.amountOfPractitionersToShow;

    this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
      this.currentPractitioners = response.body;

      console.log(this.currentPractitioners);

      for (var i = 0; i < this.currentPractitioners.length; i++) {
        this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
          this.practitionersCertifications.push(new Array<CertificationViewModel>());
          this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
        });
      }
    });
  }

  

  public SelectPractitioner(event: any) {
    //Change the styles for images
    this._renderer2.removeClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');


    this._renderer2.addClass(document.getElementById(event.target.id), 'current-practitioner');

    //Change current index
    this.currentPractitionerIndex = Number.parseInt(event.target.id.split('-').pop());
  }

  public GoToPreviousPractitioner() {
    if (this.practitionersSearchFilterViewModel.startingIndex > 0 || this.currentPractitionerIndex > 0) {
      if (this.currentPractitionerIndex > 0) {
        this._renderer2.removeClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');

        this.currentPractitionerIndex -= 1;

        this._renderer2.addClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');

      }
      else {
        this.practitionersSearchFilterViewModel.startingIndex -= this.amountOfPractitionersToShow;
        this.practitionersSearchFilterViewModel.endingIndex -= this.amountOfPractitionersToShow;

        this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {

          this.currentPractitioners = response.body;

          for (var i = 0; i < this.currentPractitioners.length; i++) {
            this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
              this.practitionersCertifications.push(new Array<CertificationViewModel>());
              this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
            });
          }


        });

        this.currentPractitionerIndex = 0;
      }
    }

  }

  public GoToNextPractitioner() {
    if (this.numberOfPractitioners > this.practitionersSearchFilterViewModel.startingIndex + this.currentPractitionerIndex + 1) {
      if (this.currentPractitionerIndex < this.currentPractitioners.length - 1) {
        this._renderer2.removeClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');

        this.currentPractitionerIndex += 1;

        this._renderer2.addClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');

      }
      else {
        this.practitionersSearchFilterViewModel.startingIndex += this.amountOfPractitionersToShow;
        this.practitionersSearchFilterViewModel.endingIndex += this.amountOfPractitionersToShow;

        this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
          this.currentPractitioners = response.body;

          for (var i = 0; i < this.currentPractitioners.length; i++) {
            this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
              this.practitionersCertifications.push(new Array<CertificationViewModel>());
              this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
            });
          }
        });

        this.currentPractitionerIndex = 0;
      }
    }
  }

  public LanguageClicked(event: any) {
    if (event.target.classList.contains('modal-unit-is-not-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-not-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-selected');
    }
    else if (event.target.classList.contains('modal-unit-is-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-not-selected');
    }
  }

  public RegionClicked(event: any) {
    if (event.target.classList.contains('modal-unit-is-not-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-not-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-selected');
    }
    else if (event.target.classList.contains('modal-unit-is-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-not-selected');
    }
  }

  public GenderClicked(event: any) {

    let elements = document.getElementById('genders-container').getElementsByClassName('modal-unit');


    for (var i = 0; i < elements.length; i++) {
      this._renderer2.removeClass(elements.item(i), 'modal-unit-is-selected');
      this._renderer2.addClass(elements.item(i), 'modal-unit-is-not-selected');
    }


    if (event.target.classList.contains('modal-unit-is-not-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-not-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-selected');
    }
    else if (event.target.classList.contains('modal-unit-is-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-not-selected');
    }
  }

  public ChooseLanguages() {
    let languages = new Array<LanguageViewModel>();

    let elements = document.getElementById('languages-container').getElementsByClassName('modal-unit-is-selected');

    this.selectedLanguagesText = '';

    for (var i = 0; i < elements.length; i++) {
      languages.push(new LanguageViewModel(Number.parseInt(elements.item(i).id.split('-')[2]), elements.item(i).getAttribute('data-languagename')));
      console.log(languages);
    }

    this.practitionersSearchFilterViewModel.languagesSelected = languages;

    if (this.practitionersSearchFilterViewModel.languagesSelected.length > 0) {
      this.practitionersSearchFilterViewModel.languagesSelected.forEach(l => {
        this.selectedLanguagesText += l.languageName + '/';
      });

      this.selectedLanguagesText = this.selectedLanguagesText.substring(0, this.selectedLanguagesText.length-1)
    }
    else {
      this.selectedLanguagesText = 'No language preference';
    }

    this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
      this.currentPractitioners = response.body;

      for (var i = 0; i < this.currentPractitioners.length; i++) {
        this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
          this.practitionersCertifications.push(new Array<CertificationViewModel>());
          this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
        });
      }
    });

    this.languagesModalIsVisible = false;
    this.currentPractitionerIndex = 0;

  }

  public ChooseRegions() {
    let regions = new Array<RegionViewModel>();

    let elements = document.getElementById('regions-container').getElementsByClassName('modal-unit-is-selected');

    console.info(elements);

    this.selectedRegionsText = '';

    for (var i = 0; i < elements.length; i++) {
      regions.push(new RegionViewModel(Number.parseInt(elements.item(i).id.split('-')[2]), elements.item(i).getAttribute('data-regionname')));
      console.log(regions);
    }

    this.practitionersSearchFilterViewModel.geographicalLocationsSelected = regions;

    if (this.practitionersSearchFilterViewModel.geographicalLocationsSelected.length > 0) {
      this.practitionersSearchFilterViewModel.geographicalLocationsSelected.forEach(r => {
        this.selectedRegionsText += r.regionName + '/';
      });

      this.selectedRegionsText = this.selectedRegionsText.substring(0, this.selectedRegionsText.length - 1)
    }
    else {
      this.selectedRegionsText = 'No geographical preference';
    }

    this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
      this.currentPractitioners = response.body;

      for (var i = 0; i < this.currentPractitioners.length; i++) {
        this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
          this.practitionersCertifications.push(new Array<CertificationViewModel>());
          this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
        });
      }
    });

    this.regionsModalIsVisible = false;
    this.currentPractitionerIndex = 0;
  }

  public ChooseGenders() {
    let gender = new GenderViewModel();

    let element = document.getElementById('genders-container').getElementsByClassName('modal-unit-is-selected');


    if (element.length == 0) {
      this.practitionersSearchFilterViewModel.genderSelected = null;
      this.selectedGendersText = 'No gender preference';
    }
    else {
      gender.genderName = element.item(0).innerHTML;
      this.practitionersSearchFilterViewModel.genderSelected = gender;
      this.selectedGendersText = element.item(0).innerHTML;
    }

    this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
      this.currentPractitioners = response.body;

      for (var i = 0; i < this.currentPractitioners.length; i++) {
        this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
          this.practitionersCertifications.push(new Array<CertificationViewModel>());
          this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
        });
      }
    });

    this.gendersModalIsVisible = false;
    this.currentPractitionerIndex = 0;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {

    let oldAmountOfPractitionersToShow = this.amountOfPractitionersToShow;

    if (window.innerWidth > 880) {
      this.amountOfPractitionersToShow = 5;
    }
    else if (window.innerWidth <= 880 && window.innerWidth > 600) {
      this.amountOfPractitionersToShow = 4;
    }
    else if (window.innerWidth <= 600 && window.innerWidth > 480) {
      this.amountOfPractitionersToShow = 3;
    }
    else if (window.innerWidth <= 480 && window.innerWidth >= 330) {
      this.amountOfPractitionersToShow = 3;
    }

    if (oldAmountOfPractitionersToShow != this.amountOfPractitionersToShow) {
      this.practitionersSearchFilterViewModel.endingIndex = this.practitionersSearchFilterViewModel.startingIndex + this.amountOfPractitionersToShow;
      this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).subscribe((response: any) => {
        this.currentPractitioners = response.body;

        for (var i = 0; i < this.currentPractitioners.length; i++) {
          this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id).subscribe((response: any) => {
            this.practitionersCertifications.push(new Array<CertificationViewModel>());
            this.practitionersCertifications[this.practitionersCertifications.length - 1] = response.body;
          });
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.languagesModalIsVisible = false;
    this.gendersModalIsVisible = false;
    this.regionsModalIsVisible = false;
  }

  public ShowLanguagesModal(event: MouseEvent) {
    event.stopPropagation();
    this.languagesModalIsVisible = true;
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ShowRegionsModal(event: MouseEvent) {
    event.stopPropagation();
    this.regionsModalIsVisible = true;
  }

  public ShowGendersModal(event: MouseEvent) {
    event.stopPropagation();
    this.gendersModalIsVisible = true;
  }

}
