import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { count } from 'console';
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

  private valuesSelected: Array<ValueViewModel> = new Array<ValueViewModel>();
  public values: Array<ValueViewModel> = new Array<ValueViewModel>();
  public valuesGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();
  public valuesMarkedAsImportantGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();
  public defaultValuesMarkedAsImportantGroupedByPerspectives: Map<number, Array<ValueViewModel>> = new Map<number, Array<ValueViewModel>>();
  public numberOfPagesToShow: number = 0;
  public currentPageIndex: number = 1;
  public currentGroupId: number = 7;
  @ViewChildren('valuesPageButton')
  public valuesPageButtons: QueryList<ElementRef>;
  public valueModalIsVisible: boolean = false;
  public currentClickedValueCharacter: string;
  public currentClickedValueImportance: string = '';
  public descriptiveModeIsOn: boolean = false;
  @ViewChild('unselectedValuesContainer', { static: false })
  public lessImportantValuesList: ElementRef;
  public isSelectionStage: boolean = false;
  public isDescriptionStage: boolean = true;
  public stepIsFilledCorrectly: boolean = false;
  public currentValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();
  public currentImportantValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();
  public arrayOfPages: Array<number> = new Array<number>();
  public surveyId: number;


  constructor(private _dataService: DataService, private _renderer2: Renderer2, private _router: Router) {
    if (_router.getCurrentNavigation().extras.state != null) {
      this.values = _router.getCurrentNavigation().extras.state.values;
    }


    this.GroupValues(this.values);

    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    //TODO - change then to different method
    //this._dataService.GetAllValues(2).subscribe((response: any) => {
    //this.values = response.body;



    this.valuesGroupedByPerspectives.forEach((value, key) => {
      this.valuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
      this.defaultValuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
    });

    console.log(this.valuesGroupedByPerspectives);
    console.log(this.defaultValuesMarkedAsImportantGroupedByPerspectives);

    this.MarkAsImportantGroupsWithLessThanFourItems();
    this.valuesGroupedByPerspectives.forEach((vl, k) => {
      if (vl.length >= 4) {
        this.arrayOfPages.push(k);
      }
    });
    this.DecideHowManyPagesToShow();

    this.CalculateCurrentGroupId();

    this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
    this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);

    this.CalculateCurrentPage();

    console.log(this.valuesGroupedByPerspectives);
    console.log(this.defaultValuesMarkedAsImportantGroupedByPerspectives);
    console.log(this.currentValuesGroup);
    console.log(this.currentImportantValuesGroup);
    console.log(this.currentGroupId);
  }

  private CalculateCurrentPage() {
    let counter = 1;
    this.valuesGroupedByPerspectives.forEach((vl, k) => {
      if (k == this.currentGroupId) {
        this.currentPageIndex = counter;
      }
      else {
        counter += 1;
      }
    });
  }

  private CalculateCurrentGroupId() {
    this.valuesGroupedByPerspectives.forEach((vl, k) => {
      if (this.currentGroupId > k) {
        this.currentGroupId = k;
      }
    });
  }

  ngOnInit() {


    //});
  }

  private CheckIfStepIsFilledCorrectly() {

    let notEnoughtElements: boolean = false;

    for (var i = 1; i <= 6; i++) {
      if (!this.valuesGroupedByPerspectives.has(i)) {
        continue;
      }
      if (this.valuesMarkedAsImportantGroupedByPerspectives.get(i).length < 3) {
        notEnoughtElements = true;
      }

    }

    if (!notEnoughtElements) {
      this.stepIsFilledCorrectly = true;
    }
    else {
      this.stepIsFilledCorrectly = false;
    }

    console.log(this.stepIsFilledCorrectly);

  }

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

    console.log('unique');
    console.log(valuesToSafe);

    this._dataService.SaveSecondStageResults(new SurveySecondStageSaveRequestModel(valuesToSafe, this.surveyId)).subscribe(response => {
      let ne: NavigationExtras = {
        state: {
          values: valuesToSafe
        }
      }
      this._router.navigate(['surveyThirdStage'], ne);
    });
  }

  public ProceedToDescription(event) {
    this.isSelectionStage = false;
    this.isDescriptionStage = true;
  }

  public ProceedToSelection(event) {
    this.isSelectionStage = true;
    this.isDescriptionStage = false;
  }

  public MarkValueAsImportant(event: MouseEvent) {
    let valueToMove = this.valuesGroupedByPerspectives.get(this.currentGroupId).find(el => el.character == this.currentClickedValueCharacter);
    this.valuesGroupedByPerspectives.set(this.currentGroupId, this.valuesGroupedByPerspectives.get(this.currentGroupId).filter(v => v.character != this.currentClickedValueCharacter));
    this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId).push(valueToMove);
    this.valueModalIsVisible = false;
    this.CheckIfStepIsFilledCorrectly();
  }

  public MarkValueAsLessImportant(event: MouseEvent) {
    let valueToMove = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId).find(el => el.character == this.currentClickedValueCharacter);
    this.valuesMarkedAsImportantGroupedByPerspectives.set(this.currentGroupId, this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId).filter(v => v.character != this.currentClickedValueCharacter));
    this.valuesGroupedByPerspectives.get(this.currentGroupId).push(valueToMove);
    this.valueModalIsVisible = false;
    this.CheckIfStepIsFilledCorrectly();
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
    this.CheckIfStepIsFilledCorrectly();
  }

  public EnableDescriptiveMode(event: MouseEvent) {
    this.descriptiveModeIsOn = true;
    this._renderer2.setStyle(this.lessImportantValuesList.nativeElement, 'display', 'flex');
    this._renderer2.setStyle(this.lessImportantValuesList.nativeElement, 'flex-flow', 'column');
  }

  public DisableDescriptiveMode(event: MouseEvent) {
    this.descriptiveModeIsOn = false;
    this._renderer2.setStyle(this.lessImportantValuesList.nativeElement, 'display', 'block');
  }

  public DisplayValueModal(event: any, value: ValueViewModel) {
    this.valueModalIsVisible = true;
    this.currentClickedValueCharacter = value.character;
    if ((event.target.firstChild.classList != undefined && event.target.firstChild.classList.contains('value-is-important') == true) || (event.target.classList != undefined && event.target.classList.contains('value-is-important') == true) || (event.target.parentElement.classList != undefined && event.target.parentElement.classList.contains('value-is-important') == true)) {
      this.currentClickedValueImportance = 'important';
      console.log(this.currentClickedValueImportance);

    }
    else {
      this.currentClickedValueImportance = '';
      console.log(this.currentClickedValueImportance);

    }
  }

  public CloseModal(event: MouseEvent) {
    this.valueModalIsVisible = false;
  }

  public GoToPreviousGroupPage(event: MouseEvent) {
    if (this.currentPageIndex > 1) {
      for (var i = this.currentGroupId - 1; i > 0; i--) {
        if (this.valuesGroupedByPerspectives.has(i)) {
          this.currentGroupId = i;
          break;
        }
      }
      this.currentPageIndex -= 1;

      this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
      this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
    }
  }

  public GoToNextGroupPage() {
    if (this.currentPageIndex <= this.numberOfPagesToShow) {
      for (var i = this.currentGroupId + 1; i <= AppSettingsService.NUMBER_OF_PERSPECTIVES; i++) {
        if (this.valuesGroupedByPerspectives.has(i)) {
          this.currentGroupId = i;
          break;
        }
      }
      this.currentPageIndex += 1;
      this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
      this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
    }
  }

  public ChangePage(event: MouseEvent, key: number, index: number) {
    event.stopPropagation();
    this.currentGroupId = key;
    this.currentPageIndex = index + 1;
    this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
    this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
  }

  private DecideHowManyPagesToShow() {
    this.valuesGroupedByPerspectives.forEach((value, key) => {
      if (value.length > 3) {
        this.numberOfPagesToShow += 1;
      }
      else {
        value.forEach(v => {
          this.valuesSelected.push(v);
        });

        this.valuesGroupedByPerspectives.delete(key);
      }
    })
  }

  private GroupValues(values: Array<ValueViewModel>) {

    for (var i = 0; i < values.length; i++) {
      this.valuesGroupedByPerspectives.set(values[i].perspectiveId, new Array<ValueViewModel>());
    }

    values.forEach(value => {
      this.valuesGroupedByPerspectives.get(value.perspectiveId).push(value);
    })

    console.log(this.valuesGroupedByPerspectives);
  }

}
