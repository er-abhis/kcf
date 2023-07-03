import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperMainComponent } from './stepper-main.component';

describe('StepperMainComponent', () => {
  let component: StepperMainComponent;
  let fixture: ComponentFixture<StepperMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
