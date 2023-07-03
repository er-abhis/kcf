import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentValidationComponent } from './enrollment-validation.component';

describe('EnrollmentValidationComponent', () => {
  let component: EnrollmentValidationComponent;
  let fixture: ComponentFixture<EnrollmentValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
