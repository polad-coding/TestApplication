import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterViewModel } from "../view-models/register-view-model";
import { SignInViewModel } from "../view-models/signin-view-model";

@Injectable()
export class AuthenticationService {

  private url: string = 'somefreedomail.ml';

  constructor(private http: HttpClient) {

  }

  public SignInUser(signInViewModel: SignInViewModel): Observable<HttpResponse<any>> {
    return this.http.post(`https://${this.url}/Authentication/SignInUser`, signInViewModel, { observe:'response' });
  }

  public RegisterUser(registerViewModel: RegisterViewModel): Observable<HttpResponse<any>> {
    return this.http.post(`https://${this.url}/Authentication/RegisterUser`, registerViewModel, { observe: 'response' });
  }

}
