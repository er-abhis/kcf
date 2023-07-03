import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsSignupStepOneComponent } from './bs-signup-step-one.component';

describe('BsSignupStepOneComponent', () => {
  let component: BsSignupStepOneComponent;
  let fixture: ComponentFixture<BsSignupStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BsSignupStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BsSignupStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
