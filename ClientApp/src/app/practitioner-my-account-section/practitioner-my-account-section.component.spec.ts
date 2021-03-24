import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerMyAccountSectionComponent } from './practitioner-my-account-section.component';

describe('PractitionerMyAccountSectionComponent', () => {
  let component: PractitionerMyAccountSectionComponent;
  let fixture: ComponentFixture<PractitionerMyAccountSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerMyAccountSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerMyAccountSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
