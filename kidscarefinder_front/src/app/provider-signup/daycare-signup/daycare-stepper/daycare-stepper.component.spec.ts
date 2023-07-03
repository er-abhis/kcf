import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareStepperComponent } from './daycare-stepper.component';

describe('DaycareStepperComponent', () => {
  let component: DaycareStepperComponent;
  let fixture: ComponentFixture<DaycareStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
