import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCodesComponent } from './get-codes.component';

describe('GetCodesComponent', () => {
  let component: GetCodesComponent;
  let fixture: ComponentFixture<GetCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
