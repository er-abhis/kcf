import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsSignupStepOneSubStepOneComponent } from './bs-signup-step-one-sub-step-one.component';

describe('BsSignupStepOneSubStepOneComponent', () => {
  let component: BsSignupStepOneSubStepOneComponent;
  let fixture: ComponentFixture<BsSignupStepOneSubStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsSignupStepOneSubStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsSignupStepOneSubStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
