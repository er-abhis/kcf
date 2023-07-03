import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleReviewComponent } from './schedule-review.component';

describe('ScheduleReviewComponent', () => {
  let component: ScheduleReviewComponent;
  let fixture: ComponentFixture<ScheduleReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
