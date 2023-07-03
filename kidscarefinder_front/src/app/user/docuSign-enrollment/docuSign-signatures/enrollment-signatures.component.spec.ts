import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentSignaturesComponent } from './enrollment-signatures.component';

describe('EnrollmentSignaturesComponent', () => {
  let component: EnrollmentSignaturesComponent;
  let fixture: ComponentFixture<EnrollmentSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentSignaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
