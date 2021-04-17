import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyThirdStageComponent } from './survey-third-stage.component';

describe('SurveyThirdStageComponent', () => {
  let component: SurveyThirdStageComponent;
  let fixture: ComponentFixture<SurveyThirdStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyThirdStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyThirdStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
