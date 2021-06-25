import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerReportComponent } from './practitioner-report.component';

describe('PractitionerReportComponent', () => {
  let component: PractitionerReportComponent;
  let fixture: ComponentFixture<PractitionerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
