import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderViewModel } from "../view-models/order-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class SurveyService {
  private url: string = AppSettingsService.CURRENT_DOMAIN;


  constructor(private http: HttpClient) { }

  //public CreateSurvey(code: string, surveyPractitionerId: string, numberOfUsages: number) {
  //  return this.http.post(`https://${this.url}/Survey/CreateSurvey`, { code: code, surveyPractitionerId: surveyPractitionerId, numberOfUsages: numberOfUsages }, {
  //    observe: 'response' });
  //}

  public CreateSurvey(orders: OrderViewModel) {
    return this.http.post(`https://${this.url}/Survey/CreateSurvey`, orders, {observe: 'response'});
  }
}
