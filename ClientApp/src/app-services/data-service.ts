import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenderViewModel } from "../view-models/gender-view-model";
import { LanguageViewModel } from "../view-models/language-view-model";
import { OrderViewModel } from "../view-models/order-view-model";
import { PractitionersSearchFilterViewModel } from "../view-models/practitioners-search-filter-view-model";
import { RegionViewModel } from "../view-models/region-view-model";
import { SurveyFirstStageSaveRequestModel } from "../view-models/survey-first-stage-save-request-model";
import { SurveySecondStageSaveRequestModel } from "../view-models/survey-second-stage-save-request-model";
import { SurveyThirdStageSaveRequestModel } from "../view-models/survey-third-stage-save-request-model";
import { ValueViewModel } from "../view-models/value-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class DataService {

  private url: string = AppSettingsService.CURRENT_DOMAIN;


  constructor(private http: HttpClient) { }

  public GeneratePdf(html: string) {
    return this.http.post(`https://${this.url}/Data/GeneratePdf`, `\'${html}\'`, { observe: 'body', responseType: 'blob', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public GetAllValues(surveyId: number) {
    console.log('ID' + surveyId);
    return this.http.get(`https://${this.url}/Data/GetAllValues`, { observe: 'response', params: { surveyId: `${surveyId}` } });
  }

  public GetAllValuesFromTheFirstStage(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetAllValuesFromTheFirstStage?surveyId=${surveyId}`, { observe: 'response' });
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

  public CheckIfCodeIsValid(code: string) {
    return this.http.get(`https://${this.url}/Data/CheckIfCodeIsValid?code=${code}`, { observe: 'response' });
  }

  public GetAllCertifications() {
    return this.http.get(`https://${this.url}/Data/GetAllCertifications`, { observe: 'response' });
  }

  public GetPractitionersCertifications(userId: string) {
    return this.http.get(`https://${this.url}/Data/GetPractitionersCertifications?userId=${userId}`, { observe: 'response' });
  }

  public GetMembershipStatus() {
    return this.http.get(`https://${this.url}/Data/GetMembershipStatus`, { observe: 'response' });
  }

  public RenewMembership() {
    return this.http.get(`https://${this.url}/Data/RenewMembership`, { observe: 'response' });
  }

  public GetPractitionersForDirectory(practitionersSearchFilterViewModel: PractitionersSearchFilterViewModel) {

      //.set('languagesSelected', JSON.stringify(languagesSelected))
      //.set('geographicalLocationsSelected', JSON.stringify(geographicalLocationsSelected))
      //.set('genderSelected', JSON.stringify(genderSelected));

    return this.http.post(`https://${this.url}/Data/GetPractitionersForDirectory`, practitionersSearchFilterViewModel, { observe: 'response' });
  }

  public ReturnNumberOfPractitioners() {
    return this.http.get(`https://${this.url}/Data/ReturnNumberOfPractitioners`, { observe: 'response' });
  }


  public GetValuesSelectionsAtDifferentSurveyStages(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetValuesSelectionsAtDifferentSurveyStages?surveyId=${surveyId}`, { observe: 'response' });
  }

}
