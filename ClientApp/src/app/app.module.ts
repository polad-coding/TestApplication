import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
import { TestComponent } from './test/test.component';
import { SurveyFirstStageComponent } from './survey-first-stage/survey-first-stage.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DragDropModule } from '@angular/cdk/drag-drop'; 
import { SurveySecondStageComponent } from './survey-second-stage/survey-second-stage.component';
import { AppSettingsService } from '../app-services/app-settings.service';
import { SurveyThirdStageComponent } from './survey-third-stage/survey-third-stage.component';

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
    TestComponent,
    SurveyFirstStageComponent,
    SurveySecondStageComponent,
    SurveyThirdStageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    SimplebarAngularModule,
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
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'personalAccount', component: PersonalAccountComponent },
      { path: 'practitionerAccount', component: PractitionerAccountComponent },
      { path: 'surveyFirstStage', component: SurveyFirstStageComponent },
      { path: 'surveySecondStage', component: SurveySecondStageComponent },
      { path: 'surveyThirdStage', component: SurveyThirdStageComponent },
      { path: 'success', component: TestComponent },
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['somefreedomain.ml', 'localhost:5000'],
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
