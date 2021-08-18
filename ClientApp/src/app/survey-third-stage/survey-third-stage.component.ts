import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../app-services/data-service';
import { SurveyThirdStageSaveRequestModel } from '../../view-models/survey-third-stage-save-request-model';
import { ValueViewModel } from '../../view-models/value-view-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-survey-third-stage',
  templateUrl: './survey-third-stage.component.html',
  styleUrls: ['./survey-third-stage.component.css'],
  providers: [DataService]
})
export class SurveyThirdStageComponent implements OnInit, AfterViewInit {

  public values: Array<ValueViewModel> = new Array<ValueViewModel>();

  //These arrays represent the rows in the prioritized box.
  public firstRowArray: Array<ElementRef> = new Array<ElementRef>();
  public secondRowArray: Array<ElementRef> = new Array<ElementRef>();
  public thirdRowArray: Array<ElementRef> = new Array<ElementRef>();
  public fourthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public fifthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public sixthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public seventhRowArray: Array<ElementRef> = new Array<ElementRef>();
  public eighthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public ninethRowArray: Array<ElementRef> = new Array<ElementRef>();

  public selectedValues: Array<ValueViewModel> = new Array<ValueViewModel>();

  public isDescriptionStage: boolean = true;
  public isSelectionStage: boolean = false;
  public isValidationStage: boolean = false;

  public numberOfValuesSelected: number = 0;
  public surveyId: number;
  private currentSurveyStage: string = '';

  public valueModalIsVisible: boolean = false;

  public currentClickedValueCharacter: string;


  constructor(private _dataService: DataService, private _renderer2: Renderer2, private _router: Router, private _jwtHelper: JwtHelperService) { }

  public GoToPreviousStep() {
    if (window.confirm("You are about to leave this 3rd step, if it has not been validated, your choices will not be saved.")) {
      this._router.navigate(['surveySecondStage'], { state: { startFromSelectionStage: true } });
    }
  }

  public ShuffleValues(values: Array<ValueViewModel>) {
    let valuesLength = values.length;
    let randomIndex = Math.floor(Math.random() * valuesLength);
    let oldValue = values[randomIndex];

    for (var i = 0; i < valuesLength; i++) {
      oldValue = values[randomIndex];
      values[randomIndex] = values[i];
      values[i] = oldValue;
      randomIndex = Math.floor(Math.random() * valuesLength);
    }
  }

  //TODO - to delete later.
  //public ScrollDownInUnselectedValuesContainer(event) {
  //  event.target.previousSibling.scrollBy({ top: 70, behavior: 'smooth' });

  //}

  //public ScrollUpInUnselectedValuesContainer(event) {
  //  event.target.nextSibling.scrollBy({ top: -70, behavior: 'smooth' });
  //}

  public DisplayValueModal(event: any, value: ValueViewModel) {
    if (!this.valueModalIsVisible) {
      event.stopPropagation();
    }

    this.valueModalIsVisible = true;
    this.currentClickedValueCharacter = value.character;
  }

  @HostListener('document:click', ['$event'])
  public OnDocumentClicked(event) {
    this.valueModalIsVisible = false;
  }

  public UploadSurveyResults() {
    this._dataService.SaveThirdStageResults(new SurveyThirdStageSaveRequestModel(this.selectedValues, this.surveyId)).subscribe(response => {
      localStorage.setItem('personalAccountTabName', 'my-account-section');
      this._router.navigate(['personalAccount']);
    });
  }

  private MoveItemFromPrioritizedValuesBoxToImportantValuesBox(event: CdkDragDrop<any[], any[]>) {
    let prevData = new Array<any>(event.previousContainer.data.pop());
    event.container.data.push(prevData[0]);
    this.numberOfValuesSelected -= 1;
  }

  private UserIsAttemptingToTransferTheElementFromPrioritizedValuesBoxToImportantValuesBox(event: CdkDragDrop<any[], any[]>): boolean {
    if (event.container.id == 'important-values-box' && event.previousContainer.id != 'important-values-box') {
      return true;
    }

    return false;
  }

  private UserIsAttemptingToTransferTheElementFromImportantValuesBoxToPrioritizedValuesBox(event: CdkDragDrop<any[], any[]>): boolean {
    if (event.container.data.length == 0) {
      return true;
    }

    return false;
  }

