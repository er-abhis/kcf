import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentStepperComponent } from './enrollment-stepper.component';

describe('EnrollmentStepperComponent', () => {
  let component: EnrollmentStepperComponent;
  let fixture: ComponentFixture<EnrollmentStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
