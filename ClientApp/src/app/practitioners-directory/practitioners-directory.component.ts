import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  //Used to identify if we can go to the next practitioner, or its the last one.
  public numberOfPractitioners: number;

  //Texts displayed at the filter containers at the top.
  public selectedGendersText: string = 'No gender preference';
  public selectedLanguagesText: string = 'No language preference';
  public selectedRegionsText: string = 'No geographic preference';

  //Used to display the data of the current pracititioner.
  public currentPractitionerIndex: number = 0;
  //Used to identify how many practitioners to show on one screen.
  public amountOfPractitionersToShow = 5;

  //Data of the filter modals.
  public languages: Array<LanguageViewModel> = new Array<LanguageViewModel>();
  public geographicalLocations: Array<RegionViewModel> = new Array<RegionViewModel>();

  public currentPractitioners: Array<UserViewModel> = new Array<UserViewModel>();

  public currentUserIsAMember: boolean = false;

  public practitionersCertifications: Array<Array<CertificationViewModel>> = new Array<Array<CertificationViewModel>>();

  public practitionersSearchFilterViewModel: PractitionersSearchFilterViewModel = new PractitionersSearchFilterViewModel();

  public languagesModalIsVisible: boolean = false;
  public regionsModalIsVisible: boolean = false;
  public gendersModalIsVisible: boolean = false;

  //Used to avoid practitioner profile image caching.
  public dummyNumber: number;

  constructor(private _accountService: AccountService, private _dataService: DataService, private _renderer2: Renderer2) { }

  private InitializeModalsData() {
    forkJoin(this._accountService.GetAllLanguages(), this._accountService.GetAllRegions())
      .pipe(map(([languagesResponse, regionsResponse, numberOfPractitionersResponse]: any) => {
        this.languages = languagesResponse.body;
        this.geographicalLocations = regionsResponse.body;
      })).subscribe();
  }

  ngOnInit() {
    this.onResize(null);

    this.dummyNumber = Math.floor(Math.random() * 10000);

    localStorage.setItem('currentNavigationBarTabName', 'whoWeAre');

    this.InitializeModalsData();

    this._dataService.ReturnNumberOfPractitioners().subscribe((returnNumberOfPractitionersResponse: any) => {
      this.numberOfPractitioners = returnNumberOfPractitionersResponse.body;
    });

    this.practitionersSearchFilterViewModel.startingIndex = 0;
    this.practitionersSearchFilterViewModel.endingIndex = this.amountOfPractitionersToShow;

    this.InitializePractitionersThatSatisfyTheFilters();
  }

  /**
   * Gets the practitioners that satisfy the filters applied.
   * */
  private InitializePractitionersThatSatisfyTheFilters() {
    this._dataService.GetPractitionersForDirectory(this.practitionersSearchFilterViewModel).pipe(switchMap((getPractitionersForDirectoryResponse: any) => {
      this.currentPractitioners = getPractitionersForDirectoryResponse.body;
      let arrayOfGetPractitionersCertificationsObservables = new Array<Observable<any>>();

      for (var i = 0; i < this.currentPractitioners.length; i++) {
        arrayOfGetPractitionersCertificationsObservables.push(this._dataService.GetPractitionersCertifications(this.currentPractitioners[i].id));
      }

      return forkJoin(arrayOfGetPractitionersCertificationsObservables);
    })).pipe(switchMap((forkJoinResponses) => {
      forkJoinResponses.forEach(response => {
        this.practitionersCertifications.push(response.body);
      })

      return this._dataService.GetMembershipStatusOfTheUser(this.currentPractitioners[this.currentPractitionerIndex].id);
    })).subscribe((getMembershipStatusOfTheUserResponse: any) => {
      if (getMembershipStatusOfTheUserResponse.body == null) {
        this.currentUserIsAMember = false;
        return;
      }

      this.currentUserIsAMember = true;
    });
  }

  /**
   * Selects the practitioner on which picture user has clicked on.
   * @param event
   */
  public SelectPractitioner(event: any) {
    this.ResetTheCurrentPractitioner(Number.parseInt(event.target.id.split('-').pop()));

    this.IdentifyIfTheCurrentPractitionerIsAMember();
  }

  private ResetTheCurrentPractitioner(practitionerId: number) {
    this._renderer2.removeClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');

    this.currentPractitionerIndex = practitionerId;

    this._renderer2.addClass(document.getElementById(`practitioner-${this.currentPractitionerIndex}`), 'current-practitioner');
  }

  private IdentifyIfTheCurrentPractitionerIsAMember() {
    console.log(this.currentPractitioners[this.currentPractitionerIndex]);
    this._dataService.GetMembershipStatusOfTheUser(this.currentPractitioners[this.currentPractitionerIndex].id).subscribe((response: any) => {
      if (response.body == null) {
        this.currentUserIsAMember = false;
        return;
      }
      
      this.currentUserIsAMember = true;
    });
  }

  private UserIsAtTheVeryFirstPractitioner(): boolean{
    if (this.practitionersSearchFilterViewModel.startingIndex <= 0 && this.currentPractitionerIndex <= 0) {
      return true;
    }

    return false;
  }

  private UserIsAtTheVeryLastPractitioner(): boolean {
    if (this.numberOfPractitioners <= this.practitionersSearchFilterViewModel.startingIndex + this.currentPractitionerIndex + 1) {
      return true;
    }

    return false;
  }

  public GoToPreviousPractitioner() {
    if (this.UserIsAtTheVeryFirstPractitioner()) {
      return;
    }

    //In case if we dont have to load new set of the practitioner.
    if (this.currentPractitionerIndex > 0) {
      this.ResetTheCurrentPractitioner(this.currentPractitionerIndex - 1);
      this.IdentifyIfTheCurrentPractitionerIsAMember();
      return;
    }

    this.practitionersSearchFilterViewModel.startingIndex -= this.amountOfPractitionersToShow;
    this.practitionersSearchFilterViewModel.endingIndex -= this.amountOfPractitionersToShow;

    this.InitializePractitionersThatSatisfyTheFilters();

    this.currentPractitionerIndex = 0;

    this.IdentifyIfTheCurrentPractitionerIsAMember();
  }

  public GoToNextPractitioner() {
    if (this.UserIsAtTheVeryLastPractitioner()) {
      return;
    }

    //In case if we dont have to load new set of the practitioner.
    if (this.currentPractitionerIndex < this.currentPractitioners.length - 1) {
      this.ResetTheCurrentPractitioner(this.currentPractitionerIndex + 1);
      this.IdentifyIfTheCurrentPractitionerIsAMember();
      return;
    }

    this.practitionersSearchFilterViewModel.startingIndex += this.amountOfPractitionersToShow;
    this.practitionersSearchFilterViewModel.endingIndex += this.amountOfPractitionersToShow;

    this.InitializePractitionersThatSatisfyTheFilters();

    this.currentPractitionerIndex = 0;

    this.IdentifyIfTheCurrentPractitionerIsAMember();
  }

  public LanguageClicked(event: any) {
    this.ToggleOptionSelection(event);
  }

  public RegionClicked(event: any) {
    this.ToggleOptionSelection(event);
  }

  public GenderClicked(event: any) {
    let elements = document.getElementById('genders-container').getElementsByClassName('modal-unit');

    for (var i = 0; i < elements.length; i++) {
      this._renderer2.removeClass(elements.item(i), 'modal-unit-is-selected');
      this._renderer2.addClass(elements.item(i), 'modal-unit-is-not-selected');
    }


    this.ToggleOptionSelection(event);
  }

  /**
   * Toggles modals options.
   * @param event
   */
  private ToggleOptionSelection(event) {
    if (event.target.classList.contains('modal-unit-is-not-selected')) {
      this._renderer2.removeClass(event.target, 'modal-unit-is-not-selected');
      this._renderer2.addClass(event.target, 'modal-unit-is-selected');
      return;
    }

    this._renderer2.removeClass(event.target, 'modal-unit-is-selected');
    this._renderer2.addClass(event.target, 'modal-unit-is-not-selected');
  }

  private GetSelectedLanguages(): Array<LanguageViewModel> {
    let languages = new Array<LanguageViewModel>();

    let elements = document.getElementById('languages-container').getElementsByClassName('modal-unit-is-selected');

    this.selectedLanguagesText = '';

    for (var i = 0; i < elements.length; i++) {
      languages.push(new LanguageViewModel(Number.parseInt(elements.item(i).id.split('-')[2]), elements.item(i).getAttribute('data-languagename')));
    }

    return languages;
  }

  private SetTheTextAtTheLanguageDropDown() {
    if (this.practitionersSearchFilterViewModel.languagesSelected.length <= 0) {
      this.selectedLanguagesText = 'No language preference';
      return;
    }

    this.practitionersSearchFilterViewModel.languagesSelected.forEach(l => {
      this.selectedLanguagesText += l.languageName + '/';
    });

    this.selectedLanguagesText = this.selectedLanguagesText.substring(0, this.selectedLanguagesText.length - 1)
  }

  public ChooseLanguages() {

    this.practitionersSearchFilterViewModel.languagesSelected = this.GetSelectedLanguages();

    this.SetTheTextAtTheLanguageDropDown();

    this.InitializePractitionersThatSatisfyTheFilters();

    this.languagesModalIsVisible = false;
    this.currentPractitionerIndex = 0;
  }

  private GetSelectedRegions(): Array<RegionViewModel> {
    let regions = new Array<RegionViewModel>();

    let elements = document.getElementById('regions-container').getElementsByClassName('modal-unit-is-selected');

    this.selectedRegionsText = '';

    for (var i = 0; i < elements.length; i++) {
      regions.push(new RegionViewModel(Number.parseInt(elements.item(i).id.split('-')[2]), elements.item(i).getAttribute('data-regionname')));
    }

    return regions;
  }

  private SetTheTextAtTheRegionDropDown() {
    if (this.practitionersSearchFilterViewModel.geographicalLocationsSelected.length <= 0) {
      this.selectedRegionsText = 'No geographical preference';
      return;
    }

    this.practitionersSearchFilterViewModel.geographicalLocationsSelected.forEach(r => {
      this.selectedRegionsText += r.regionName + '/';
    });

    this.selectedRegionsText = this.selectedRegionsText.substring(0, this.selectedRegionsText.length - 1)
  }

  public ChooseRegions() {
    this.practitionersSearchFilterViewModel.geographicalLocationsSelected = this.GetSelectedRegions();

    this.SetTheTextAtTheRegionDropDown();

    this.InitializePractitionersThatSatisfyTheFilters();

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

    this.InitializePractitionersThatSatisfyTheFilters();

    this.gendersModalIsVisible = false;
    this.currentPractitionerIndex = 0;
  }

  private IdentifyTheAmountOfPractitionersToShowOnOneScreen() {
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
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    let oldAmountOfPractitionersToShow = this.amountOfPractitionersToShow;

    this.IdentifyTheAmountOfPractitionersToShowOnOneScreen();

    if (oldAmountOfPractitionersToShow == this.amountOfPractitionersToShow) {
      return;
    }

    this.practitionersSearchFilterViewModel.endingIndex = this.practitionersSearchFilterViewModel.startingIndex + this.amountOfPractitionersToShow;
    this.InitializePractitionersThatSatisfyTheFilters();
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.languagesModalIsVisible = false;
    this.gendersModalIsVisible = false;
    this.regionsModalIsVisible = false;
  }

  public ShowModal(event: MouseEvent, modalName: string) {
    event.stopPropagation();

    if (modalName == 'languages-modal') {
      this.languagesModalIsVisible = true;
    }
    else if (modalName == 'regions-modal') {
      this.regionsModalIsVisible = true;
    }
    else {
      this.gendersModalIsVisible = true;
    }

    setTimeout(() => {
      document.getElementById(modalName).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

}
