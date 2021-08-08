import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AssociatedCouponViewModel } from "../view-models/associated-coupon-view-model";
import { GenderViewModel } from "../view-models/gender-view-model";
import { GeneralCouponViewModel } from "../view-models/general-coupon-view-model";
import { LanguageViewModel } from "../view-models/language-view-model";
import { MessageViewModel } from "../view-models/message-view-model";
import { OrderViewModel } from "../view-models/order-view-model";
import { PractitionersSearchFilterViewModel } from "../view-models/practitioners-search-filter-view-model";
import { RegionViewModel } from "../view-models/region-view-model";
import { ReportHTMLContentViewModel } from "../view-models/report-html-content-view-model";
import { SurveyFirstStageSaveRequestModel } from "../view-models/survey-first-stage-save-request-model";
import { SurveySecondStageSaveRequestModel } from "../view-models/survey-second-stage-save-request-model";
import { SurveyThirdStageSaveRequestModel } from "../view-models/survey-third-stage-save-request-model";
import { TransferCodesViewModel } from "../view-models/transfer-codes-view-model";
import { ValueViewModel } from "../view-models/value-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class DataService {

  private url: string = AppSettingsService.CURRENT_DOMAIN;


  constructor(private http: HttpClient) { }

//  Task<List<ValueModel>> GetValuesForFirstStageAsync(int surveyId);
//Task < List < ValueModel >> GetFirstStageValuesAsync(int surveyId);
//Task < List < ValueModel >> GetSecondStageValuesAsync(int surveyId);

  public GetMembershipStatusOfTheUser(userId: string) {
    return this.http.get(`https://${this.url}/Data/GetMembershipStatusOfTheUser?userId=${userId}`, { observe: 'response' });
  }

  public CreateAssociatedCoupon(associatedCoupon: AssociatedCouponViewModel) {
    return this.http.post(`https://${this.url}/Data/CreateAssociatedCoupon`, associatedCoupon, { observe: 'response' });
  }

  public DeleteSurveyFirstStageResults(surveyId: number) {
    return this.http.post(`https://${this.url}/Data/DeleteSurveyFirstStageResults`, `\'${surveyId}\'`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public CheckIfAllGeneralCouponsAreUnique(coupons: Array<GeneralCouponViewModel>) {
    return this.http.post(`https://${this.url}/Data/CheckIfAllGeneralCouponsAreUnique`, coupons, { observe: 'response' });
  }

  public CreateGeneralCoupons(coupons: Array<GeneralCouponViewModel>) {
    return this.http.post(`https://${this.url}/Data/CreateGeneralCoupons`, coupons, { observe: 'response' });
  }

  public DeleteSurveySecondStageResults(surveyId: number) {
    return this.http.post(`https://${this.url}/Data/DeleteSurveySecondStageResults`, `\'${surveyId}\'`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });

  }

  public GetValuesForFirstStage(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetValuesForFirstStage?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSelectedRegionsForCurrentUser() {
    return this.http.get(`https://${this.url}/Data/GetSelectedRegionsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedLanguagesForCurrentUser() {
    return this.http.get(`https://${this.url}/Data/GetSelectedLanguagesForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedPositionsForCurrentUser() {
    return this.http.get(`https://${this.url}/Data/GetSelectedPositionsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedEducationsForCurrentUser() {
    return this.http.get(`https://${this.url}/Data/GetSelectedEducationsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedSectorsOfActivityForCurrentUser() {
    return this.http.get(`https://${this.url}/Data/GetSelectedSectorsOfActivityForCurrentUser`, { observe: 'response' });
  }

  public GetFirstStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetFirstStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public GetSecondStageValues(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetSecondStageValues?surveyId=${surveyId}`, { observe: 'response' });
  }

  public CheckIfAllCouponsAreValid(listOfOrders: Array<OrderViewModel>) {
    return this.http.post(`https://${this.url}/Data/CheckIfAllCouponsAreValid`, listOfOrders, { observe: 'response' });
  }

  public GetCoupon(couponBody: string) {
    return this.http.get(`https://${this.url}/Data/GetCoupon?couponBody=${couponBody}`, { observe: 'response' });
  }

  public GoToPreviousStageOfTheSurvey(surveyId: number) {
    this.http.post(`https://${this.url}/Data/GoToPreviousStageOfTheSurvey`, surveyId, { observe: 'response' });
  }

  public TransferTheCode(transferCodesViewModel: TransferCodesViewModel) {
    return this.http.post(`https://${this.url}/Data/TransferTheCode`, transferCodesViewModel, { observe: 'response' });
  }

  public UserHasUnsignedSurveys(userId: string) {
    return this.http.get(`https://${this.url}/Data/UserHasUnsignedSurveys?userId=${userId}`, { observe: 'response' });
  }

  public GeneratePdf(content: ReportHTMLContentViewModel) {
    return this.http.post(`https://${this.url}/Data/GeneratePdf`, content, { observe: 'body', responseType: 'blob', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public AssociateUserDataToTheSurvey(userId: string) {
    return this.http.post(`https://${this.url}/Data/AssociateUserDataToTheSurvey`, `\"${userId}\"`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type':'application/json'}) });
  }

  public GenerateIndividualPdfReport(content: ReportHTMLContentViewModel) {
    return this.http.post(`https://${this.url}/Data/GenerateIndividualPdfReport`, content, { observe: 'body', responseType: 'blob', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
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

  public GetSurveyResults(userId: string) {
    return this.http.get(`https://${this.url}/Data/GetSurveyResults?userId=${userId}`, { observe: 'response' });
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

  public GetParticularSurveyResults(surveyId: number) {
    return this.http.get(`https://${this.url}/Data/GetParticularSurveyResults?surveyId=${surveyId}`, { observe: 'response' });
  }

}
