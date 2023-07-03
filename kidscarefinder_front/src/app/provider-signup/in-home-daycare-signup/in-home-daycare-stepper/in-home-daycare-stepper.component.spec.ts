import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareStepperComponent } from './in-home-daycare-stepper.component';

describe('InHomeDaycareStepperComponent', () => {
  let component: InHomeDaycareStepperComponent;
  let fixture: ComponentFixture<InHomeDaycareStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
