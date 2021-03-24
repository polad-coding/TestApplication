import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerProDetailsSectionComponent } from './practitioner-pro-details-section.component';

describe('PractitionerProDetailsSectionComponent', () => {
  let component: PractitionerProDetailsSectionComponent;
  let fixture: ComponentFixture<PractitionerProDetailsSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerProDetailsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerProDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
