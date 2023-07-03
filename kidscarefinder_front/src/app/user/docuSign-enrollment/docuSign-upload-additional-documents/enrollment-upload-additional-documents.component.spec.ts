import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentUploadAdditionalDocumentsComponent } from './enrollment-upload-additional-documents.component';

describe('EnrollmentUploadAdditionalDocumentsComponent', () => {
  let component: EnrollmentUploadAdditionalDocumentsComponent;
  let fixture: ComponentFixture<EnrollmentUploadAdditionalDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentUploadAdditionalDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentUploadAdditionalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
