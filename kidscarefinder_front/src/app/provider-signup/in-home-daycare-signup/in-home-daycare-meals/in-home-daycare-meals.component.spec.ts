import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareMealsComponent } from './in-home-daycare-meals.component';

describe('InHomeDaycareMealsComponent', () => {
  let component: InHomeDaycareMealsComponent;
  let fixture: ComponentFixture<InHomeDaycareMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareMealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
