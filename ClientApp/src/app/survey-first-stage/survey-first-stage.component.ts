import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../../app-services/data-service';
import { ValueViewModel } from '../../view-models/value-view-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SurveyService } from '../../app-services/survey-service';
import { SurveyFirstStageSaveRequestModel } from '../../view-models/survey-first-stage-save-request-model';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { iif, of } from 'rxjs';

@Component({
  selector: 'app-survey-first-stage',
  templateUrl: './survey-first-stage.component.html',
  styleUrls: ['./survey-first-stage.component.css'],
  providers: [DataService, SurveyService]
})
export class SurveyFirstStageComponent implements OnInit, AfterViewInit {
  //List of all values
  public values: Array<ValueViewModel>;

  public lessImportantValues: Array<ElementRef> = new Array<ElementRef>();
  public importantValues: Array<ElementRef> = new Array<ElementRef>();

  public numberOfValuesQualified: number = 0;
  public numberOfValuesQualifiedAsImportant: number = 0;

  public currentIndex = 0;

  //Represents the big value ideogram located above the values list.
  @ViewChild('valueIdeogram', { read: ElementRef, static: false })
  public valueIdeogram: ElementRef;

  //Represents values at the bottom list.
  @ViewChildren('valueContainers')
  public valueContainers: QueryList<ElementRef>;

  //Represents value ideogram modal that appears when we click on value at validation stage.
  @ViewChild('valueModalIdeogram', { read: ElementRef, static: false })
  public valueModalIdeogram: ElementRef;
  public valueModalIsVisible: boolean = false;

  public isSelectionStage: boolean = false;
  public isValidationStage: boolean = false;
  public isStepDescriptionPage: boolean = true;

  //Used to specify which value to display in the modal.
  public currentValueClickedAtValidationStep: ElementRef;

  //Used to set the proper appearence (important or not), of the value in the modal.
  public currentValueClickedAtValidationImportance: string;
  //Used to set the proper appearence of the importance selection buttons.
  public currentValueClickedAtSelectionImportance: string;

  public isMobile: boolean = false;

  private surveyId: number;

  //Specifies at which stage of the survey we currently must be.
  private currentSurveyStage: string;

  constructor(private _dataService: DataService, private _surveyService: SurveyService, private _jwtHelper: JwtHelperService, private _renderer2: Renderer2, private _router: Router) {
  }

  public ProceedToPersonalSpace() {
    if (window.confirm("You are about to leave the survey, the choices of non validated steps will not be saved.")) {
      this._router.navigate(['personalAccount']);
    }
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (window.innerWidth <= 650) {
      this.isMobile = true;
    }
    else {
      this.isMobile = false;
    }
  }

  public ProceedToDescriptionStage(event) {
    this.isStepDescriptionPage = true;
    this.isSelectionStage = false;
  }

