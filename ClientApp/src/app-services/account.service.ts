import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserViewModel } from '../view-models/user-view-model';

@Injectable()
export class AccountService {

  constructor(private http: HttpClient) { }

  public GetCurrentUser() {
    return this.http.get('https://localhost:5001/Account/', { observe: 'response' });
  }

  public GetAllRegions() {
    return this.http.get('https://localhost:5001/Account/Regions', { observe: 'response' });
  }

  public CheckIfMailIsRegistered(mail: string) {
    return this.http.get(`https://localhost:5001/Account/MailIsRegistered`, { observe: 'response', params: { mail: `${mail}`} });
  }

  public ChangeUserPersonalData(user: UserViewModel) {
    return this.http.post('https://localhost:5001/Account/ChangeUserPersonalData', user, { observe: 'response' });
  }

  public UploadProfileImage(data: string) {
    console.log(data);
    return this.http.post('https://localhost:5001/Account/UploadProfileImage', `\"${data}\"`, {
      observe: 'response', headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
