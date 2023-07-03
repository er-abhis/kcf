import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareTuitionsComponent } from './in-home-daycare-tuitions.component';

describe('InHomeDaycareTuitionsComponent', () => {
  let component: InHomeDaycareTuitionsComponent;
  let fixture: ComponentFixture<InHomeDaycareTuitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareTuitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareTuitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
