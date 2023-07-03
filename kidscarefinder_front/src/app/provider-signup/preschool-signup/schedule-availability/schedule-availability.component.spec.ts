import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAvailabilityComponent } from './schedule-availability.component';

describe('ScheduleAvailabilityComponent', () => {
  let component: ScheduleAvailabilityComponent;
  let fixture: ComponentFixture<ScheduleAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
