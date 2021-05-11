import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSurveyResultsAndReportsComponent } from './personal-survey-results-and-reports.component';

describe('PersonalSurveyResultsAndReportsComponent', () => {
  let component: PersonalSurveyResultsAndReportsComponent;
  let fixture: ComponentFixture<PersonalSurveyResultsAndReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalSurveyResultsAndReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalSurveyResultsAndReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
