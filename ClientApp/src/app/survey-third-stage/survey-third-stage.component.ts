import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../app-services/data-service';
import { SurveyThirdStageSaveRequestModel } from '../../view-models/survey-third-stage-save-request-model';
import { ValueViewModel } from '../../view-models/value-view-model';
import { CdkDragDrop, moveItemInArray, transferArrayItem  } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-survey-third-stage',
  templateUrl: './survey-third-stage.component.html',
  styleUrls: ['./survey-third-stage.component.css'],
  providers: [DataService]
})
export class SurveyThirdStageComponent implements OnInit, AfterViewInit {

  public values: Array<ValueViewModel> = new Array<ValueViewModel>();
  public firstRowArray: Array<ElementRef> = new Array<ElementRef>();
  public secondRowArray: Array<ElementRef> = new Array<ElementRef>();
  public thirdRowArray: Array<ElementRef> = new Array<ElementRef>();
  public fourthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public fifthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public sixthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public seventhRowArray: Array<ElementRef> = new Array<ElementRef>();
  public eighthRowArray: Array<ElementRef> = new Array<ElementRef>();
  public ninethRowArray: Array<ElementRef> = new Array<ElementRef>();
  public currentIndex: number = 0;
  //public currentClickedValueCharacter: string;
  public descriptiveModeIsOn: boolean = false;
  @ViewChildren('valueContainers')
  public valueContainers: QueryList<ElementRef>;
  public selectedValues: Array<ValueViewModel> = new Array<ValueViewModel>();
  public isDescriptionStage: boolean = true;
  public isSelectionStage: boolean = false;
  public isValidationStage: boolean = false;
  public numberOfValuesSelected: number = 0;

  constructor(private _dataService: DataService, private _renderer2: Renderer2, private _router: Router) {
    if (_router.getCurrentNavigation().extras.state != null) {
      this.values = _router.getCurrentNavigation().extras.state.values;
    }
  }

  public GoToPreviousStep() {
    if (window.confirm("Are you sure you want to leave the stage uncompleated, all your choises will be lost.")) {
        this._router.navigate(['surveySecondStage']);
    }
  }

  public UploadSurveyResults() {
    console.log(this.selectedValues);
    this._dataService.SaveThirdStageResults(new SurveyThirdStageSaveRequestModel(this.selectedValues, Number.parseInt(localStorage.getItem('surveyId')))).subscribe(response => {
      localStorage.setItem('personalAccountTabName', 'my-account-section');
      this._router.navigate(['personalAccount']);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.debug('1');
    } else {
      if (event.container.id == 'important-values-box' && event.previousContainer.id != 'important-values-box') {
        let prevData = new Array<any>(event.previousContainer.data[0]);
        event.previousContainer.data.pop();
        console.info(prevData[0]);
        event.container.data.push(prevData[0]);
        this.numberOfValuesSelected -= 1;
      }
      else if (event.container.data.length > 0) {
        let prevData = new Array<any>([event.container.data[0]]);
        event.container.data.pop();
        console.debug('2');
        console.debug(prevData);
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);

        transferArrayItem(prevData[0],
          event.previousContainer.data,
          event.previousIndex,
          event.currentIndex);
      }
      else {

        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);

        if (event.previousContainer.id == 'important-values-box' && event.container.id != 'important-values-box') {
          this.numberOfValuesSelected += 1;
        }

      }
    }


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

  public GoToValidationStage() {
    this.isSelectionStage = false;
    this.isDescriptionStage = false;
    this.isValidationStage = true;
    this.selectedValues = new Array<ValueViewModel>();
    this.selectedValues.push(new ValueViewModel((<any>this.firstRowArray[0]).id,  (<any>this.firstRowArray[0]).character, 0, 0, null, 1));
    this.selectedValues.push(new ValueViewModel((<any>this.secondRowArray[0]).id, (<any>this.secondRowArray[0]).character, 0, 0, null, 2));
    this.selectedValues.push(new ValueViewModel((<any>this.thirdRowArray[0]).id,  (<any>this.thirdRowArray[0]).character, 0, 0, null, 3));
    this.selectedValues.push(new ValueViewModel((<any>this.fourthRowArray[0]).id, (<any>this.fourthRowArray[0]).character, 0, 0, null, 4));
    this.selectedValues.push(new ValueViewModel((<any>this.fifthRowArray[0]).id,  (<any>this.fifthRowArray[0]).character, 0, 0, null, 5));
    this.selectedValues.push(new ValueViewModel((<any>this.sixthRowArray[0]).id,  (<any>this.sixthRowArray[0]).character, 0, 0, null, 6));
    this.selectedValues.push(new ValueViewModel((<any>this.seventhRowArray[0]).id,(<any>this.seventhRowArray[0]).character, 0, 0, null, 7));
    this.selectedValues.push(new ValueViewModel((<any>this.eighthRowArray[0]).id, (<any>this.eighthRowArray[0]).character, 0, 0, null, 8));
    this.selectedValues.push(new ValueViewModel((<any>this.ninethRowArray[0]).id, (<any>this.ninethRowArray[0]).character, 0, 0, null, 9));
    console.log(this.selectedValues);

  }

