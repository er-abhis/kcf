import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareScheduleReviewComponent } from './daycare-schedule-review.component';

describe('DaycareScheduleReviewComponent', () => {
  let component: DaycareScheduleReviewComponent;
  let fixture: ComponentFixture<DaycareScheduleReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareScheduleReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareScheduleReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
