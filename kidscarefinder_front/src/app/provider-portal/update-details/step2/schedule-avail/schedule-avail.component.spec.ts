import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAvailComponent } from './schedule-avail.component';

describe('ScheduleAvailComponent', () => {
  let component: ScheduleAvailComponent;
  let fixture: ComponentFixture<ScheduleAvailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAvailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
