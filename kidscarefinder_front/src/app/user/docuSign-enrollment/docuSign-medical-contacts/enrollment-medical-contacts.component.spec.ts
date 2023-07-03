import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentMedicalContactsComponent } from './enrollment-medical-contacts.component';

describe('EnrollmentMedicalContactsComponent', () => {
  let component: EnrollmentMedicalContactsComponent;
  let fixture: ComponentFixture<EnrollmentMedicalContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentMedicalContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentMedicalContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
