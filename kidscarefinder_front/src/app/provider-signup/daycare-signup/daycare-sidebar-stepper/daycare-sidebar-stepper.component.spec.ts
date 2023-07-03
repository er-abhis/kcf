import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareSidebarStepperComponent } from './daycare-sidebar-stepper.component';

describe('DaycareSidebarStepperComponent', () => {
  let component: DaycareSidebarStepperComponent;
  let fixture: ComponentFixture<DaycareSidebarStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareSidebarStepperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareSidebarStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
