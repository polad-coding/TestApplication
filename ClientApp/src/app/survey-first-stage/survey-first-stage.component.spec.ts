import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyFirstStageComponent } from './survey-first-stage.component';

describe('SurveyFirstStageComponent', () => {
  let component: SurveyFirstStageComponent;
  let fixture: ComponentFixture<SurveyFirstStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyFirstStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyFirstStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
