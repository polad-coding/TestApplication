import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppSettingsService } from '../../app-services/app-settings.service';
import { DataService } from '../../app-services/data-service';
import { SurveySecondStageSaveRequestModel } from '../../view-models/survey-second-stage-save-request-model';
import { ValueViewModel } from '../../view-models/value-view-model';

@Component({
  selector: 'app-survey-second-stage',
  templateUrl: './survey-second-stage.component.html',
  styleUrls: ['./survey-second-stage.component.css'],
  providers: [DataService]
})
export class SurveySecondStageComponent implements OnInit {

  //Values from the first stage of the survey.
  public values: Array<ValueViewModel> = new Array<ValueViewModel>();

  public valuesGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();
  public valuesMarkedAsImportantGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();

  //Used to store the groups of the values that we have to mark as important by default.
  //Reminder values must be marked as important by default if the array of the grouped values has less than 4 elements.
  public defaultValuesMarkedAsImportantGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();

  public numberOfPagesToShow: number = 0;
  public currentPageIndex: number = 1;

  //Used to display the current groups in the UI containers.
  public currentGroupId: number = 7;
  public currentValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();
  public currentImportantValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();

  @ViewChildren('valuesPageButton')
  public valuesPageButtons: QueryList<ElementRef>;

  public valueModalIsVisible: boolean = false;

  public currentClickedValueCharacter: string;
  public currentClickedValueImportance: string = '';

  public isSelectionStage: boolean = false;
  public isDescriptionStage: boolean = true;

  public stepIsFilledCorrectly: boolean = false;

  //Used to display page number buttons.
  public arrayOfPages: Array<number> = new Array<number>();

  public surveyId: number;

  //Used to indicate whether should we start from the selection step directly.
  private startFromSelectionStage = false;

  private currentSurveyStage: string = '';

  constructor(private _dataService: DataService, private _renderer2: Renderer2, private _jwtHelper: JwtHelperService, private _router: Router) {
    let ne = _router.getCurrentNavigation().extras.state;

    if (ne != undefined && ne.startFromSelectionStage == true) {
      this.startFromSelectionStage = true;
    }
  }

  public ProceedToFirstStage(event) {
    if (!window.confirm("You are about to leave this 2n step, if it has not been validated, your choices will not be saved.")) {
      return;
    }

    this._dataService.DeleteSurveySecondStageResults(this.surveyId).subscribe(response => {
      this._router.navigate(['surveyFirstStage'], { state: { startFromValidationStep: true } });
    })
  }

  //TODO - we will decide if we need it then or not.

  //public ScrollUpInUnselectedValuesContainer(event) {
  //  event.target.nextSibling.scrollBy({ top: -70, behavior: 'smooth' });
  //}

  //public ScrollDownInUnselectedValuesContainer(event) {
  //  event.target.previousSibling.scrollBy({ top: 70, behavior: 'smooth' });
  //}

  //public ScrollUpInSelectedValuesContainer(event) {
  //  event.target.nextSibling.scrollBy({ top: -50, behavior: 'smooth' });
  //}

  //public ScrollDownInSelectedValuesContainer(event) {
  //  event.target.previousSibling.scrollBy({ top: 50, behavior: 'smooth' });
  //}

  private CalculateCurrentGroupId() {
    this.valuesGroupedByPerspectives.forEach((vl, key) => {
      if (this.currentGroupId > key) {
        this.currentGroupId = key;
      }
    });
  }

