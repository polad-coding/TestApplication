import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class SurveyService {
  private url: string = 'localhost:5001';


  constructor(private http: HttpClient) { }

  public CreateSurvey(code: string, surveyPractitionerId: string) {
    return this.http.post(`https://${this.url}/Survey/CreateSurvey`, { code: code, surveyPractitionerId: surveyPractitionerId }, {
      observe: 'response' });
  }
}
