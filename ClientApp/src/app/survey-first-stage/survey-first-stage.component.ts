import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../../app-services/data-service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SurveyService } from '../../app-services/survey-service';
import { SurveyFirstStageSaveRequestModel } from '../../view-models/survey-first-stage-save-request-model';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-survey-first-stage',
  templateUrl: './survey-first-stage.component.html',
  styleUrls: ['./survey-first-stage.component.css'],
  providers: [DataService, SurveyService]
})
export class SurveyFirstStageComponent implements OnInit, AfterViewInit {

  public values: Array<ValueViewModel>;
  public surveyPractitionerId: string;
  public lessImportantValues: Array<ElementRef> = new Array<ElementRef>();
  public importantValues: Array<ElementRef> = new Array<ElementRef>();
  public numberOfValuesQualified: number = 0;
  public numberOfValuesQualifiedAsImportant: number = 0;
  public currentIndex = 0;
  public descriptiveModeIsOn = false;
  @ViewChild('valueIdeogram', { read: ElementRef, static: false })
  public valueIdeogram: ElementRef;
  @ViewChild('valueModalIdeogram', { read: ElementRef, static: false })
  public valueModalIdeogram: ElementRef;
  @ViewChildren('valueContainers')
  public valueContainers: QueryList<ElementRef>;
  public marginValue: number = -95;
  public isSelectionStage: boolean = false;
  public isValidationStage: boolean = false;
  public valueModalIsVisible: boolean = false;
  public currentValueClickedAtValidationStep: ElementRef;
  public currentValueClickedAtValidationImportance: string;
  public isStepDescriptionPage: boolean = true;
  private surveyId: number; 

  constructor(private _dataService: DataService, private _surveyService: SurveyService, private _renderer2: Renderer2, private _router: Router) {

  }

  public ProccedToSelectionStage(event) {
    this.isStepDescriptionPage = false;
    this.isSelectionStage = true;
  }

  public ProceedToDescriptionStage(event) {
    this.isStepDescriptionPage = true;
    this.isSelectionStage = false;
  }

