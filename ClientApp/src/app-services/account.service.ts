import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserViewModel } from '../view-models/user-view-model';

@Injectable()
export class AccountService {

  private url: string = 'localhost:5001';

  constructor(private http: HttpClient) { }

  public GetCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetCurrentUser`, { observe: 'response' });
  }

  public GetAllRegions() {
    return this.http.get(`https://${this.url}/Account/Regions`, { observe: 'response' });
  }

  public GetAllLanguages() {
    return this.http.get(`https://${this.url}/Account/Languages`, { observe: 'response' });
  }

  public CheckIfMailIsRegistered(mail: string) {
    return this.http.get(`https://${this.url}/Account/MailIsRegistered`, { observe: 'response', params: { mail: `${mail}`} });
  }

  public CheckIfProfessionalMailIsRegistered(professionalEmail: string) {
    return this.http.get(`https://${this.url}/Account/ProfessionalEmailIsRegistered`, { observe: 'response', params: { professionalEmail: `${professionalEmail}` } });
  }

  public ChangeUserPersonalData(user: UserViewModel) {
    return this.http.post(`https://${this.url}/Account/ChangeUserPersonalData`, user, { observe: 'response' });
  }

  public UploadProfileImage(data: string) {
    console.log(data);
    return this.http.post(`https://${this.url}/Account/UploadProfileImage`, `\"${data}\"`, {
      observe: 'response', headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
