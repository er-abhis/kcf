import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnrollmentDocumentsComponent } from './view-enrollment-documents.component';

describe('ViewEnrollmentDocumentsComponent', () => {
  let component: ViewEnrollmentDocumentsComponent;
  let fixture: ComponentFixture<ViewEnrollmentDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEnrollmentDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEnrollmentDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
