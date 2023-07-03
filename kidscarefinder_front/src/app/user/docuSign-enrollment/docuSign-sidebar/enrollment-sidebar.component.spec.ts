import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentSidebarComponent } from './enrollment-sidebar.component';

describe('EnrollmentSidebarComponent', () => {
  let component: EnrollmentSidebarComponent;
  let fixture: ComponentFixture<EnrollmentSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
