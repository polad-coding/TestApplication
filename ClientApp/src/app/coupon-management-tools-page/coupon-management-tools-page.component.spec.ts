import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManagementToolsPageComponent } from './coupon-management-tools-page.component';

describe('CouponManagementToolsPageComponent', () => {
  let component: CouponManagementToolsPageComponent;
  let fixture: ComponentFixture<CouponManagementToolsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponManagementToolsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponManagementToolsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
