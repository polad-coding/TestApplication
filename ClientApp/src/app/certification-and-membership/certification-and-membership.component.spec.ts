import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationAndMembershipComponent } from './certification-and-membership.component';

describe('CertificationAndMembershipComponent', () => {
  let component: CertificationAndMembershipComponent;
  let fixture: ComponentFixture<CertificationAndMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationAndMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationAndMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
