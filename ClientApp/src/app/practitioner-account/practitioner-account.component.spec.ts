import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerAccountComponent } from './practitioner-account.component';

describe('PractitionerAccountComponent', () => {
  let component: PractitionerAccountComponent;
  let fixture: ComponentFixture<PractitionerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
