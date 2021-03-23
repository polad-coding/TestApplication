////import { toBase64String } from '@angular/compiler/src/output/source_map';
import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnInit, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../app-services/account.service';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
import { UserViewModel } from '../../view-models/user-view-model';
//import Tobasng } from '@angular/compiler/src/util';


@Component({
  selector: 'app-practitioner-account',
  templateUrl: './practitioner-account.component.html',
  styleUrls: ['./practitioner-account.component.css'],
  providers: [AccountService]
})
export class PractitionerAccountComponent implements OnInit, AfterViewInit {

  @ViewChildren('accountSectionTab', { read: ElementRef })
  public accountSectionTabs: QueryList<ElementRef>;
  public currentSelectedTabIndex: number;
  public user: UserViewModel;
  @ViewChildren('inputField')
  public inputFields: QueryList<ElementRef>;
  public regions: Array<RegionViewModel>;
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public profileImageName = 'KP-logotype-006F91-empty.svg';

  constructor(private _router: Router, private renderer2: Renderer2, private accountService: AccountService, private renderer: Renderer) { }

  ngOnInit() {
    if (this.user == null || this.user == undefined) {
      this.accountService.GetCurrentUser().subscribe((response: any) => {
        this.user = response.body;
        console.log(this.user);
      });
    }
  }

  ngAfterViewInit(): void {
    this.AdjustZIndexes();
  }





  public SelectTab(event: any) {
    console.log(event.target);
    //deselect other tab
    this.accountSectionTabs.forEach((el) => {
      this.renderer2.removeClass(el.nativeElement, 'section-selected');
      this.renderer2.addClass(el.nativeElement, 'section-not-selected');
    });
    //select tab
    if (event.target.localName === 'p') {
      this.renderer2.removeClass(event.target.parentElement, 'section-not-selected');
      this.renderer2.addClass(event.target.parentElement, 'section-selected');
    }
    else {
      this.renderer2.removeClass(event.target, 'section-not-selected');
      this.renderer2.addClass(event.target, 'section-selected');
    }

    this.AdjustZIndexes();

    //this.renderer2.setStyle()
  }

  private AdjustZIndexes() {
    //adjust z-indexes
    this.accountSectionTabs.forEach((el, index) => {
      if (el.nativeElement.className === 'practitioner-account-section section-selected') {
        this.currentSelectedTabIndex = index;
      }
    });

    for (var i = this.currentSelectedTabIndex; i >= 0; i--) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${i}`);
      }
      else {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
      }
    }

    for (var i = this.currentSelectedTabIndex; i < this.accountSectionTabs.length; i++) {
      if (this.currentSelectedTabIndex != i) {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${this.accountSectionTabs.length - i}`);
      }
      else {
        this.renderer2.setStyle(this.accountSectionTabs.toArray()[i].nativeElement, 'z-index', `${500}`);
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
    //this.errorMessage = '';
    personalInformationForm.control.enable();
    if (personalInformationForm.errors === null) {
      //this.formHasError = false;
      //TODO - check if email and Myer code are correct
      this.accountService.CheckIfMailIsRegistered(personalInformationForm.value.email).subscribe(response => {
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
      //TODO - perform the changes if so
      console.log(this.user);
    }
    else {
      //this.formHasError = true;
      console.log(personalInformationForm);
      if (personalInformationForm.controls['email'].errors.required) {
        //this.errorMessage = this.errorMessage.concat('Email address is a compulsory field! ');
      }
      else if (personalInformationForm.controls['email'].errors.pattern) {
        //this.errorMessage = this.errorMessage.concat('Incorrect email address! ');
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

  public ChooseNewProfileImage(files: FileList) {
    this.ToBase64(files[0]).then((value: string) => {
      this.accountService.UploadProfileImage((value)).subscribe((response:any) => {
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
