import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InHomeDaycareScheduleReviewComponent } from './in-home-daycare-schedule-review.component';

describe('InHomeDaycareScheduleReviewComponent', () => {
  let component: InHomeDaycareScheduleReviewComponent;
  let fixture: ComponentFixture<InHomeDaycareScheduleReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InHomeDaycareScheduleReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InHomeDaycareScheduleReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
