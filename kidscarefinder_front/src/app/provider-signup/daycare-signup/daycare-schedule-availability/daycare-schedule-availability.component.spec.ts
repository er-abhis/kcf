import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareScheduleAvailabilityComponent } from './daycare-schedule-availability.component';

describe('DaycareScheduleAvailabilityComponent', () => {
  let component: DaycareScheduleAvailabilityComponent;
  let fixture: ComponentFixture<DaycareScheduleAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareScheduleAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareScheduleAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