  /**
   * Drops the element from one table to another, if it was droped to different container. If its not the case just reorders the element in the same container.
   * At the end recalculates the number of important values.
   * @param event
   */
  public Drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.DecideWhetherToAddOrSubstractTheNumberOfImportantValues(event.container.element.nativeElement.parentElement.id);
  }

  private DecideWhetherToAddOrSubstractTheNumberOfImportantValues(targetContainerId: string) {
    if (targetContainerId == 'important-values-container') {
      this.numberOfValuesQualifiedAsImportant += 1;
    }
    else {
      this.numberOfValuesQualifiedAsImportant -= 1;
    }
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.valueModalIsVisible = false;
  }

  public DisplayValueModal(event: MouseEvent, element: ElementRef, className: string) {
    if (!this.valueModalIsVisible) {
      event.stopPropagation();
    }

    this.currentValueClickedAtValidationStep = element;
    this.valueModalIsVisible = true;

    if (className == 'value-is-important') {
      this.currentValueClickedAtValidationImportance = 'important';
    }
    else {
      this.currentValueClickedAtValidationImportance = 'less-important';
    }
  }

  public CloseModal(event: MouseEvent) {
    this.valueModalIsVisible = false;
  }

  ngAfterViewInit(): void {
  }

  /**
   * If the current value is important, removes it from the important values list, adds it to less important values list and reduces the number of values qualified as important.
   * If the current value is already less important, just moves to the next value.
   * If the current value was not qualified yet, adds it to less important values list and increases the number of values qualified.
   * At the end add the needed classes to the current value for proper appearence and moves to next value.
   * @param event
   */
  public MarkAsLessImportant(event: MouseEvent) {
    if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
      this.SelectNextValue(null);
      return;
    }

    if (this.importantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
      this.numberOfValuesQualifiedAsImportant -= 1;
      this.importantValues = this.importantValues.filter(el => el.nativeElement.dataset.id != this.currentIndex);
    }
    else {
      this.numberOfValuesQualified += 1;
      this.CheckIfSelectionStepIsCompleated();
    }

    this.lessImportantValues.push(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex));
    this._renderer2.addClass(this.lessImportantValues[this.lessImportantValues.length - 1].nativeElement.firstChild, 'value-is-not-important');
    this._renderer2.removeClass(this.lessImportantValues[this.lessImportantValues.length - 1].nativeElement.firstChild, 'value-is-important');

    this.SelectNextValue(null);
  }

  private CheckIfSelectionStepIsCompleated() {
    if (this.numberOfValuesQualified == 102) {
      setTimeout(() => {
        document.getElementById('procced-to-validation-step-button').scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  /**
   *Sets the proper appearence for the values, that were qualified at selection stage,
   *so that when proceed to selection stage from the other stages, all the values will
   *appear in proper fashion.
   * */
  private ResetValuesImportance() {
    this.valueContainers.forEach((vc: any) => {
      if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == vc.nativeElement.dataset.id) != undefined) {
        this._renderer2.addClass(vc.nativeElement.firstChild, 'value-is-not-important');
      }
      else if (this.importantValues.find(el => el.nativeElement.dataset.id == vc.nativeElement.dataset.id) != undefined) {
        this._renderer2.addClass(vc.nativeElement.firstChild, 'value-is-important');
      }
    });
  }

/**
 * If the current value is less important, removes it from the less important values list, adds it to important values list and increases the number of values qualified as important.
 * If the current value is already important, just moves to the next value.
 * If the current value was not qualified yet, adds it to important values list and increases the number of values qualified as important.
 * At the end add the needed classes to the current value for proper appearence and moves to next value.
 * @param event
 */
  public MarkAsImportant(event: MouseEvent) {
    if (this.importantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
      this.SelectNextValue(null);
      return;
    }

    if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == this.currentIndex) != null) {
      this.lessImportantValues = this.lessImportantValues.filter(el => el.nativeElement.dataset.id != this.currentIndex);
    }
    else {
      this.numberOfValuesQualified += 1;
      this.CheckIfSelectionStepIsCompleated();
    }

    this.numberOfValuesQualifiedAsImportant += 1;
    this.importantValues.push(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex));
    this._renderer2.addClass(this.importantValues[this.importantValues.length - 1].nativeElement.firstChild, 'value-is-important');
    this._renderer2.removeClass(this.importantValues[this.importantValues.length - 1].nativeElement.firstChild, 'value-is-not-important');

    this.SelectNextValue(null);
  }

  public SelectPreviousValue(event: MouseEvent) {
    this.SelectNewValue(event, this.currentIndex - 1);
  }

  public SelectNextValue(event: MouseEvent) {
    this.SelectNewValue(event, this.currentIndex + 1);
  }

  public ProceedToValidationStage(event: MouseEvent) {
    this.isSelectionStage = false;
    this.isValidationStage = true;
  }

  /**
   * When we proceed to selection stage checks if we came from the second stage of the survey, if that's the case gets the values previously selected at the first stage and marks the values importance.
   * @param event
   */
  public ProccedToSelectionStage(event: MouseEvent) {
    this.DisplaySelectionStage();

    if (this.currentSurveyStage != 'surveySecondStage') {
      this.StartSelectionStage();
      return;
    }

    this._surveyService.GetFirstStageValues(this.surveyId).subscribe((getFirstStageValuesResponse: any) => {
      this.MarkAllValuesImportance(getFirstStageValuesResponse.body);
    });

    this.currentIndex = 0;
    this.StartSelectionStage();
  }

  /**
   *As we proceed to selection stage, start from the first value in the list and reset values importance.
   * */
  private StartSelectionStage() {
    setTimeout(() => {
      this.SelectNewValue(null, 0);
      this.ResetValuesImportance();
    }, 100);
  }

  private DisplaySelectionStage() {
    this.isValidationStage = false;
    this.isStepDescriptionPage = false;
    this.isSelectionStage = true;
  }

  /**
   * If the new value doesn't go out of the range, scroll to it and mark it as a current.
   * @param mouseEvent
   * @param valueId
   */
  public SelectNewValue(mouseEvent: MouseEvent, valueId) {
    if (valueId > 101) {
      this.currentIndex = 101;
      valueId = 101;
    }
    else if (valueId < 0) {
      this.currentIndex = 0;
      valueId = 0;
    }

    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement, 'border', 'none');

    this.currentIndex = valueId;
    let currentContainer = this.valueContainers.find(el => el.nativeElement.dataset.id == this.currentIndex).nativeElement;

    currentContainer.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

    this._renderer2.setStyle(currentContainer, 'border-top', '2px solid #006F91');
    this._renderer2.setStyle(currentContainer, 'border-bottom', '2px solid #006F91');

    if (this.lessImportantValues.find(el => el.nativeElement.dataset.id == valueId) != null) {
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-important');
      this.currentValueClickedAtSelectionImportance = 'not-important';
    }
    else if (this.importantValues.find(el => el.nativeElement.dataset.id == valueId) != null) {
      this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this.currentValueClickedAtSelectionImportance = 'important';
    }
    else {
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      this._renderer2.removeClass(this.valueIdeogram.nativeElement, 'value-is-important');
      this.currentValueClickedAtSelectionImportance = null;
    }
  }

  private AssureThatUserIsAuthorized() {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }
  }

  private AssureThatSurveyIdIsNotNull() {
    if (this.surveyId == null || this.surveyId == undefined) {
      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }
  }

  /**
   *Decides at which stage of the survey we must be not, if its third stage or wrap up, redirect to these pages.
   *If its the second stage populates the value list and redirects directly to the validation stage of first survey stage.
   *In Other cases just populates the value list.
   * */
  ngOnInit() {
    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    this.onResize(null);

    this.AssureThatUserIsAuthorized();

    this.AssureThatSurveyIdIsNotNull();

    this._surveyService.DecideToWhichStageToTransfer(this.surveyId).pipe(switchMap((decideToWhichStageToTransferResponse: any) => {
      this.currentSurveyStage = decideToWhichStageToTransferResponse.body

      return iif(() =>
        this.currentSurveyStage == 'surveyFirstStage' || this.currentSurveyStage == 'surveySecondStage',
        this._surveyService.GetValuesForFirstStage(this.surveyId),
        of(decideToWhichStageToTransferResponse.body)
      )

    })).subscribe((iifObservableResponse: any) => {
      if (typeof iifObservableResponse == 'string') {
        this._router.navigate([iifObservableResponse]);
        return;
      }

      this.values = iifObservableResponse.body;

      if (this.currentSurveyStage == 'surveySecondStage') {
        this.ProceedDirectlyToValidationStage();
      }
    });
  }

  /**
   * Wait some time so the other data will be loaded, proceed to the validation stage after.
   * */
  private ProceedDirectlyToValidationStage() {
    setTimeout(() => {
      this.ProccedToSelectionStage(null);
      setTimeout(() => {
        this.ProceedToValidationStage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    }, 800);
  }

  /**
   * Is applied when we come from the second survey stage. From all 102 values, mark the values previously selected at these stage as important.
   * Mark all the rest values as less important.
   * @param selectedValues
   */
  private MarkAllValuesImportance(selectedValues: Array<ValueViewModel>) {
    this.numberOfValuesQualified = 0;
    this.numberOfValuesQualifiedAsImportant = 0;

    this.importantValues = new Array<ElementRef>();
    this.lessImportantValues = new Array<ElementRef>();

    this.valueContainers.forEach(vc => {
      if (selectedValues.find(sv => sv.id == vc.nativeElement.dataset.valueid) != null) {
        this.numberOfValuesQualifiedAsImportant += 1;
        this.numberOfValuesQualified += 1;
        this.importantValues.push(vc);
        this._renderer2.addClass(vc.nativeElement.firstChild, 'value-is-important');
        this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-important');
      }
      else {
        this.numberOfValuesQualified += 1;
        this.lessImportantValues.push(vc);
        this._renderer2.addClass(vc.nativeElement.firstChild, 'value-is-not-important');
        this._renderer2.addClass(this.valueIdeogram.nativeElement, 'value-is-not-important');
      }
    });
  }

  public SaveFirstStageResults(event) {
    let valuesToSave = Array<ValueViewModel>();

    this.importantValues.forEach(v => {
      valuesToSave.push(this.values[v.nativeElement.dataset.id]);
    });

    this._surveyService.SaveFirstStageResults(new SurveyFirstStageSaveRequestModel(valuesToSave, this.surveyId)).subscribe(response => {
      this._router.navigate(['surveySecondStage']);
    });

  }

}
