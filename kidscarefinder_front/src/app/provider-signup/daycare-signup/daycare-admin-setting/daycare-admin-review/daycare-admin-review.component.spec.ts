import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAdminReviewComponent } from './daycare-admin-review.component';

describe('DaycareAdminReviewComponent', () => {
  let component: DaycareAdminReviewComponent;
  let fixture: ComponentFixture<DaycareAdminReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAdminReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAdminReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