  private MoveItemFromImportantValuesBoxToPrioritizedValuesBox(event: CdkDragDrop<any[], any[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    if (event.previousContainer.id == 'important-values-box' && event.container.id != 'important-values-box') {
      this.numberOfValuesSelected += 1;
    }
  }

  private ReorderPrioritizedValuesBox(event: CdkDragDrop<any[], any[]>) {
    let prevData = new Array<any>([event.container.data.pop()]);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    transferArrayItem(
      prevData[0],
      event.previousContainer.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    if (this.UserIsAttemptingToTransferTheElementFromPrioritizedValuesBoxToImportantValuesBox(event)) {
      this.MoveItemFromPrioritizedValuesBoxToImportantValuesBox(event);
      return;
    }

    if (this.UserIsAttemptingToTransferTheElementFromImportantValuesBoxToPrioritizedValuesBox(event)) {
      this.MoveItemFromImportantValuesBoxToPrioritizedValuesBox(event);
      return;
    }

    this.ReorderPrioritizedValuesBox(event);
  }

  public GoToSelectionStage() {
    this.isSelectionStage = true;
    this.isValidationStage = false;
    this.isDescriptionStage = false;
  }

  public GoToDescriptionStage() {
    this.isSelectionStage = false;
    this.isDescriptionStage = true;
    this.isValidationStage = false;
  }

  /**
   * Proceeds to validation stage and populates the selected values list, with values from the prioritized box rows.
   * */
  public GoToValidationStage() {
    this.isSelectionStage = false;
    this.isDescriptionStage = false;
    this.isValidationStage = true;

    this.selectedValues = new Array<ValueViewModel>();

    this.selectedValues.push(new ValueViewModel((<any>this.firstRowArray[0]).id, (<any>this.firstRowArray[0]).character, 0, 0, null, 1));
    this.selectedValues.push(new ValueViewModel((<any>this.secondRowArray[0]).id, (<any>this.secondRowArray[0]).character, 0, 0, null, 2));
    this.selectedValues.push(new ValueViewModel((<any>this.thirdRowArray[0]).id, (<any>this.thirdRowArray[0]).character, 0, 0, null, 3));
    this.selectedValues.push(new ValueViewModel((<any>this.fourthRowArray[0]).id, (<any>this.fourthRowArray[0]).character, 0, 0, null, 4));
    this.selectedValues.push(new ValueViewModel((<any>this.fifthRowArray[0]).id, (<any>this.fifthRowArray[0]).character, 0, 0, null, 5));
    this.selectedValues.push(new ValueViewModel((<any>this.sixthRowArray[0]).id, (<any>this.sixthRowArray[0]).character, 0, 0, null, 6));
    this.selectedValues.push(new ValueViewModel((<any>this.seventhRowArray[0]).id, (<any>this.seventhRowArray[0]).character, 0, 0, null, 7));
    this.selectedValues.push(new ValueViewModel((<any>this.eighthRowArray[0]).id, (<any>this.eighthRowArray[0]).character, 0, 0, null, 8));
    this.selectedValues.push(new ValueViewModel((<any>this.ninethRowArray[0]).id, (<any>this.ninethRowArray[0]).character, 0, 0, null, 9));
  }

  ngAfterViewInit(): void {

  }

  private AssureThatUserIsAuthorized() {
    if (localStorage.getItem('jwt') == null || this._jwtHelper.isTokenExpired(localStorage.getItem('jwt'))) {
      this._router.navigate(['authorizationPage']);
    }
  }

  private AssureThatSurveyIdIsValid() {
    if (localStorage.getItem('surveyId') == null || localStorage.getItem('surveyId') == undefined) {
      localStorage.setItem('personalAccountTabName', 'survey-results-and-reports-section');
      this._router.navigate(['personalAccount']);
    }
  }

  ngOnInit() {
    this.surveyId = Number.parseInt(localStorage.getItem('surveyId'));

    this.AssureThatUserIsAuthorized();

    this.AssureThatSurveyIdIsValid();

    this._dataService.DecideToWhichStageToTransfer(this.surveyId).pipe(switchMap((decideToWhichStageToTransferResponse: any) => {
      this.currentSurveyStage = decideToWhichStageToTransferResponse.body;

      if (this.currentSurveyStage == 'surveyFirstStage' || this.currentSurveyStage == 'surveySecondStage' || this.currentSurveyStage == 'wrap-up') {
        return of(this.currentSurveyStage);
      }

      return this._dataService.GetTheCurrentStageValues(this.surveyId);
    })).subscribe((secondBlockResponse: any) => {
      //If we are not supposed to be at this stage, just redirect to the needed stage.
      if (typeof secondBlockResponse == 'string') {
        this._router.navigate([secondBlockResponse]);
        return;
      }

      this.values = secondBlockResponse.body;
      this.ShuffleValues(this.values);
    });
  }

}
