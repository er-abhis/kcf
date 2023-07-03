import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentHealthHistoryComponent } from './enrollment-health-history.component';

describe('EnrollmentHealthHistoryComponent', () => {
  let component: EnrollmentHealthHistoryComponent;
  let fixture: ComponentFixture<EnrollmentHealthHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentHealthHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentHealthHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
