import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, ElementRef, HostListener, Injector, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  public descriptiveModeIsOn: boolean = true;
  @ViewChild('unselectedValuesContainer', { static: false })
  public lessImportantValuesList: ElementRef;
  public isSelectionStage: boolean = false;
  public isDescriptionStage: boolean = true;
  public stepIsFilledCorrectly: boolean = false;
  public currentValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();
  public currentImportantValuesGroup: Array<ValueViewModel> = new Array<ValueViewModel>();
  public arrayOfPages: Array<number> = new Array<number>();
  public surveyId: number;
  private startFromSelectionStage = false;


  constructor(private _dataService: DataService, private _renderer2: Renderer2, private _jwtHelper: JwtHelperService, private _router: Router) {
    let ne = _router.getCurrentNavigation().extras.state;

    if (ne != undefined && ne.startFromSelectionStage == true) {
      this.startFromSelectionStage = true;
    }
  }

  public ProceedToFirstStage(event) {
    if (window.confirm("You are about to leave this 2n step, if it has not been validated, your choices will not be saved.")) {
      this._dataService.DeleteSurveySecondStageResults(this.surveyId).subscribe(response => {
        this._router.navigate(['surveyFirstStage'], { state: { startFromValidationStep: true } });
      })
    }
  }

  public ScrollUpInUnselectedValuesContainer(event) {
    event.target.nextSibling.scrollBy({ top: -70, behavior: 'smooth' });
  }

  public ScrollDownInUnselectedValuesContainer(event) {
    event.target.previousSibling.scrollBy({ top: 70, behavior: 'smooth' });
  }

  public ScrollUpInSelectedValuesContainer(event) {
    event.target.nextSibling.scrollBy({ top: -50, behavior: 'smooth' });
  }

  public ScrollDownInSelectedValuesContainer(event) {
    event.target.previousSibling.scrollBy({ top: 50, behavior: 'smooth' });
  }

  private CalculateCurrentGroupId() {
    this.valuesGroupedByPerspectives.forEach((vl, k) => {
      if (this.currentGroupId > k) {
        this.currentGroupId = k;
      }
    });
  }

  ngOnInit() {
    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }

    if (localStorage.getItem('surveyId') == null || localStorage.getItem('surveyId') == undefined) {
      localStorage.setItem('personalAccountTabName', 'servey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }

    this._dataService.DecideToWhichStageToTransfer(this.surveyId).subscribe((response: any) => {
      if (response.body == 'surveyFirstStage') {
        this._router.navigate(['surveyFirstStage']);
      }
      else if (response.body == 'surveySecondStage') {
        this._dataService.GetFirstStageValues(this.surveyId).subscribe((response: any) => {
          this.values = response.body;
          this.GroupValues(this.values);


          this.valuesGroupedByPerspectives.forEach((value, key) => {
            this.valuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
            this.defaultValuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
          });


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

          if (this.startFromSelectionStage) {
            this.ProceedToSelection(null);
          }

        });
      }
      else if (response.body == 'surveyThirdStage') {
        this._dataService.GetFirstStageValues(this.surveyId).subscribe((getValuesForFirstStageResponse: any) => {
          if (getValuesForFirstStageResponse.ok) {
            this.values = getValuesForFirstStageResponse.body;
            this.GroupValues(this.values);

            //---------------------------------------------------------------------

            this.valuesGroupedByPerspectives.forEach((value, key) => {
              this.valuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
              this.defaultValuesMarkedAsImportantGroupedByPerspectives.set(key, new Array<ValueViewModel>());
            });


            this.MarkAsImportantGroupsWithLessThanFourItems();
            this.valuesGroupedByPerspectives.forEach((vl, k) => {
              if (vl.length >= 4) {
                this.arrayOfPages.push(k);
              }
            });

            this._dataService.GetSecondStageValues(this.surveyId).subscribe((response: any) => {
              let secondStageSelections: Array<ValueViewModel> = response.body;

              secondStageSelections.forEach(secondStageSelection => {
                this.valuesMarkedAsImportantGroupedByPerspectives.get(secondStageSelection.perspectiveId).push(secondStageSelection);
              });

              this.defaultValuesMarkedAsImportantGroupedByPerspectives.forEach((vl,i) => {
                if (vl.length > 0) {
                  this.valuesMarkedAsImportantGroupedByPerspectives.set(i, new Array<ValueViewModel>());
                } 
              })

              console.log(this.valuesMarkedAsImportantGroupedByPerspectives);

              this.valuesGroupedByPerspectives.forEach((v, k) => {
                this.valuesGroupedByPerspectives.set(k, new Array<ValueViewModel>());
              });

              this.values.forEach(v => {
                if (secondStageSelections.find(sss => sss.id == v.id) == null) {
                  if (this.valuesGroupedByPerspectives.get(v.perspectiveId) != undefined) {
                    this.valuesGroupedByPerspectives.get(v.perspectiveId).push(v);
                  }
                }
              })

            });

            this.DecideHowManyPagesToShow();

            this.CalculateCurrentGroupId();

            this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
            this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);



            this.stepIsFilledCorrectly = true;

            if (this.startFromSelectionStage) {
              this.ProceedToSelection(null);
            }

          }
        });
      }
      else {
        this._router.navigate(['wrap-up']);
      }
    });

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
      document.getElementById('to-next-step-button').scrollIntoView({ behavior: 'smooth' });
    }
    else {
      this.stepIsFilledCorrectly = false;
    }


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

    console.log(this.defaultValuesMarkedAsImportantGroupedByPerspectives);

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

    console.log(this.valuesMarkedAsImportantGroupedByPerspectives);
    console.log(this.defaultValuesMarkedAsImportantGroupedByPerspectives);

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

    console.log(this.defaultValuesMarkedAsImportantGroupedByPerspectives);
    setTimeout(() => {
      this.MarkCompleatedPages();
      this.valuesPageButtons.first.nativeElement.click();
    }, 800)
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
    this.MarkCompleatedPages();
  }

  public MarkCompleatedPages() {

    this.valuesPageButtons.forEach((vpb: any) => {
      if (this.valuesMarkedAsImportantGroupedByPerspectives.get(Number.parseInt(vpb.nativeElement.dataset.id)).length >= 3) {
        this._renderer2.addClass(vpb.nativeElement.firstChild, 'page-is-compleated');
      }
      else {
        this._renderer2.removeClass(vpb.nativeElement.firstChild, 'page-is-compleated');
      }
    });

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
    //let oldPageIndex = this.currentPageIndex;
    //this.currentPageIndex -= 1;
    let element: any = document.getElementsByClassName('currentPage')[0];


    if (element.previousSibling.classList != undefined && element.previousSibling.classList.contains('values-page')) {
      this._renderer2.removeClass(element, 'currentPage');
      this._renderer2.addClass(element.previousSibling, 'currentPage');
      this.ChangePage(null, Number.parseInt(element.previousSibling.dataset.id), Number.parseInt(element.previousSibling.dataset.index));
    }
    //else {
    //  this.currentPageIndex = oldPageIndex;
    //}
    //if (this.currentPageIndex > 1) {
    //  for (var i = this.currentGroupId - 1; i > 0; i--) {
    //    if (this.valuesGroupedByPerspectives.has(i)) {
    //      this.currentGroupId = i;
    //      break;
    //    }
    //  }
    //  this.currentPageIndex -= 1;

    //  this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
    //  this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
    //}
  }

  public GoToNextGroupPage() {
    //let oldPageIndex = this.currentPageIndex;
    //this.currentPageIndex += 1;
    let element: any = document.getElementsByClassName('currentPage')[0];

    if (element.nextSibling.classList != undefined && element.nextSibling.classList.contains('values-page')) {
      this._renderer2.removeClass(element, 'currentPage');
      this._renderer2.addClass(element.nextSibling, 'currentPage');
      this.ChangePage(null, Number.parseInt(element.nextSibling.dataset.id), Number.parseInt(element.nextSibling.dataset.index));
    }
    //else {
    //  this.currentPageIndex = oldPageIndex;
    //}
    //if (this.currentPageIndex <= this.numberOfPagesToShow) {
    //  for (var i = this.currentGroupId + 1; i <= AppSettingsService.NUMBER_OF_PERSPECTIVES; i++) {
    //    if (this.valuesGroupedByPerspectives.has(i)) {
    //      this.currentGroupId = i;
    //      break;
    //    }
    //  }
    //  this.currentPageIndex += 1;
    //  this.currentValuesGroup = this.valuesGroupedByPerspectives.get(this.currentGroupId);
    //  this.currentImportantValuesGroup = this.valuesMarkedAsImportantGroupedByPerspectives.get(this.currentGroupId);
    //}
  }

  public ChangePage(event: MouseEvent, key: number, index: number) {
    //event.stopPropagation();

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

    for (var i = 1; i <= AppSettingsService.NUMBER_OF_PERSPECTIVES; i++) {
      this.valuesGroupedByPerspectives.set(i, new Array<ValueViewModel>());
    }

    console.log(this.valuesGroupedByPerspectives);

    values.forEach(value => {
      this.valuesGroupedByPerspectives.get(value.perspectiveId).push(value);
    })
  }


}
