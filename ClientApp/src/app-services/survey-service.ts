import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderViewModel } from "../view-models/order-view-model";
import { SurveyFirstStageSaveRequestModel } from "../view-models/survey-first-stage-save-request-model";
import { SurveySecondStageSaveRequestModel } from "../view-models/survey-second-stage-save-request-model";
import { SurveyThirdStageSaveRequestModel } from "../view-models/survey-third-stage-save-request-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class SurveyService {
  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public CreateSurveys(orders: OrderViewModel) {
    return this.http.post(`https://${this.url}/Survey/CreateSurveys`, orders, { observe: 'response' });
  }

  public SaveFirstStageResults(surveyFirstStageSaveRequestModel: SurveyFirstStageSaveRequestModel) {
    return this.http.post(`https://${this.url}/Survey/SaveFirstStageResults`, surveyFirstStageSaveRequestModel, { observe: 'response' });
  }

  public SaveSecondStageResults(surveySecondStageSaveRequestModel: SurveySecondStageSaveRequestModel) {
    return this.http.post(`https://${this.url}/Survey/SaveSecondStageResults`, surveySecondStageSaveRequestModel, { observe: 'response' });
  }

  public SaveThirdStageResults(surveyThirdStageSaveRequestModel: SurveyThirdStageSaveRequestModel) {
    return this.http.post(`https://${this.url}/Survey/SaveThirdStageResults`, surveyThirdStageSaveRequestModel, { observe: 'response' });
  }

  public GetTheRelativeWeightOfThePerspectives(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetTheRelativeWeightOfThePerspectives?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSurveyThirdStageResults(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetSurveyThirdStageResults?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSurveysOfTheGivenUser(userId: string) {
    if (userId != null) {
      return this.http.get(`https://${this.url}/Survey/GetSurveysOfTheGivenUser?userId=${userId}`, { observe: 'response' });
    }

    return this.http.get(`https://${this.url}/Survey/GetSurveysOfTheGivenUser`, { observe: 'response' });
  }

  public GetValuesForFirstStage(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetValuesForFirstStage?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetFirstStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetFirstStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSecondStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetSecondStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetThirdStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetThirdStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public DecideToWhichStageToTransfer(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/DecideToWhichStageToTransfer?surveyId=${surveyId}`, { observe: 'response', responseType: 'text' });
  }

  public GetValuesSelectionsAtDifferentSurveyStages(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetValuesSelectionsAtDifferentSurveyStages?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetParticularSurveyResults(surveyId: number) {
    return this.http.get(`https://${this.url}/Survey/GetParticularSurveyResults?surveyId=${surveyId}`, { observe: 'response' });
  }

  public DeleteSurveyFirstStageResults(surveyId: number) {
    return this.http.post(`https://${this.url}/Survey/DeleteSurveyFirstStageResults`, `\'${surveyId}\'`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public DeleteSurveySecondStageResults(surveyId: number) {
    return this.http.post(`https://${this.url}/Survey/DeleteSurveySecondStageResults`, `\'${surveyId}\'`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public GoToPreviousStageOfTheSurvey(surveyId: number) {
    this.http.post(`https://${this.url}/Survey/GoToPreviousStageOfTheSurvey`, surveyId, { observe: 'response' });
  }
}
