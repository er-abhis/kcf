import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentAuthorizedPersonsComponent } from './enrollment-authorized-persons.component';

describe('EnrollmentAuthorizedPersonsComponent', () => {
  let component: EnrollmentAuthorizedPersonsComponent;
  let fixture: ComponentFixture<EnrollmentAuthorizedPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentAuthorizedPersonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentAuthorizedPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
