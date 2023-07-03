import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsSnacksComponent } from './meals-snacks.component';

describe('MealsSnacksComponent', () => {
  let component: MealsSnacksComponent;
  let fixture: ComponentFixture<MealsSnacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealsSnacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealsSnacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
