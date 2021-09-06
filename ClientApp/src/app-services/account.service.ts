import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPasswordViewModel } from '../view-models/reset-password-view-model';
import { UserViewModel } from '../view-models/user-view-model';
import { AppSettingsService } from './app-settings.service';

@Injectable()
export class AccountService {

  private url: string = AppSettingsService.CURRENT_DOMAIN;

  constructor(private http: HttpClient) { }

  public GetCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetCurrentUser`, { observe: 'response' });
  }

  public GetAllRegions() {
    return this.http.get(`https://${this.url}/Account/Regions`, { observe: 'response' });
  }

  public GetAllPositions() {
    return this.http.get(`https://${this.url}/Account/Positions`, { observe: 'response' });
  }

  public GetAllAgeGroups() {
    return this.http.get(`https://${this.url}/Account/AgeGroups`, { observe: 'response' });
  }

  public GetAllEducations() {
    return this.http.get(`https://${this.url}/Account/Educations`, { observe: 'response' });
  }

  public GetAllSectorsOfActivities() {
    return this.http.get(`https://${this.url}/Account/SectorsOfActivities`, { observe: 'response' });
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
    return this.http.post(`https://${this.url}/Account/UploadProfileImage`, `\"${data}\"`, {
      observe: 'response', headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  public GetAllCertifications() {
    return this.http.get(`https://${this.url}/Account/GetAllCertifications`, { observe: 'response' });
  }

  public GetPractitionersCertifications(userId: string) {
    return this.http.get(`https://${this.url}/Account/GetPractitionersCertifications?userId=${userId}`, { observe: 'response' });
  }

  public GetMembershipStatusOfTheUser(userId: string) {
    return this.http.get(`https://${this.url}/Account/GetMembershipStatusOfTheUser?userId=${userId}`, { observe: 'response' });
  }

  public GetMembershipStatus() {
    return this.http.get(`https://${this.url}/Account/GetMembershipStatus`, { observe: 'response' });
  }

  public RenewMembership() {
    return this.http.get(`https://${this.url}/Account/RenewMembership`, { observe: 'response' });
  }

  public UserHasUnsignedSurveys(userId: string) {
    return this.http.get(`https://${this.url}/Account/UserHasUnsignedSurveys?userId=${userId}`, { observe: 'response' });
  }

  public AssociateUserDataToTheSurvey(userId: string) {
    return this.http.post(`https://${this.url}/Account/AssociateUserDataToTheSurvey`, `\"${userId}\"`, { observe: 'response', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  public GetSelectedRegionsForCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetSelectedRegionsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedLanguagesForCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetSelectedLanguagesForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedPositionsForCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetSelectedPositionsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedEducationsForCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetSelectedEducationsForCurrentUser`, { observe: 'response' });
  }

  public GetSelectedSectorsOfActivityForCurrentUser() {
    return this.http.get(`https://${this.url}/Account/GetSelectedSectorsOfActivityForCurrentUser`, { observe: 'response' });
  }

  public EmailPasswordResetLink(email: string) {
    return this.http.get(`https://${this.url}/Account/EmailPasswordResetLink?email=${email}`, { observe: 'response' });
  }

  public ResetPassword(resetPasswordViewModel: ResetPasswordViewModel) {
    return this.http.post(`https://${this.url}/Account/ResetPassword`, resetPasswordViewModel, { observe: 'response' });
  }
}
