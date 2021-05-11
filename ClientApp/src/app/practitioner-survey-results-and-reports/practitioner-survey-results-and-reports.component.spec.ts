import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerSurveyResultsAndReportsComponent } from './practitioner-survey-results-and-reports.component';

describe('PractitionerSurveyResultsAndReportsComponent', () => {
  let component: PractitionerSurveyResultsAndReportsComponent;
  let fixture: ComponentFixture<PractitionerSurveyResultsAndReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerSurveyResultsAndReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerSurveyResultsAndReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
