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
export class PersonalAccountComponent implements OnInit {

  public user: UserViewModel = new UserViewModel();
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  public regions: Array<RegionViewModel>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public errorMessage: string = '';
  public selectedTab: string = 'my-account-section';
  public formHasError: boolean = false;

  constructor(private _router: Router, private accountService: AccountService, private renderer2: Renderer2, private renderer: Renderer) {
    if (_router.getCurrentNavigation().extras.state != null) {
      this.user = _router.getCurrentNavigation().extras.state.user;
    }
  }

  ngOnInit() {
    //Each time get user from the database.
    this.user.age = 45;
    this.user.bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vel nisi consequat, malesuada nisl non, laoreet risus. Fusce vestibulum molestie purus, a accumsan urna pellentesque sit amet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec vitae placerat ipsum. In nec tincidunt elit, quis bibendum ligula. Phasellus consequat ac ligula eu accumsan. Nam eget purus et nisi ultrices sagittis. Donec sed fringilla nulla, sed blandit nibh. Quisque nec lacinia odio, vitae varius nulla. Nam ultrices sodales nulla, nec aliquam nisl convallis a. Curabitur eu sapien sit amet velit interdum tristique. ';
    this.user.education = 'PhD';
    this.user.email = 'andy@gmail.com';
    this.user.firstName = 'Andy';
    this.user.lastName = 'Willson';
    let g: GenderViewModel = new GenderViewModel();
    g.genderName = 'Male'
    this.user.gender = g;
    let l: Array<LanguageViewModel> = new Array<LanguageViewModel>();
    let l1 = new LanguageViewModel();
    l1.languageName = 'English';
    let l2 = new LanguageViewModel();
    l2.languageName = 'Russian';
    let l3 = new LanguageViewModel();
    l3.languageName = 'French';
    l.push(l1);
    l.push(l2);
    l.push(l3);
    this.user.languages = l;
    this.user.myerBriggsCode = 'AJK1';
    this.user.phoneNumber = '+30 698 823 90';
    this.user.position = 'Professor in the University';
    this.user.professionalEmail = 'andyprfessional@gmail.com';
    this.user.profileImageName = 'andy@gmail.com-user-profile-image';
    this.user.sectorOfActivity = 'IT';
    this.user.website = 'liveofaperson.com';
    let r: Array<RegionViewModel> = new Array<RegionViewModel>();
    let r1 = new RegionViewModel();
    r1.regionName = 'England';
    let r2 = new RegionViewModel();
    r2.regionName = 'Russa';
    let r3 = new RegionViewModel();
    r3.regionName = 'France';
    r.push(r1);
    r.push(r2);
    r.push(r3);
    this.user.regions = r;


    //if (this.user == null || this.user == undefined) {
    //  this.accountService.GetCurrentUser().subscribe((response: any) => {
    //    this.user = response.body;
    //    console.log(this.user);
    //  });
    //}
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
      this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
        if (response.body === true) {
          this.formHasError = true;
          this.errorMessage = this.errorMessage.concat('This email address already exists in our database.');
        }
        else {
          this.accountService.ChangeUserPersonalData(this.user).subscribe(response => {
            this._router.navigate(['/personalAccount']);
          });
        }
      });
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
