import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, QueryList, Renderer, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../app-services/account.service';
import { DataService } from '../../app-services/data-service';
import { CertificationViewModel } from '../../view-models/certification-view-model';
import { GenderViewModel } from '../../view-models/gender-view-model';
import { RegionViewModel } from '../../view-models/region-view-model';
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
  @ViewChild('regionModalContainer', { read: ElementRef, static: false })
  public regionModal: ElementRef;
  public newRegionsSelected: Array<RegionViewModel> = new Array<RegionViewModel>();
  public profileImageName;
  @Input()
  public certificateLevel: string = '';
  public imageSectionIsVisible: string = 'true';
  @Output() errorMessage: EventEmitter<string> = new EventEmitter<string>();
  public isUploadingProccess: boolean = false;


  constructor(private _dataService: DataService, private _router: Router, private renderer2: Renderer2, private accountService: AccountService, private renderer: Renderer) { }
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


  public SetGender(event: MouseEvent, gender: string, proForm: NgForm) {
    let newGender = new GenderViewModel();
    proForm.form.markAsDirty();
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
