import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycareAffiliationReviewComponent } from './daycare-affiliation-review.component';

describe('DaycareAffiliationReviewComponent', () => {
  let component: DaycareAffiliationReviewComponent;
  let fixture: ComponentFixture<DaycareAffiliationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaycareAffiliationReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaycareAffiliationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
