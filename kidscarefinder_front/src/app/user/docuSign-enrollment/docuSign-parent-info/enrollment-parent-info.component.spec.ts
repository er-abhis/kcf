import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentParentInfoComponent } from './enrollment-parent-info.component';

describe('EnrollmentParentInfoComponent', () => {
  let component: EnrollmentParentInfoComponent;
  let fixture: ComponentFixture<EnrollmentParentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentParentInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentParentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
