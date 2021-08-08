import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalMyAccountSectionComponent } from './personal-my-account-section.component';

describe('PersonalMyAccountSectionComponent', () => {
  let component: PersonalMyAccountSectionComponent;
  let fixture: ComponentFixture<PersonalMyAccountSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalMyAccountSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalMyAccountSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