  private AssureUserIsAuthorized() {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }
  }

  private AssureSurveyIdIsNotNull() {
    if (localStorage.getItem('surveyId') == null || localStorage.getItem('surveyId') == undefined) {
      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }
  }

  private InitializeImportantValuesMaps() {
    this.valuesGroupedByPerspectives.forEach((value, key) => {
      this.valuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
      this.defaultValuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
    });
  }

  private InitializeArrayOfPages() {
    this.valuesGroupedByPerspectives.forEach((vl, k) => {
      if (vl.length >= 4) {
        this.arrayOfPages.push(k);
      }
    });
  }

  ngOnInit() {
    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    this.AssureUserIsAuthorized();

    this.AssureSurveyIdIsNotNull();

    this._dataService.DecideToWhichStageToTransfer(this.surveyId).pipe(switchMap((decideToWhichStageToTransferResponse: any) => {
      this.currentSurveyStage = decideToWhichStageToTransferResponse.body;

      if (this.currentSurveyStage == 'surveyFirstStage' || this.currentSurveyStage == 'wrap-up') {
        return of(decideToWhichStageToTransferResponse.body);
      }

      return this._dataService.GetFirstStageValues(this.surveyId);
    })).pipe(switchMap((getFirstStageValuesResponse: any) => {
      //If we are not supposed to be at this stage of the survey, just navigate to the needed stage.
      if (typeof getFirstStageValuesResponse == 'string') {
        this._router.navigate([getFirstStageValuesResponse]);
        return of(null);
      }

      this.values = getFirstStageValuesResponse.body;

      this.GroupValues(this.values);

      this.InitializeImportantValuesMaps();

      this.MarkAsImportantGroupsWithLessThanFourItems();

      this.InitializeArrayOfPages();

      if (this.currentSurveyStage == 'surveySecondStage') {
        return of(null);
      }

      //If we came from the third stage of the survey, retrieve the previously selected results for the second stage of the survey.
      return this._dataService.GetSecondStageValues(this.surveyId);
    })).pipe(switchMap((secondBlockResponse: any) => {
      if (secondBlockResponse == null) {
        return of(null);
      }

      let secondStageSelections: Array<ValueViewModel> = secondBlockResponse.body;

      this.PopulateMapOfImportantValuesWithThePreviousTimeSelections(secondStageSelections);

      this.RemoveRedundantArraysFromImportantValuesMap();

      this.ReinitializeValuesGroupedByPerspectivesMap(secondStageSelections);

      return of(null);
    })).subscribe((thirdBlockResponse: any) => {

      this.DecideHowManyPagesToShow();

      this.CalculateCurrentGroupId();

      this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
      this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);

      this.CheckIfStepIsFilledCorrectly();

      if (this.startFromSelectionStage) {
        this.ProceedToSelection(null);
      }
    });
  }

  /**
   * Reinitialized the valuesGroupedByPerspectives map depending on the values previously selected at this stage.
   * @param secondStageSelections
   */
  private ReinitializeValuesGroupedByPerspectivesMap(secondStageSelections: Array<ValueViewModel>) {
    this.valuesGroupedByPerspectives.forEach((v, k) => {
      this.valuesGroupedByPerspectives.set(k, new Array<ValueViewModel>());
    });

    this.values.forEach(v => {
      if (secondStageSelections.find(sss => sss.id == v.id) == null && this.valuesGroupedByPerspectives.get(v.perspectiveId) != undefined) {
        this.valuesGroupedByPerspectives.get(v.perspectiveId).push(v);
      }
    });
  }

  /**
   * Removes the redundant array group from valuesMarkedAsImportantGroupedByPerspectives map, if this group is already exists in defaultValuesMarkedAsImportantGroupedByPerspectives map.
   * */
  private RemoveRedundantArraysFromImportantValuesMap() {
    this.defaultValuesMarkedAsImportantGroupedByPerspectives.forEach((vl, i) => {
      if (vl.length > 0) {
        this.valuesMarkedAsImportantGroupedByPerspectives.set(i, new Array<ValueViewModel>());
      }
    })
  }

  private PopulateMapOfImportantValuesWithThePreviousTimeSelections(secondStageSelections: Array<ValueViewModel>) {
    secondStageSelections.forEach(secondStageSelection => {
      this.valuesMarkedAsImportantGroupedByPerspectives.get(secondStageSelection.perspectiveId).push(secondStageSelection);
    });
  }

  private CheckIfStepIsFilledCorrectly() {
    for (var i = 1; i <= 6; i++) {
      if (this.valuesGroupedByPerspectives.has(i) && this.valuesMarkedAsImportantGroupedByPerspectives.get(i).length < 3) {
        this.stepIsFilledCorrectly = false;
        return;
      }
    }

    this.stepIsFilledCorrectly = true;
  }

  /**
   * Populates the defaultValuesMarkedAsImportantGroupedByPerspectives map with values.
   * 
   * Reminder: groups with less than 4 values, should be automatically marked as important
   * and the values of these groups should be transfered to the third stage.
   * */
  private MarkAsImportantGroupsWithLessThanFourItems() {
    this.valuesGroupedByPerspectives.forEach((valueList, k) => {
      if (valueList.length < 4) {
        valueList.forEach(value => {
          this.defaultValuesMarkedAsImportantGroupedByPerspectives.get(k).push(value);
        });

        this.valuesGroupedByPerspectives.delete(k);
      }
    })
  }

  public ProceedNextStage(event) {
    let valuesToSafe = Array<ValueViewModel>();

    this.valuesMarkedAsImportantGroupedByPerspectives.forEach(valueList => {
      valueList.forEach(value => {
        valuesToSafe.push(value);
      })
    });

    this.defaultValuesMarkedAsImportantGroupedByPerspectives.forEach(valueList => {
      valueList.forEach(value => {
        valuesToSafe.push(value);
      })
    });

    this._dataService.SaveSecondStageResults(new SurveySecondStageSaveRequestModel(valuesToSafe, this.surveyId)).subscribe(response => {
      this._router.navigate(['surveyThirdStage']);
    });
  }

  public ProceedToDescription(event) {
    this.isSelectionStage = false;
    this.isDescriptionStage = true;
  }

  public ProceedToSelection(event) {
    this.isSelectionStage = true;
    this.isDescriptionStage = false;

    setTimeout(() => {
      this.MarkCompleatedPages();
      this.valuesPageButtons.first.nativeElement.click();
    }, 800)
  }

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

    this.CheckIfStepIsFilledCorrectly();
    this.MarkCompleatedPages();
  }

  /**
   * If current group of important values has more than 2 items, mark visualy current page as compleated.
   * */
  public MarkCompleatedPages() {
    this.valuesPageButtons.forEach((vpb: any) => {
      if (this.valuesMarkedAsImportantGroupedByPerspectives.get(Number.parseInt(vpb.nativeElement.dataset.id)).length >= 3) {
        this._renderer2.addClass(vpb.nativeElement.firstChild, 'page-is-compleated');
        return;
      }

      this._renderer2.removeClass(vpb.nativeElement.firstChild, 'page-is-compleated');
    });
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.valueModalIsVisible = false;
  }

  public DisplayValueModal(event: any, value: ValueViewModel) {
    if (!this.valueModalIsVisible) {
      event.stopPropagation();
    }

    this.valueModalIsVisible = true;
    this.currentClickedValueCharacter = value.character;

    if ((event.target.firstChild.classList != undefined && event.target.firstChild.classList.contains('value-is-important') == true) || (event.target.classList != undefined && event.target.classList.contains('value-is-important') == true) || (event.target.parentElement.classList != undefined && event.target.parentElement.classList.contains('value-is-important') == true)) {
      this.currentClickedValueImportance = 'important';
    }
    else {
      this.currentClickedValueImportance = '';
    }
  }

  public CloseModal(event: MouseEvent) {
    this.valueModalIsVisible = false;
  }

  public GoToPreviousGroupPage(event: MouseEvent) {
    let currentPage: any = document.getElementsByClassName('currentPage')[0];

    if (currentPage.previousSibling.classList == undefined || !currentPage.previousSibling.classList.contains('values-page')) {
      return;
    }

    this._renderer2.removeClass(currentPage, 'currentPage');
    this._renderer2.addClass(currentPage.previousSibling, 'currentPage');
    this.ChangePage(null, Number.parseInt(currentPage.previousSibling.dataset.id), Number.parseInt(currentPage.previousSibling.dataset.index));
  }

  public GoToNextGroupPage() {
    let element: any = document.getElementsByClassName('currentPage')[0];

    if (element.nextSibling.classList == undefined || !element.nextSibling.classList.contains('values-page')) {
      return;
    }

    this._renderer2.removeClass(element, 'currentPage');
    this._renderer2.addClass(element.nextSibling, 'currentPage');
    this.ChangePage(null, Number.parseInt(element.nextSibling.dataset.id), Number.parseInt(element.nextSibling.dataset.index));
  }

  public ChangePage(event: MouseEvent, key: number, index: number) {
    this.currentGroupId = key;
    this.currentPageIndex = index + 1;
    this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
    this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
  }

  private DecideHowManyPagesToShow() {
    this.valuesGroupedByPerspectives.forEach((value, key) => {
      if (value.length > 3) {
        this.numberOfPagesToShow += 1;
        return;
      }

      if (this.currentSurveyStage != 'surveyThirdStage') {
        this.valuesGroupedByPerspectives.delete(key);
        return;
      }

      this.numberOfPagesToShow += 1;
    })
  }

  private GroupValues(values: Array<ValueViewModel>) {
    for (var i = 1; i <= AppSettingsService.NUMBER_OF_PERSPECTIVES; i++) {
      this.valuesGroupedByPerspectives.set(i, new Array<ValueViewModel>());
    }

    values.forEach(value => {
      this.valuesGroupedByPerspectives.get(value.perspectiveId).push(value);
    })
  }

}
