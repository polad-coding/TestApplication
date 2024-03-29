import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home/home.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SurveyComponent } from './survey/survey.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SigninFormComponent } from './signin-form/signin-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { JwtModule } from "@auth0/angular-jwt";
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { PractitionerAccountComponent } from './practitioner-account/practitioner-account.component';
import { PractitionerMyAccountSectionComponent } from './practitioner-my-account-section/practitioner-my-account-section.component';
import { PractitionerProDetailsSectionComponent } from './practitioner-pro-details-section/practitioner-pro-details-section.component';
import { SurveyFirstStageComponent } from './survey-first-stage/survey-first-stage.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { SurveySecondStageComponent } from './survey-second-stage/survey-second-stage.component';
import { AppSettingsService } from '../app-services/app-settings.service';
import { SurveyThirdStageComponent } from './survey-third-stage/survey-third-stage.component';
import { GetCodesComponent } from './get-codes/get-codes.component';
import { WrapUpComponent } from './wrap-up/wrap-up.component';
import { PersonalSurveyResultsAndReportsComponent } from './personal-survey-results-and-reports/personal-survey-results-and-reports.component';
import { PractitionerSurveyResultsAndReportsComponent } from './practitioner-survey-results-and-reports/practitioner-survey-results-and-reports.component';
import { EnterCodePageComponent } from './enter-code-page/enter-code-page.component';
import { CertificationAndMembershipComponent } from './certification-and-membership/certification-and-membership.component';
import { PractitionersDirectoryComponent } from './practitioners-directory/practitioners-directory.component';
import { PersonalReportComponent } from './personal-report/personal-report.component';
import { PractitionerReportComponent } from './practitioner-report/practitioner-report.component';
import { AuthorizationPageComponent } from './authorization-page/authorization-page.component';
import { PersonalMyAccountSectionComponent } from './personal-my-account-section/personal-my-account-section.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';
import { TestComponent } from './test/test.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationBarComponent,
    FooterComponent,
    SurveyComponent,
    PageTitleComponent,
    SigninComponent,
    SignupComponent,
    SigninFormComponent,
    SignupFormComponent,
    PersonalAccountComponent,
    PractitionerAccountComponent,
    PractitionerMyAccountSectionComponent,
    PractitionerProDetailsSectionComponent,
    SurveyFirstStageComponent,
    SurveySecondStageComponent,
    SurveyThirdStageComponent,
    GetCodesComponent,
    WrapUpComponent,
    PersonalSurveyResultsAndReportsComponent,
    PractitionerSurveyResultsAndReportsComponent,
    EnterCodePageComponent,
    CertificationAndMembershipComponent,
    PractitionersDirectoryComponent,
    PersonalReportComponent,
    PractitionerReportComponent,
    AuthorizationPageComponent,
    PersonalMyAccountSectionComponent,
    ResetPasswordPageComponent,
    TestComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    SimplebarAngularModule,
    ChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'survey', component: SurveyComponent },
      { path: 'authorizationPage', component: AuthorizationPageComponent },
      { path: 'personalAccount', component: PersonalAccountComponent },
      { path: 'practitionerAccount', component: PractitionerAccountComponent },
      { path: 'surveyFirstStage', component: SurveyFirstStageComponent },
      { path: 'surveySecondStage', component: SurveySecondStageComponent },
      { path: 'surveyThirdStage', component: SurveyThirdStageComponent },
      { path: 'personalReport', component: PersonalReportComponent },
      { path: 'practitionerReport', component: PractitionerReportComponent },
      { path: 'wrap-up', component: WrapUpComponent },
      { path: 'enterCode', component: EnterCodePageComponent },
      { path: 'practitionersDirectory', component: PractitionersDirectoryComponent },
      { path: 'resetPassword', component: ResetPasswordPageComponent },
      { path: 'Account/ResetPassword', component: ResetPasswordPageComponent },
      { path: 'test', component: TestComponent }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['praxis-dev-temp.com', 'localhost:5001', 'localhost:5000', 'localhost:44373'],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    AppSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
