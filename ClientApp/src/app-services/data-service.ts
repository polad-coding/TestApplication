import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderViewModel } from "../view-models/order-view-model";
import { SurveyFirstStageSaveRequestModel } from "../view-models/survey-first-stage-save-request-model";
import { SurveySecondStageSaveRequestModel } from "../view-models/survey-second-stage-save-request-model";
import { SurveyThirdStageSaveRequestModel } from "../view-models/survey-third-stage-save-request-model";
import { ValueViewModel } from "../view-models/value-view-model";

@Injectable()
export class DataService {
  private url: string = 'somefreedomain.ml';


  constructor(private http: HttpClient) { }

  public GetAllValues(surveyId: number) {
    console.log('ID' + surveyId);
    return this.http.get(`https://${this.url}/Data/GetAllValues`, { observe: 'response', params: { surveyId: `${surveyId}` } });
  }

  public GetAllValuesFromTheFirstStage(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetAllValuesFromTheFirstStage/${surveyId}`, { observe: 'response' });
  }

  public SaveFirstStageResults(surveyFirstStageSaveRequestModel: SurveyFirstStageSaveRequestModel) {
    return this.http.post(`https://${this.url}/Data/SaveFirstStageResults`, surveyFirstStageSaveRequestModel, { observe: 'response' });
  }

  public SaveSecondStageResults(surveySecondStageSaveRequestModel: SurveySecondStageSaveRequestModel) {
    return this.http.post(`https://${this.url}/Data/SaveSecondStageResults`, surveySecondStageSaveRequestModel, { observe: 'response' });
  }

  public SaveThirdStageResults(surveyThirdStageSaveRequestModel: SurveyThirdStageSaveRequestModel) {
    console.log('here');
    console.log(surveyThirdStageSaveRequestModel);
    return this.http.post(`https://${this.url}/Data/SaveThirdStageResults`, surveyThirdStageSaveRequestModel, { observe: 'response' });
  }

  public GetTheRelativeWeightOfThePerspectives(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetTheRelativeWeightOfThePerspectives?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSurveyThirdStageResults(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetSurveyThirdStageResults?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GenerateCodesForTheUser(codesList: Array<OrderViewModel>) {
    return this.http.post(`https://${this.url}/Data/GenerateCodes`, codesList, { observe: 'response' });
  }

  public GetSurveyResults() {
    return this.http.get(`https://${this.url}/Data/GetSurveyResults`, { observe: 'response' });
  }

  public GetTheCurrentStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetTheCurrentStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public DecideToWhichStageToTransfer(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/DecideToWhichStageToTransfer?surveyId=${surveyId}`, { observe: 'response', responseType:'text' });
  }

}
