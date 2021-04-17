import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class SurveyService {
  private url: string = 'somefreedomain.ml';


  constructor(private http: HttpClient) { }

  public CreateSurvey(code: string) {
    console.log(code);
    let body = new HttpParams();
    body = body.set('code', code);
    return this.http.post(`https://${this.url}/Survey/CreateSurvey`, `\"${code}\"`, {
      observe: 'response', headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }) });
  }
}