    ngAfterViewInit(): void {
      this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement, 'border-top', '2px solid #006F91');
      this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement, 'border-bottom', '2px solid #006F91');
      this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }

  ngOnInit() {
    this._dataService.DecideToWhichStageToTransfer(Number.parseInt(localStorage.getItem('surveyId'))).subscribe(response => {
      if (response.body == 'wrap-up') {
        this._router.navigate(['wrap-up']);
      }
      else if (response.body == 'surveyThirdStage') {
        if (this.values.length == 0) {
          this._dataService.GetTheCurrentStageValues(Number.parseInt(localStorage.getItem('surveyId'))).subscribe((response: any) => {
            this.values = response.body;
            console.log(this.values);
          });
        }
      }
      else if (response.body == 'surveySecondStage') {
        this._router.navigate(['surveySecondStage']);
      }
      else {
        this._router.navigate(['surveyFirstStage']);
      }
    });

  }



  public TurnOnDescriptiveMode() {
    this.descriptiveModeIsOn = true;
    this.valueContainers.forEach(vc => {
      this._renderer2.setStyle(vc.nativeElement, 'margin-right', '20px');
      this._renderer2.setStyle(vc.nativeElement, 'margin-bottom', '0px');
    });
  }

  public Drag(event) {
    event.dataTransfer.setData('id', event.target.dataset.id);
    event.dataTransfer.setData('index', event.target.dataset.index);
    event.dataTransfer.setData('title', event.target.dataset.title);
    event.dataTransfer.setData('character', event.target.dataset.character);
    event.dataTransfer.setData('class', event.target.className);
  }

  public DragOver(event: MouseEvent) {
    event.preventDefault();
  }

  private ReplaceValueFromTableWithValueFromList(event) {
    //get value from selected values
    let oldValue = null;
    let priority: any;

    //replace the values and remove the new value from list, add new value to the selected values
    if (event.target.nodeName == 'P') {
      oldValue = this.selectedValues.find(v => v.character == event.target.parentNode.firstChild.innerText);
      event.target.parentNode.firstChild.innerText = event.dataTransfer.getData("character");
      event.target.parentNode.lastChild.innerText = event.dataTransfer.getData("title");
      this.selectedValues = this.selectedValues.filter(v => v.id != oldValue.id);
      priority = event.target.parentNode.dataset.priority;
      event.target.parentNode.setAttribute('data-id', event.dataTransfer.getData("id"));
      event.target.parentNode.setAttribute('data-index', event.dataTransfer.getData("index"));
      event.target.parentNode.setAttribute('data-title', event.dataTransfer.getData("title"));
      event.target.parentNode.setAttribute('data-character', event.dataTransfer.getData("character"));
    }
    else {
      oldValue = this.selectedValues.find(v => v.character == event.target.firstChild.innerText);
      event.target.firstChild.innerText = event.dataTransfer.getData("character");
      event.target.lastChild.innerText = event.dataTransfer.getData("title");
      this.selectedValues = this.selectedValues.filter(v => v.id != oldValue.id);
      priority = event.target.dataset.priority;
      event.target.setAttribute('data-id', event.dataTransfer.getData("id"));
      event.target.setAttribute('data-index', event.dataTransfer.getData("index"));
      event.target.setAttribute('data-title', event.dataTransfer.getData("title"));
      event.target.setAttribute('data-character', event.dataTransfer.getData("character"));
    }

    this.values = this.values.filter(v => v.id != event.dataTransfer.getData("id"));
    this.values.push(new ValueViewModel(Number.parseInt(oldValue.id), oldValue.character, undefined, undefined, false, undefined));
    this.values = this.values.sort((a, b) => a.id - b.id);

    console.log('priority' + ' ' + priority);

    priority = Number.parseInt(priority);

    this.selectedValues.push(new ValueViewModel(Number.parseInt(event.dataTransfer.getData("id")), event.dataTransfer.getData("character"), undefined, undefined, false, priority));
    //add old value to the list

    console.log(this.values);
    console.log(this.selectedValues);

  }

  private CheckIfDroppedFromTableToList(event) {
    if (event.target.parentNode.parentNode.id == 'values-bar') {
      return true;
    }
    return false;
  }

  private PlaceTableValueBackToList(event) {
    this.values.push(new ValueViewModel(Number.parseInt(event.dataTransfer.getData("id")), event.dataTransfer.getData("character"), undefined, undefined, false, undefined))
    this.values = this.values.sort((a, b) => a.id - b.id);

    //remove value from table row and reset attributes
    let elements = document.getElementsByClassName('table-cell');

    let currentElement;
    for (var i = 0; i < elements.length; i++) {
      let e: any = elements[i];
      if (e.dataset.id == event.dataTransfer.getData("id")) {
        currentElement = elements[i];
        break;
      }
    }

    this.selectedValues = this.selectedValues.filter(v => v.id != event.dataTransfer.getData("id"));
    currentElement.firstChild.innerText = null;
    currentElement.lastChild.innerText = null;
    currentElement.removeAttribute('data-id');
    currentElement.removeAttribute('data-index');
    currentElement.removeAttribute('data-title');
    currentElement.removeAttribute('data-character');

  }

  private CheckIfThereIsAnAttemptToReorderTheTable(event): boolean{
    if (event.target.parentNode.className == 'table-cell' && event.dataTransfer.getData("class") == 'table-cell' || event.target.className == 'table-cell' && event.dataTransfer.getData("class") == 'table-cell') {
      return true;
    }
    return false;
  }

  private ReorderTable(event) {
    let secondElement;
    if (event.target.nodeName == 'P') {
      secondElement = event.target.parentNode;
    }
    else {
      secondElement = event.target;
    }


    let tableCells = document.getElementsByClassName('table-cell');

    for (var i = 0; i < tableCells.length; i++) {
      if ((<any>tableCells[i]).dataset.id == event.dataTransfer.getData("id")) {
        if (secondElement.dataset.id != undefined) {
          tableCells[i].setAttribute('data-id', secondElement.dataset.id);
          tableCells[i].setAttribute('data-index', secondElement.dataset.index);
          tableCells[i].setAttribute('data-title', secondElement.dataset.title);
          tableCells[i].setAttribute('data-character', secondElement.dataset.character);
          (<any>tableCells[i].firstChild).innerText = secondElement.dataset.character;
          (<any>tableCells[i].lastChild).innerText = secondElement.dataset.title;
        }
        else {
          tableCells[i].removeAttribute('data-id');
          tableCells[i].removeAttribute('data-title');
          tableCells[i].removeAttribute('data-index');
          tableCells[i].removeAttribute('data-character');
          (<any>tableCells[i].firstChild).innerText = null;
          (<any>tableCells[i].lastChild).innerText = null;
        }

        break;
      }
    }


    secondElement.setAttribute('data-id', event.dataTransfer.getData("id"));
    secondElement.setAttribute('data-index', event.dataTransfer.getData("index"));
    secondElement.setAttribute('data-title', event.dataTransfer.getData("title"));
    secondElement.setAttribute('data-character', event.dataTransfer.getData("character"));
    secondElement.firstChild.innerText = event.dataTransfer.getData("character");
    secondElement.lastChild.innerText = event.dataTransfer.getData("title");

  }

  private CheckForListReorderingAttempt(event): boolean {
    if (event.target.parentNode.parentNode.id == 'values-bar') {
      let valueContainers = document.getElementsByClassName('value-container');

      for (var i = 0; i < valueContainers.length; i++) {
        if ((<any>valueContainers[i]).dataset.id == event.dataTransfer.getData("id")) {
          return true;
        }
      }
    }

    return false;
  }

  public Drop(event) {
    if (this.CheckIfThereIsAnAttemptToReorderTheTable(event) == true) {
      console.log('3');
      this.ReorderTable(event);
      this.ReorganizeTableArray();
    }
    else if (this.CheckForListReorderingAttempt(event) == true) {
      return;
    }
    else if (this.CheckIfDroppedFromTableToList(event) == true) {
      console.log('2');
      this.PlaceTableValueBackToList(event);
      this.ReorganizeTableArray();
    }
    else if (this.CheckIfCellHasAValue(event) == true) {
      console.log('1');
      this.ReplaceValueFromTableWithValueFromList(event);
    }

    else {
      let priority :any;
      if (event.target.nodeName == 'P') {
        console.log('here');
        //this.values.push(new ValueViewModel(event.target.))
        event.target.parentNode.firstChild.innerText = event.dataTransfer.getData("character");
        event.target.parentNode.lastChild.innerText = event.dataTransfer.getData("title");
        priority = event.target.parentNode.dataset.priority;
        event.target.parentNode.setAttribute('data-id', event.dataTransfer.getData("id"));
        event.target.parentNode.setAttribute('data-index', event.dataTransfer.getData("index"));
        event.target.parentNode.setAttribute('data-title', event.dataTransfer.getData("title"));
        event.target.parentNode.setAttribute('data-character', event.dataTransfer.getData("character"));
      }
      else {
        console.log('here2');
        event.target.firstChild.innerText = event.dataTransfer.getData("character");
        event.target.lastChild.innerText = event.dataTransfer.getData("title");
        priority = event.target.dataset.priority;
        event.target.setAttribute('data-id', event.dataTransfer.getData("id"));
        event.target.setAttribute('data-index', event.dataTransfer.getData("index"));
        event.target.setAttribute('data-title', event.dataTransfer.getData("title"));
        event.target.setAttribute('data-character', event.dataTransfer.getData("character"));
      }


      //TODO - bug here when droping one value from list to the other value from the table

      let elements = document.getElementsByClassName('value-container');

      this.values = this.values.filter(v => v.id != event.dataTransfer.getData("id"));
      priority = Number.parseInt(priority);

      console.log('priority' + ' ' + priority);

      this.selectedValues.push(new ValueViewModel(Number.parseInt(event.dataTransfer.getData("id")), event.dataTransfer.getData("character"), undefined, undefined, false, priority));
      this.selectedValues = this.selectedValues.sort(v => v.priority);
    }

    console.debug(this.selectedValues);
    console.debug(this.values);
  }

  private CheckIfCellHasAValue(event): boolean {
    if (event.target.nodeName == 'P' && event.target.innerText.length != 0 && event.target.parentNode.parentNode.id != 'values-bar') {
      return true;
    }
    else if (event.target.nodeName == 'LI' && event.target.firstChild.innerText.length != 0 && event.target.parentNode.id != 'values-bar') {
      return true;
    }

    return false;
  }

  private ReorganizeTableArray() {
    this.selectedValues = new Array<ValueViewModel>();
    let tableCells = document.getElementsByClassName('table-cell');

    for (var i = 0; i < tableCells.length; i++) {
      if ((<any>tableCells[i]).dataset.id != undefined) {
        let s = Number.parseInt((<any>tableCells[i]).dataset.priority);
        console.log('priority' + ' ' + s);

        this.selectedValues.push(new ValueViewModel((<any>tableCells[i]).dataset.id, (<any>tableCells[i]).dataset.character, undefined, undefined, false, s));
      }
    }
  }

  public TurnOffDescriptiveMode() {
    this.descriptiveModeIsOn = false;
    this.valueContainers.forEach(vc => {
      this._renderer2.setStyle(vc.nativeElement, 'margin-right', '2px');
    });
  }

  public SelectPrevValue(event: MouseEvent) {
    if (this.currentIndex >= 1) {
      this.SelectNewValue(event, this.currentIndex - 1);
    }
  }

  public SelectNextValue(event: MouseEvent) {
    if (this.currentIndex < this.values.length - 1) {
      this.SelectNewValue(event, this.currentIndex + 1);
    }
  }

  private SelectNewValue(mouseEvent: MouseEvent, valueId) {
    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement, 'border', 'none');
    //Focus new element
    this.currentIndex = valueId;
    this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement, 'border-top', '2px solid #006F91');
    this._renderer2.setStyle(this.valueContainers.find(el => el.nativeElement.dataset.index == this.currentIndex).nativeElement, 'border-bottom', '2px solid #006F91');
  }



}
