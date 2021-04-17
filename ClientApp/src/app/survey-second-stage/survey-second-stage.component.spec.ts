import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySecondStageComponent } from './survey-second-stage.component';

describe('SurveySecondStageComponent', () => {
  let component: SurveySecondStageComponent;
  let fixture: ComponentFixture<SurveySecondStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveySecondStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveySecondStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
