import { ValueViewModel } from "./value-view-model";

export class SurveySecondStageSaveRequestModel {
  public values: Array<ValueViewModel>;
  public surveyId: number;

  constructor(values: Array<ValueViewModel>, surveyId: number) {
    this.values = values;
    this.surveyId = surveyId;
  }
}
