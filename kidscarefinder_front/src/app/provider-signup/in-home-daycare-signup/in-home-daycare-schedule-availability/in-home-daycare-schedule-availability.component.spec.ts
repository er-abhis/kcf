import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareScheduleAvailabilityComponent } from './in-home-daycare-schedule-availability.component';

describe('InHomeDaycareScheduleAvailabilityComponent', () => {
  let component: InHomeDaycareScheduleAvailabilityComponent;
  let fixture: ComponentFixture<InHomeDaycareScheduleAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareScheduleAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareScheduleAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
