import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { SurveyService } from '../../app-services/survey-service';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';

@Component({
  selector: 'app-enter-survey-account-form',
  templateUrl: './enter-survey-account-form.component.html',
  styleUrls: ['./enter-survey-account-form.component.css'],
  providers: [AccountService, SurveyService, DataService]
})
export class EnterSurveyAccountFormComponent implements OnInit {

  public errorMessage: string;
  public formHasError: boolean;
  public surveyCode: string;
  public user: UserViewModel;
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  public regions: Array<RegionViewModel>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();

  constructor(private _accountService: AccountService, private _dataService: DataService, private _renderer2: Renderer2, private _renderer: Renderer, private _router: Router, private _surveyService: SurveyService) { }

  ngOnInit() {
    if (this.user == null || this.user == undefined) {
      this._accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
        console.log(this.user);
      });
    }

    //if (localStorage.getItem('surveyCode') != null) {
    //  this.surveyCode = localStorage.getItem('surveyCode');
    //}
    //else {
    //  this._router.navigate(['enterCode']);
    //}
  }

  public DisplayRegionsModal(event: MouseEvent) {
    event.stopPropagation();
    if (this.regions === undefined) {
      this._accountService.GetAllRegions().subscribe((response: any) => {
        this.regions = response.body;
      });
    }

    this._renderer2.setStyle(this.regionModal.nativeElement, 'display', 'flex');

  }

  public EditInputField(fieldName: string, event: MouseEvent) {
    event.stopPropagation();
    this.OnDocumentClicked(null);
    let elements = this.inputFields.filter(el => el.nativeElement.name === fieldName);
    elements.forEach(element => {
      this._renderer2.removeAttribute(element.nativeElement, 'disabled');
      this._renderer2.setStyle(element.nativeElement, 'border', '1px solid #9AC7EC');
      this._renderer.invokeElementMethod(element.nativeElement, 'focus');
    });
  }

  public ChangeProfileData(event: MouseEvent, personalInformationForm: NgForm) {
    this.errorMessage = '';
    personalInformationForm.control.enable();
    if (personalInformationForm.errors === null) {
      this.formHasError = false;
      if (personalInformationForm.controls['email'].pristine) {
        this._accountService.ChangeUserPersonalData(this.user).subscribe(response => {
          this._router.navigate(['/personalAccount']);
        });
      }
      else {
        this._accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
          if (response.body === true) {
            this.formHasError = true;
            this.errorMessage = this.errorMessage.concat('This email address already exists in our database.');
          }
          else {
            this._accountService.ChangeUserPersonalData(this.user).subscribe(response => {
              this._router.navigate(['/personalAccount']);
            });
          }
        });
      }

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
      this._renderer2.setAttribute(el.nativeElement, 'disabled', 'disabled');
      this._renderer2.setStyle(el.nativeElement, 'border', 'none');
    });

    this._renderer2.setStyle(this.regionModal.nativeElement, 'display', 'none');
  }

  public PreventEventPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  public ToggleRegionSelection(event: any) {
    let element = event.target.nextSibling;

    if (element.className === 'is-not-selected') {
      this._renderer2.removeClass(element, 'is-not-selected');
      this._renderer2.addClass(element, 'is-selected');
      this.newRegionsSelected.push(JSON.parse(event.target.value));
    }
    else {
      this._renderer2.removeClass(element, 'is-selected');
      this._renderer2.addClass(element, 'is-not-selected');
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
    //TODO - first before you create the survey, update users-data
  }

  public CreateSurvey() {
    this._accountService.ChangeUserPersonalData(this.user).subscribe(response => {
      if (response.ok && response != null) {
        this._surveyService.CreateSurvey(this.surveyCode, null).subscribe((response: any) => {
          console.log(response);
          if (response.ok) {
            localStorage.setItem('surveyId', response.body.id);
            this._dataService.GetAllValues(response.body.id).subscribe((response: any) => {
              localStorage.removeItem('surveyCode');
              this._router.navigate(['surveyFirstStage']);
            });
          }
        },
          error => {
            console.log(error);
          });
      }
    });
  }

}
