import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionersDirectoryComponent } from './practitioners-directory.component';

describe('PractitionersDirectoryComponent', () => {
  let component: PractitionersDirectoryComponent;
  let fixture: ComponentFixture<PractitionersDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionersDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionersDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
