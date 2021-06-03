import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterSurveyAccountFormComponent } from './enter-survey-account-form.component';

describe('EnterSurveyAccountFormComponent', () => {
  let component: EnterSurveyAccountFormComponent;
  let fixture: ComponentFixture<EnterSurveyAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterSurveyAccountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterSurveyAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
