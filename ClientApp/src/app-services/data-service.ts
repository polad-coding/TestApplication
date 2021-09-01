import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PractitionersSearchFilterViewModel } from "../view-models/practitioners-search-filter-view-model";
import { ReportHTMLContentViewModel } from "../view-models/report-html-content-view-model";
import { AppSettingsService } from "./app-settings.service";

@Injectable()
export class DataService {

  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public GeneratePdf(content: ReportHTMLContentViewModel) {
    return this.http.post(`https://${this.url}/Data/GeneratePdf`, content, { observe: 'body', responseType: 'blob', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public GenerateIndividualPdfReport(content: ReportHTMLContentViewModel) {
    return this.http.post(`https://${this.url}/Data/GenerateIndividualPdfReport`, content, { observe: 'body', responseType: 'blob', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public GetAllValues() {
    return this.http.get(`https://${this.url}/Data/GetAllValues`, { observe: 'response' });
  }


  public GetPractitionersForDirectory(practitionersSearchFilterViewModel: PractitionersSearchFilterViewModel) {
    return this.http.post(`https://${this.url}/Data/GetPractitionersForDirectory`, practitionersSearchFilterViewModel, { observe: 'response' });
  }

  public ReturnNumberOfPractitioners() {
    return this.http.get(`https://${this.url}/Data/ReturnNumberOfPractitioners`, { observe: 'response' });
  }
}
