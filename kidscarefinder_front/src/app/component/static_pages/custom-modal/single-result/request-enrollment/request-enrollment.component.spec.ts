import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestEnrollmentComponent } from './request-enrollment.component';

describe('RequestEnrollmentComponent', () => {
  let component: RequestEnrollmentComponent;
  let fixture: ComponentFixture<RequestEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestEnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