  public Drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    if (event.container.element.nativeElement.parentElement.parentElement.id == 'important-values-container') {
      this.numberOfValuesQualifiedAsImportant += 1;
    }
    else {
      this.numberOfValuesQualifiedAsImportant -= 1;
    }

  }

  public MarkValueAsLessImportant(event: MouseEvent) {
    if (this.importantValues.includes(this.currentValueClickedAtValidationStep)) {
      this.lessImportantValues.push(this.currentValueClickedAtValidationStep);
      this.importantValues = this.importantValues.filter(el => el != this.currentValueClickedAtValidationStep)
      this.valueModalIsVisible = false;
    }
  }

  public MarkValueAsImportant(event: MouseEvent) {
    if (this.lessImportantValues.includes(this.currentValueClickedAtValidationStep)) {
      this.importantValues.push(this.currentValueClickedAtValidationStep);
      this.lessImportantValues = this.lessImportantValues.filter(el => el != this.currentValueClickedAtValidationStep)
      this.valueModalIsVisible = false;
    }
  }

  public DisplayValueModal(event: MouseEvent, element: ElementRef, className: string) {
    this.currentValueClickedAtValidationStep = element;
    this.valueModalIsVisible = true;
    if (className == 'value-is-important') {
      this._renderer2.addClass(element.nativeElement, className);
      this._renderer2.removeClass(element.nativeElement, 'value-is-not-important');
      this.currentValueClickedAtValidationImportance = 'important';
    }
    else {
      this._renderer2.addClass(element.nativeElement, className);
      this._renderer2.removeClass(element.nativeElement, 'value-is-important');
      this.currentValueClickedAtValidationImportance = 'less-important';
    }
  }

  public CloseModal(event: MouseEvent) {
    this.valueModalIsVisible = false;
  }

  ngAfterViewInit(): void {
    if (this.descriptiveModeIsOn) {
      this.valueContainers.forEach(vc => {
        this._renderer2.setStyle(vc.nativeElement, 'margin-right', '50px');
      });
    }
    this._renderer2.addClass(this.valueContainers.first.nativeElement, 'current-value');

  }

  public TurnOffDescriptiveMode() {
    this.descriptiveModeIsOn = false;
    this.valueContainers.forEach(vc => {
      this._renderer2.setStyle(vc.nativeElement, 'margin-right', '0px');
    });
  }

  public MarkAsLessImportant(event: MouseEvent) {
    if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) == null) {
      //Increase number of values qualified by 1
      if (this.importantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
        this.numberOfValuesQualifiedAsImportant -= 1;
        this.importantValues = this.importantValues.filter(el => el.nativeElement.dataset.id != this.currentIndex);
      }
      else {
        this.numberOfValuesQualified += 1;
      }
      //Add element to the lessImportantValues list
      this.lessImportantValues.push(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex));
      //Change the style of the element
      this._renderer2.addClass(this.lessImportantValues[this.lessImportantValues.length - 1].nativeElement.firstChild, 'value-is-not-important');
      this._renderer2.removeClass(this.lessImportantValues[this.lessImportantValues.length - 1].nativeElement.firstChild, 'value-is-important');
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-important');
    }
  }

  public MarkAsImportant(event: MouseEvent) {
    if (this.importantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) == null) {
      //Increase number of values qualified by 1
      if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
        this.lessImportantValues = this.lessImportantValues.filter(el => el.nativeElement.dataset.id != this.currentIndex);
      }
      else {
        this.numberOfValuesQualified += 1;
      }
      this.numberOfValuesQualifiedAsImportant += 1;
      //Add element to the lessImportantValues list
      this.importantValues.push(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex));
      //Change the style of the element
      this._renderer2.addClass(this.importantValues[this.importantValues.length - 1].nativeElement.firstChild, 'value-is-important');
      this._renderer2.removeClass(this.importantValues[this.importantValues.length - 1].nativeElement.firstChild, 'value-is-not-important');
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
    }
  }

  public TurnOnDescriptiveMode() {
    this.descriptiveModeIsOn = true;
    this.valueContainers.forEach(vc => {
      this._renderer2.setStyle(vc.nativeElement, 'margin-right', '50px');
    });
  }

  public SelectPreviousValue(event: MouseEvent) {
    this.SelectNewValue(event, this.currentIndex - 1);
  }

  public SelectNextValue(event: MouseEvent) {
    this.SelectNewValue(event, this.currentIndex + 1);
  }

  public ProceedToValidationStep(event: MouseEvent) {
    this.isSelectionStage = false;
    this.isValidationStage = true;
  }

  public ProceedToSelectionStage(event: MouseEvent) {
    this.isValidationStage = false;
    this.isSelectionStage = true;
  }

  public SelectNewValue(mouseEvent: MouseEvent, valueId) {
    //get old value element and remove borders
    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement, 'border', 'none');
    //Focus new element
    this.currentIndex = valueId;
    this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement, 'border-top', '2px solid #006F91');
    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement, 'border-bottom', '2px solid #006F91');

    if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == valueId) != null) {
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-important');
    }
    else if (this.importantValues.find(el => el.nativeElement.dataset.id == valueId) != null) {
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
    }
    else {
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-important');
    }
  }

  ngOnInit() {
    //TODO - place the survey creation process in other place after testing
      let surveyId = Number.parseInt(localStorage.getItem('surveyId'));
      this._dataService.GetTheCurrentStageValues(surveyId).subscribe((response: any) => {
        if (response.ok) {
          this.values = response.body;
        }
      });
  }

  public SaveFirstStageResults(event) {
    let valuesToSave = Array<ValueViewModel>();

    this.importantValues.forEach(v => {
      valuesToSave.push(this.values[v.nativeElement.dataset.id]);
    });

    this._dataService.SaveFirstStageResults(new SurveyFirstStageSaveRequestModel(valuesToSave, Number.parseInt(localStorage.getItem('surveyId')))).subscribe(response => {

      let ne: NavigationExtras = {
        state: {
          values: valuesToSave
        }
      }

      this._router.navigate(['surveySecondStage'],ne);
      //TODO - go to second stage with the given values
    });

  }

}
