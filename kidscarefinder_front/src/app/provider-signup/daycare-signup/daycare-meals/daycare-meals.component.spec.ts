import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareMealsComponent } from './daycare-meals.component';

describe('DaycareMealsComponent', () => {
  let component: DaycareMealsComponent;
  let fixture: ComponentFixture<DaycareMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareMealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
