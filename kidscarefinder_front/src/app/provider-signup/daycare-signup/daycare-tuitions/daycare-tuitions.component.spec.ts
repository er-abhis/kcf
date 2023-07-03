import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareTuitionsComponent } from './daycare-tuitions.component';

describe('DaycareTuitionsComponent', () => {
  let component: DaycareTuitionsComponent;
  let fixture: ComponentFixture<DaycareTuitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareTuitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareTuitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
