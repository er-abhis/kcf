import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStepOneComponent } from './review-step-one.component';

describe('ReviewStepOneComponent', () => {
  let component: ReviewStepOneComponent;
  let fixture: ComponentFixture<ReviewStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
