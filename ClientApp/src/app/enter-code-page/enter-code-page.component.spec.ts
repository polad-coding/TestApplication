import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterCodePageComponent } from './enter-code-page.component';

describe('EnterCodePageComponent', () => {
  let component: EnterCodePageComponent;
  let fixture: ComponentFixture<EnterCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterCodePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
